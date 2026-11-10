package com.guidewire.itv.service;

import com.guidewire.itv.dto.ConfidenceBreakdownDto;
import com.guidewire.itv.entity.*;
import com.guidewire.itv.exception.ResourceNotFoundException;
import com.guidewire.itv.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ContinuousMonitoringService {

    private static final Logger log = LoggerFactory.getLogger(ContinuousMonitoringService.class);

    private final PolicyRepository policyRepository;
    private final RebuildingCostEstimateRepository estimateRepository;
    private final EvidenceRecordRepository evidenceRepository;
    private final MonitoringEvaluationRepository evaluationRepository;
    private final ReviewCaseRepository reviewCaseRepository;
    private final ItvEngineService itvEngineService;
    private final EvidenceConfidenceService confidenceService;
    private final AuditLogService auditLogService;

    public ContinuousMonitoringService(PolicyRepository policyRepository,
                                       RebuildingCostEstimateRepository estimateRepository,
                                       EvidenceRecordRepository evidenceRepository,
                                       MonitoringEvaluationRepository evaluationRepository,
                                       ReviewCaseRepository reviewCaseRepository,
                                       ItvEngineService itvEngineService,
                                       EvidenceConfidenceService confidenceService,
                                       AuditLogService auditLogService) {
        this.policyRepository = policyRepository;
        this.estimateRepository = estimateRepository;
        this.evidenceRepository = evidenceRepository;
        this.evaluationRepository = evaluationRepository;
        this.reviewCaseRepository = reviewCaseRepository;
        this.itvEngineService = itvEngineService;
        this.confidenceService = confidenceService;
        this.auditLogService = auditLogService;
    }

    /**
     * Daily Scheduled Continuous Monitoring: Runs automated batch evaluation.
     */
    @Scheduled(cron = "${app.monitoring.scheduled-cron:0 0 2 * * ?}")
    @Transactional
    public void runScheduledDailyMonitoring() {
        log.info("Starting automated continuous daily in-force monitoring scan...");
        runBatchMonitoring("SCHEDULED_DAILY");
        log.info("Automated continuous daily monitoring scan completed.");
    }

    /**
     * Runs continuous monitoring across all active policies.
     */
    @Transactional
    public int runBatchMonitoring(String triggerType) {
        List<Policy> activePolicies = policyRepository.findByPolicyStatus("ACTIVE");
        int evaluatedCount = 0;

        for (Policy policy : activePolicies) {
            try {
                evaluatePolicyInternal(policy, triggerType);
                evaluatedCount++;
            } catch (Exception ex) {
                log.error("Failed to evaluate policy {}: {}", policy.getPolicyNumber(), ex.getMessage());
            }
        }

        auditLogService.log("SYSTEM_MONITOR", "BATCH_MONITORING_COMPLETED", "POLICY_BATCH",
                "COUNT_" + evaluatedCount, "Evaluated " + evaluatedCount + " in-force policies with trigger: " + triggerType);

        return evaluatedCount;
    }

    /**
     * Manual or Event-Driven reassessment for a specific policy.
     */
    @Transactional
    public MonitoringEvaluation evaluatePolicy(Long policyId, String triggerType) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + policyId));
        return evaluatePolicyInternal(policy, triggerType);
    }

    private MonitoringEvaluation evaluatePolicyInternal(Policy policy, String triggerType) {
        Property property = policy.getProperty();

        // 1. Fetch Primary and all secondary estimates
        List<RebuildingCostEstimate> primaryEstimates = estimateRepository.findPrimaryEstimatesByPropertyId(property.getId());
        List<RebuildingCostEstimate> allEstimates = estimateRepository.findAllEstimatesByPropertyId(property.getId());

        RebuildingCostEstimate primaryEstimate;
        if (!primaryEstimates.isEmpty()) {
            primaryEstimate = primaryEstimates.get(0);
        } else if (!allEstimates.isEmpty()) {
            primaryEstimate = allEstimates.get(0);
        } else {
            throw new ResourceNotFoundException("No rebuilding cost estimates found for property: " + property.getPropertyCode());
        }

        List<EvidenceRecord> evidenceRecords = evidenceRepository.findByPropertyIdOrderByPublicationDateDesc(property.getId());

        // 2. Perform ITV Math
        BigDecimal coverage = policy.getCurrentCoverageLimit();
        BigDecimal rebuildingCost = primaryEstimate.getEstimatedCost();

        BigDecimal itvRatio = itvEngineService.calculateItvRatio(coverage, rebuildingCost);
        BigDecimal potentialGap = itvEngineService.calculateCoverageGap(coverage, rebuildingCost);
        String classification = itvEngineService.classifyItv(itvRatio);

        // 3. Find prior evaluation to compute drift
        List<MonitoringEvaluation> priorEvaluations = evaluationRepository.findLatestByPolicyId(policy.getId());
        BigDecimal previousItv = priorEvaluations.isEmpty() ? null : priorEvaluations.get(0).getItvRatio();
        BigDecimal drift = itvEngineService.calculateItvDrift(itvRatio, previousItv);

        // 4. Evidence Confidence & Hard Abstention Evaluation
        ConfidenceBreakdownDto confidence = confidenceService.evaluateConfidence(property, primaryEstimate, allEstimates, evidenceRecords);

        // 5. Build and save immutable snapshot evaluation
        MonitoringEvaluation eval = new MonitoringEvaluation();
        eval.setPolicy(policy);
        eval.setEvaluationTimestamp(LocalDateTime.now());
        eval.setTriggerType(triggerType);
        eval.setDwellingCoverage(coverage);
        eval.setRebuildingCost(rebuildingCost);
        eval.setItvRatio(itvRatio);
        eval.setPotentialCoverageGap(potentialGap);
        eval.setItvDrift(drift);
        eval.setItvClassification(classification);
        eval.setConfidenceScore(confidence.getOverallScore());
        eval.setConfidenceCategory(confidence.getCategory());
        eval.setAbstentionTriggered(confidence.getAbstentionTriggered());

        if (confidence.getAbstentionTriggered()) {
            eval.setAbstentionReasons(String.join("; ", confidence.getAbstentionReasons()));
            eval.setRecommendationText("ABSTAIN: " + confidence.getRecommendedVerificationAction());
        } else {
            eval.setRecommendationText(generateRecommendationText(policy, itvRatio, potentialGap, classification));
        }

        MonitoringEvaluation savedEval = evaluationRepository.save(eval);

        // 6. Idempotent Review Case Creation
        handleReviewCaseCreation(policy, savedEval, confidence);

        return savedEval;
    }

    private void handleReviewCaseCreation(Policy policy, MonitoringEvaluation eval, ConfidenceBreakdownDto confidence) {
        boolean isActionable = "CRITICAL".equals(eval.getItvClassification())
                || "WARNING".equals(eval.getItvClassification())
                || eval.getAbstentionTriggered();

        if (!isActionable) {
            return;
        }

        // Check if open case already exists for this policy (prevent duplicates)
        List<ReviewCase> existingCases = reviewCaseRepository.findByPolicyId(policy.getId());
        boolean hasOpenCase = existingCases.stream()
                .anyMatch(c -> "OPEN".equals(c.getStatus())
                        || "UNDER_REVIEW".equals(c.getStatus())
                        || "EVIDENCE_REQUESTED".equals(c.getStatus()));

        if (!hasOpenCase) {
            ReviewCase newCase = new ReviewCase();
            newCase.setCaseNumber("CASE-" + policy.getPolicyNumber().replace("POL-IN-", "") + "-" + System.currentTimeMillis() % 10000);
            newCase.setPolicy(policy);
            newCase.setCurrentItvRatio(eval.getItvRatio());
            newCase.setCoverageGap(eval.getPotentialCoverageGap());

            if (eval.getAbstentionTriggered()) {
                newCase.setCaseType("EVIDENCE_VERIFICATION");
                newCase.setStatus("EVIDENCE_REQUESTED");
            } else {
                long daysToExpiry = ChronoUnit.DAYS.between(LocalDate.now(), policy.getExpiryDate());
                if (daysToExpiry <= 90) {
                    newCase.setCaseType("RENEWAL_UNDERINSURANCE");
                    policy.setWorkflowType("RENEWAL_WINDOW");
                } else {
                    newCase.setCaseType("MIDTERM_UNDERINSURANCE");
                    policy.setWorkflowType("MIDTERM_REVIEW");
                }
                newCase.setStatus("OPEN");
            }

            reviewCaseRepository.save(newCase);
            policyRepository.save(policy);

            auditLogService.log("SYSTEM_MONITOR", "CASE_AUTOMATICALLY_OPENED", "REVIEW_CASE",
                    newCase.getCaseNumber(), "Generated " + newCase.getCaseType() + " case for policy " + policy.getPolicyNumber());
        }
    }

    private String generateRecommendationText(Policy policy, BigDecimal itvRatio, BigDecimal gap, String classification) {
        if ("ADEQUATE".equals(classification)) {
            return "Coverage is adequate (ITV: " + itvRatio + "%). No adjustment required at this time.";
        } else if ("WATCH".equals(classification)) {
            return "Policy in Watch state (ITV: " + itvRatio + "%). Monitor at upcoming renewal cycle.";
        } else if ("WARNING".equals(classification)) {
            return "Warning: Potential underinsurance detected (ITV: " + itvRatio + "%). Coverage shortfall: ₹"
                    + gap + ". Propose endorsement to restore coverage to 95% ITV benchmark.";
        } else {
            return "CRITICAL UNDERINSURANCE ALERT: Policy ITV has deteriorated to " + itvRatio + "%. Immediate coverage shortfall: ₹"
                    + gap + ". Authorize midterm endorsement or initiate renewal coverage revision.";
        }
    }
}

