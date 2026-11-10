package com.guidewire.itv.service;

import com.guidewire.itv.dto.PortfolioAnalyticsDto;
import com.guidewire.itv.entity.MonitoringEvaluation;
import com.guidewire.itv.repository.MonitoringEvaluationRepository;
import com.guidewire.itv.repository.PolicyRepository;
import com.guidewire.itv.repository.ReviewCaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PortfolioAnalyticsService {

    private final PolicyRepository policyRepository;
    private final MonitoringEvaluationRepository evaluationRepository;
    private final ReviewCaseRepository reviewCaseRepository;

    public PortfolioAnalyticsService(PolicyRepository policyRepository,
                                     MonitoringEvaluationRepository evaluationRepository,
                                     ReviewCaseRepository reviewCaseRepository) {
        this.policyRepository = policyRepository;
        this.evaluationRepository = evaluationRepository;
        this.reviewCaseRepository = reviewCaseRepository;
    }

    @Transactional(readOnly = true)
    public PortfolioAnalyticsDto getPortfolioAnalytics() {
        PortfolioAnalyticsDto dto = new PortfolioAnalyticsDto();

        long totalPolicies = policyRepository.countByPolicyStatus("ACTIVE");
        dto.setTotalPoliciesMonitored(totalPolicies);

        List<MonitoringEvaluation> latestEvaluations = evaluationRepository.findLatestEvaluationsForAllPolicies();

        long adequate = 0;
        long watch = 0;
        long warning = 0;
        long critical = 0;
        BigDecimal totalGap = BigDecimal.ZERO;
        long lowConfidence = 0;

        Map<String, Long> classDist = new HashMap<>();
        classDist.put("ADEQUATE", 0L);
        classDist.put("WATCH", 0L);
        classDist.put("WARNING", 0L);
        classDist.put("CRITICAL", 0L);

        Map<String, Long> confDist = new HashMap<>();
        confDist.put("HIGH", 0L);
        confDist.put("MEDIUM", 0L);
        confDist.put("LOW", 0L);

        for (MonitoringEvaluation e : latestEvaluations) {
            String cls = e.getItvClassification();
            classDist.put(cls, classDist.getOrDefault(cls, 0L) + 1);

            if ("ADEQUATE".equalsIgnoreCase(cls)) adequate++;
            else if ("WATCH".equalsIgnoreCase(cls)) watch++;
            else if ("WARNING".equalsIgnoreCase(cls)) warning++;
            else if ("CRITICAL".equalsIgnoreCase(cls)) critical++;

            if (e.getPotentialCoverageGap() != null) {
                totalGap = totalGap.add(e.getPotentialCoverageGap());
            }

            String conf = e.getConfidenceCategory();
            confDist.put(conf, confDist.getOrDefault(conf, 0L) + 1);

            if ("LOW".equalsIgnoreCase(conf) || Boolean.TRUE.equals(e.getAbstentionTriggered())) {
                lowConfidence++;
            }
        }

        dto.setAdequateCount(adequate);
        dto.setWatchCount(watch);
        dto.setWarningCount(warning);
        dto.setCriticalCount(critical);
        dto.setTotalPortfolioCoverageGap(totalGap);
        dto.setLowConfidenceAbstentionsCount(lowConfidence);
        dto.setClassificationDistribution(classDist);
        dto.setConfidenceDistribution(confDist);

        long openCases = reviewCaseRepository.countByStatus("OPEN")
                + reviewCaseRepository.countByStatus("UNDER_REVIEW")
                + reviewCaseRepository.countByStatus("EVIDENCE_REQUESTED");
        long resolvedCases = reviewCaseRepository.countByStatus("RESOLVED")
                + reviewCaseRepository.countByStatus("CLOSED");

        dto.setOpenCasesCount(openCases);
        dto.setResolvedCasesCount(resolvedCases);

        long totalCases = openCases + resolvedCases;
        double resRate = totalCases > 0 ? ((double) resolvedCases / totalCases) * 100.0 : 0.0;
        dto.setResolutionRatePercent(Math.round(resRate * 10.0) / 10.0);

        LocalDate today = LocalDate.now();
        LocalDate renewalHorizon = today.plusDays(90);
        long pendingRenewals = policyRepository.findPoliciesApproachingRenewal(today, renewalHorizon).size();
        dto.setPendingRenewalsCount(pendingRenewals);

        return dto;
    }
}
