package com.guidewire.itv.service;

import com.guidewire.itv.dto.*;
import com.guidewire.itv.entity.*;
import com.guidewire.itv.exception.ResourceNotFoundException;
import com.guidewire.itv.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final PropertyRepository propertyRepository;
    private final CoverageSnapshotRepository snapshotRepository;
    private final RebuildingCostEstimateRepository estimateRepository;
    private final EvidenceRecordRepository evidenceRepository;
    private final MonitoringEvaluationRepository evaluationRepository;
    private final ReviewCaseRepository reviewCaseRepository;

    public PolicyService(PolicyRepository policyRepository,
                         PropertyRepository propertyRepository,
                         CoverageSnapshotRepository snapshotRepository,
                         RebuildingCostEstimateRepository estimateRepository,
                         EvidenceRecordRepository evidenceRepository,
                         MonitoringEvaluationRepository evaluationRepository,
                         ReviewCaseRepository reviewCaseRepository) {
        this.policyRepository = policyRepository;
        this.propertyRepository = propertyRepository;
        this.snapshotRepository = snapshotRepository;
        this.estimateRepository = estimateRepository;
        this.evidenceRepository = evidenceRepository;
        this.evaluationRepository = evaluationRepository;
        this.reviewCaseRepository = reviewCaseRepository;
    }

    @Transactional(readOnly = true)
    public List<PolicySummaryDto> getPolicySummaries(String status, String classification, String search) {
        List<Policy> policies = policyRepository.findAll();
        List<PolicySummaryDto> summaries = new ArrayList<>();

        for (Policy policy : policies) {
            if (status != null && !status.trim().isEmpty() && !policy.getPolicyStatus().equalsIgnoreCase(status)) {
                continue;
            }

            if (search != null && !search.trim().isEmpty()) {
                String q = search.toLowerCase();
                boolean matches = policy.getPolicyNumber().toLowerCase().contains(q)
                        || policy.getPolicyholderName().toLowerCase().contains(q)
                        || policy.getProperty().getCity().toLowerCase().contains(q);
                if (!matches) continue;
            }

            PolicySummaryDto summary = buildSummary(policy);

            if (classification != null && !classification.trim().isEmpty()
                    && !summary.getItvClassification().equalsIgnoreCase(classification)) {
                continue;
            }

            summaries.add(summary);
        }

        return summaries;
    }

    @Transactional(readOnly = true)
    public PolicyDetailDto getPolicyDetail(Long id) {
        Policy policy = policyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + id));

        PolicyDetailDto dto = new PolicyDetailDto();
        dto.setId(policy.getId());
        dto.setPolicyNumber(policy.getPolicyNumber());
        dto.setPolicyholderName(policy.getPolicyholderName());
        dto.setPolicyholderEmail(policy.getPolicyholderEmail());
        dto.setCurrency(policy.getCurrency());
        dto.setCurrentCoverageLimit(policy.getCurrentCoverageLimit());
        dto.setInceptionDate(policy.getInceptionDate());
        dto.setExpiryDate(policy.getExpiryDate());
        dto.setPolicyStatus(policy.getPolicyStatus());
        dto.setWorkflowType(policy.getWorkflowType());

        // Property
        dto.setProperty(toPropertyDto(policy.getProperty()));

        // Coverage Snapshots
        List<CoverageSnapshotDto> snapshots = snapshotRepository.findByPolicyIdOrderByEffectiveDateAsc(policy.getId()).stream()
                .map(this::toSnapshotDto)
                .collect(Collectors.toList());
        dto.setCoverageHistory(snapshots);

        // Estimates
        List<RebuildingEstimateDto> estimates = estimateRepository.findByPropertyIdOrderByEstimateDateAsc(policy.getProperty().getId()).stream()
                .map(this::toEstimateDto)
                .collect(Collectors.toList());
        dto.setEstimateHistory(estimates);

        // Evaluations
        List<MonitoringEvaluationDto> evaluations = evaluationRepository.findByPolicyIdOrderByEvaluationTimestampAsc(policy.getId()).stream()
                .map(this::toEvaluationDto)
                .collect(Collectors.toList());
        dto.setEvaluationHistory(evaluations);

        // Evidence
        List<EvidenceRecordDto> evidence = evidenceRepository.findByPropertyIdOrderByPublicationDateDesc(policy.getProperty().getId()).stream()
                .map(this::toEvidenceDto)
                .collect(Collectors.toList());
        dto.setEvidenceRecords(evidence);

        // Review Cases
        List<ReviewCaseDto> cases = reviewCaseRepository.findByPolicyId(policy.getId()).stream()
                .map(this::toCaseDto)
                .collect(Collectors.toList());
        dto.setReviewCases(cases);

        return dto;
    }

    private PolicySummaryDto buildSummary(Policy policy) {
        PolicySummaryDto dto = new PolicySummaryDto();
        dto.setId(policy.getId());
        dto.setPolicyNumber(policy.getPolicyNumber());
        dto.setPolicyholderName(policy.getPolicyholderName());
        dto.setCity(policy.getProperty().getCity());
        dto.setState(policy.getProperty().getState());
        dto.setCurrentCoverageLimit(policy.getCurrentCoverageLimit());
        dto.setInceptionDate(policy.getInceptionDate());
        dto.setExpiryDate(policy.getExpiryDate());
        dto.setPolicyStatus(policy.getPolicyStatus());
        dto.setWorkflowType(policy.getWorkflowType());

        List<RebuildingCostEstimate> estimates = estimateRepository.findPrimaryEstimatesByPropertyId(policy.getProperty().getId());
        if (!estimates.isEmpty()) {
            dto.setLatestRebuildingCost(estimates.get(0).getEstimatedCost());
        } else {
            dto.setLatestRebuildingCost(BigDecimal.ZERO);
        }

        List<MonitoringEvaluation> evals = evaluationRepository.findLatestByPolicyId(policy.getId());
        if (!evals.isEmpty()) {
            MonitoringEvaluation latest = evals.get(0);
            dto.setCurrentItvRatio(latest.getItvRatio());
            dto.setPotentialCoverageGap(latest.getPotentialCoverageGap());
            dto.setItvDrift(latest.getItvDrift());
            dto.setItvClassification(latest.getItvClassification());
            dto.setConfidenceScore(latest.getConfidenceScore());
            dto.setConfidenceCategory(latest.getConfidenceCategory());
            dto.setAbstentionTriggered(latest.getAbstentionTriggered());
        } else {
            dto.setCurrentItvRatio(BigDecimal.ZERO);
            dto.setPotentialCoverageGap(BigDecimal.ZERO);
            dto.setItvDrift(BigDecimal.ZERO);
            dto.setItvClassification("UNKNOWN");
            dto.setConfidenceScore(BigDecimal.ZERO);
            dto.setConfidenceCategory("LOW");
            dto.setAbstentionTriggered(false);
        }

        return dto;
    }

    private PropertyDto toPropertyDto(Property p) {
        PropertyDto d = new PropertyDto();
        d.setId(p.getId());
        d.setPropertyCode(p.getPropertyCode());
        d.setAddressLine1(p.getAddressLine1());
        d.setCity(p.getCity());
        d.setDistrict(p.getDistrict());
        d.setState(p.getState());
        d.setPostalCode(p.getPostalCode());
        d.setLatitude(p.getLatitude());
        d.setLongitude(p.getLongitude());
        d.setConstructionType(p.getConstructionType());
        d.setYearBuilt(p.getYearBuilt());
        d.setNumberOfFloors(p.getNumberOfFloors());
        d.setGroundFootprintSqm(p.getGroundFootprintSqm());
        d.setBuiltUpAreaSqm(p.getBuiltUpAreaSqm());
        d.setLandUseType(p.getLandUseType());
        d.setHasRecentRenovation(p.getHasRecentRenovation());
        d.setRenovationDetails(p.getRenovationDetails());
        return d;
    }

    private CoverageSnapshotDto toSnapshotDto(CoverageSnapshot s) {
        CoverageSnapshotDto d = new CoverageSnapshotDto();
        d.setId(s.getId());
        d.setPolicyId(s.getPolicy().getId());
        d.setEffectiveDate(s.getEffectiveDate());
        d.setCoverageLimit(s.getCoverageLimit());
        d.setEndorsementNumber(s.getEndorsementNumber());
        d.setReason(s.getReason());
        d.setRecordedAt(s.getRecordedAt());
        return d;
    }

    private RebuildingEstimateDto toEstimateDto(RebuildingCostEstimate e) {
        RebuildingEstimateDto d = new RebuildingEstimateDto();
        d.setId(e.getId());
        d.setPropertyId(e.getProperty().getId());
        d.setEstimateDate(e.getEstimateDate());
        d.setEstimatedCost(e.getEstimatedCost());
        d.setCostPerSqm(e.getCostPerSqm());
        d.setMethodology(e.getMethodology());
        d.setSourceName(e.getSourceName());
        d.setProvenanceCategory(e.getProvenanceCategory());
        d.setIsPrimary(e.getIsPrimary());
        d.setCreatedAt(e.getCreatedAt());
        return d;
    }

    private MonitoringEvaluationDto toEvaluationDto(MonitoringEvaluation e) {
        MonitoringEvaluationDto d = new MonitoringEvaluationDto();
        d.setId(e.getId());
        d.setPolicyId(e.getPolicy().getId());
        d.setPolicyNumber(e.getPolicy().getPolicyNumber());
        d.setEvaluationTimestamp(e.getEvaluationTimestamp());
        d.setTriggerType(e.getTriggerType());
        d.setDwellingCoverage(e.getDwellingCoverage());
        d.setRebuildingCost(e.getRebuildingCost());
        d.setItvRatio(e.getItvRatio());
        d.setPotentialCoverageGap(e.getPotentialCoverageGap());
        d.setItvDrift(e.getItvDrift());
        d.setItvClassification(e.getItvClassification());
        d.setConfidenceScore(e.getConfidenceScore());
        d.setConfidenceCategory(e.getConfidenceCategory());
        d.setAbstentionTriggered(e.getAbstentionTriggered());
        d.setAbstentionReasons(e.getAbstentionReasons());
        d.setRecommendationText(e.getRecommendationText());
        return d;
    }

    private EvidenceRecordDto toEvidenceDto(EvidenceRecord r) {
        EvidenceRecordDto d = new EvidenceRecordDto();
        d.setId(r.getId());
        d.setPropertyId(r.getProperty().getId());
        d.setSourceId(r.getSourceId());
        d.setSourceName(r.getSourceName());
        d.setSourceUrl(r.getSourceUrl());
        d.setPublicationDate(r.getPublicationDate());
        d.setRetrievalDate(r.getRetrievalDate());
        d.setProvenanceCategory(r.getProvenanceCategory());
        d.setSourceReliabilityScore(r.getSourceReliabilityScore());
        d.setFreshnessScore(r.getFreshnessScore());
        d.setCompletenessScore(r.getCompletenessScore());
        d.setRawPayload(r.getRawPayload());
        d.setIsValid(r.getIsValid());
        return d;
    }

    private ReviewCaseDto toCaseDto(ReviewCase c) {
        ReviewCaseDto d = new ReviewCaseDto();
        d.setId(c.getId());
        d.setCaseNumber(c.getCaseNumber());
        d.setPolicyId(c.getPolicy().getId());
        d.setPolicyNumber(c.getPolicy().getPolicyNumber());
        d.setPolicyholderName(c.getPolicy().getPolicyholderName());
        d.setPropertyAddress(c.getPolicy().getProperty().getAddressLine1() + ", " + c.getPolicy().getProperty().getCity());
        d.setCaseType(c.getCaseType());
        d.setStatus(c.getStatus());
        if (c.getAssignedUnderwriter() != null) {
            d.setAssignedUnderwriterId(c.getAssignedUnderwriter().getId());
            d.setAssignedUnderwriterName(c.getAssignedUnderwriter().getFullName());
        }
        d.setCurrentCoverageLimit(c.getPolicy().getCurrentCoverageLimit());
        d.setCurrentItvRatio(c.getCurrentItvRatio());
        d.setCoverageGap(c.getCoverageGap());
        d.setCreatedAt(c.getCreatedAt());
        d.setResolvedAt(c.getResolvedAt());
        return d;
    }
}

