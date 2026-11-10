package com.guidewire.itv.service;

import com.guidewire.itv.dto.ConfidenceBreakdownDto;
import com.guidewire.itv.entity.EvidenceRecord;
import com.guidewire.itv.entity.Property;
import com.guidewire.itv.entity.RebuildingCostEstimate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class EvidenceConfidenceService {

    private static final BigDecimal WEIGHT_S = new BigDecimal("0.30");
    private static final BigDecimal WEIGHT_F = new BigDecimal("0.25");
    private static final BigDecimal WEIGHT_K = new BigDecimal("0.20");
    private static final BigDecimal WEIGHT_A = new BigDecimal("0.25");

    private static final BigDecimal HIGH_THRESHOLD = new BigDecimal("80.00");
    private static final BigDecimal MEDIUM_THRESHOLD = new BigDecimal("60.00");
    private static final BigDecimal DISAGREEMENT_ABSTENTION_THRESHOLD_PCT = new BigDecimal("20.00");

    /**
     * Evaluates comprehensive confidence breakdown and determines whether hard abstention is required.
     */
    public ConfidenceBreakdownDto evaluateConfidence(Property property,
                                                    RebuildingCostEstimate primaryEstimate,
                                                    List<RebuildingCostEstimate> allEstimates,
                                                    List<EvidenceRecord> evidenceRecords) {
        ConfidenceBreakdownDto dto = new ConfidenceBreakdownDto();
        List<String> abstentionReasons = new ArrayList<>();
        List<String> missingFields = new ArrayList<>();

        // 1. Source Reliability (S)
        BigDecimal sScore = calculateSourceReliability(primaryEstimate, evidenceRecords);
        dto.setSourceReliabilityScore(sScore);

        // 2. Freshness Score (F)
        BigDecimal fScore = calculateFreshness(primaryEstimate, evidenceRecords, abstentionReasons);
        dto.setFreshnessScore(fScore);

        // 3. Completeness Score (K)
        BigDecimal kScore = calculateCompleteness(property, missingFields, abstentionReasons);
        dto.setCompletenessScore(kScore);

        // 4. Agreement Score (A)
        BigDecimal aScore = calculateAgreement(primaryEstimate, allEstimates, abstentionReasons);
        dto.setAgreementScore(aScore);

        // Compute overall weighted score C = 0.30*S + 0.25*F + 0.20*K + 0.25*A
        BigDecimal overall = sScore.multiply(WEIGHT_S)
                .add(fScore.multiply(WEIGHT_F))
                .add(kScore.multiply(WEIGHT_K))
                .add(aScore.multiply(WEIGHT_A))
                .setScale(2, RoundingMode.HALF_UP);
        dto.setOverallScore(overall);

        // Category
        if (overall.compareTo(HIGH_THRESHOLD) >= 0) {
            dto.setCategory("HIGH");
        } else if (overall.compareTo(MEDIUM_THRESHOLD) >= 0) {
            dto.setCategory("MEDIUM");
        } else {
            dto.setCategory("LOW");
        }

        // Hard Abstention Check: If reasons exist or score is LOW
        boolean hardAbstain = !abstentionReasons.isEmpty();
        if (overall.compareTo(MEDIUM_THRESHOLD) < 0 && !hardAbstain) {
            hardAbstain = true;
            abstentionReasons.add("Aggregate evidence confidence score (" + overall + ") is below minimum reliable threshold (60.00).");
        }

        dto.setAbstentionTriggered(hardAbstain);
        dto.setAbstentionReasons(abstentionReasons);
        dto.setMissingFields(missingFields);

        if (hardAbstain) {
            dto.setRecommendedVerificationAction("Dispatch field engineering inspection request to verify physical building metrics and resolve estimate discrepancies.");
        } else if (dto.getCategory().equals("MEDIUM")) {
            dto.setRecommendedVerificationAction("Request updated contractor quotation or structural bill of quantities prior to binding endorsement.");
        } else {
            dto.setRecommendedVerificationAction("Evidence is highly verified and aligned. Proceed with standard underwriter review.");
        }

        return dto;
    }

    private BigDecimal calculateSourceReliability(RebuildingCostEstimate primaryEstimate, List<EvidenceRecord> records) {
        if (records != null && !records.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            for (EvidenceRecord r : records) {
                sum = sum.add(r.getSourceReliabilityScore());
            }
            return sum.divide(new BigDecimal(records.size()), 2, RoundingMode.HALF_UP);
        }

        if (primaryEstimate != null) {
            if ("REAL_PUBLIC_DOCUMENT".equals(primaryEstimate.getProvenanceCategory())) {
                return new BigDecimal("95.00");
            } else if ("REAL_PUBLIC_API".equals(primaryEstimate.getProvenanceCategory())) {
                return new BigDecimal("90.00");
            } else if ("REAL_PUBLIC_DATASET".equals(primaryEstimate.getProvenanceCategory())) {
                return new BigDecimal("88.00");
            } else {
                return new BigDecimal("65.00");
            }
        }
        return new BigDecimal("50.00");
    }

    private BigDecimal calculateFreshness(RebuildingCostEstimate estimate, List<EvidenceRecord> records, List<String> abstentionReasons) {
        LocalDate refDate = (estimate != null) ? estimate.getEstimateDate() : LocalDate.now().minusYears(2);
        long daysOld = ChronoUnit.DAYS.between(refDate, LocalDate.now());

        if (daysOld > 365) {
            abstentionReasons.add("Primary replacement cost estimate is stale (" + daysOld + " days old, exceeding 365-day validity window).");
        }

        // Decay function: 100 - (daysOld / 365 * 30), minimum 20
        BigDecimal decay = new BigDecimal(Math.min(daysOld, 365))
                .divide(new BigDecimal("365"), 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("30"));
        BigDecimal score = new BigDecimal("100.00").subtract(decay).setScale(2, RoundingMode.HALF_UP);
        return score.max(new BigDecimal("20.00"));
    }

    private BigDecimal calculateCompleteness(Property property, List<String> missingFields, List<String> abstentionReasons) {
        int totalAttributes = 5;
        int present = 0;

        if (property.getBuiltUpAreaSqm() != null && property.getBuiltUpAreaSqm().compareTo(BigDecimal.ZERO) > 0) {
            present++;
        } else {
            missingFields.add("builtUpAreaSqm");
        }

        if (property.getConstructionType() != null && !property.getConstructionType().trim().isEmpty()) {
            present++;
        } else {
            missingFields.add("constructionType");
        }

        if (property.getYearBuilt() != null && property.getYearBuilt() > 1900) {
            present++;
        } else {
            missingFields.add("yearBuilt");
        }

        if (property.getNumberOfFloors() != null && property.getNumberOfFloors() > 0) {
            present++;
        } else {
            missingFields.add("numberOfFloors");
        }

        if (property.getAddressLine1() != null && !property.getAddressLine1().trim().isEmpty()) {
            present++;
        } else {
            missingFields.add("addressLine1");
        }

        if (!missingFields.isEmpty()) {
            abstentionReasons.add("Critical structural parameters missing: " + String.join(", ", missingFields));
        }

        return new BigDecimal(present)
                .multiply(new BigDecimal("100"))
                .divide(new BigDecimal(totalAttributes), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateAgreement(RebuildingCostEstimate primary, List<RebuildingCostEstimate> allEstimates, List<String> abstentionReasons) {
        if (allEstimates == null || allEstimates.size() < 2) {
            return new BigDecimal("90.00"); // Single verified source default
        }

        // Compare primary against other estimates
        BigDecimal maxCost = primary.getEstimatedCost();
        BigDecimal minCost = primary.getEstimatedCost();

        for (RebuildingCostEstimate e : allEstimates) {
            if (e.getEstimatedCost().compareTo(maxCost) > 0) maxCost = e.getEstimatedCost();
            if (e.getEstimatedCost().compareTo(minCost) < 0) minCost = e.getEstimatedCost();
        }

        // Disagreement % = ((max - min) / min) * 100
        BigDecimal diff = maxCost.subtract(minCost);
        BigDecimal disagreementPct = diff.multiply(new BigDecimal("100"))
                .divide(minCost, 2, RoundingMode.HALF_UP);

        if (disagreementPct.compareTo(DISAGREEMENT_ABSTENTION_THRESHOLD_PCT) > 0) {
            abstentionReasons.add("Independent estimates materially contradict each other (Disagreement: "
                    + disagreementPct + "%, exceeding acceptable tolerance of " + DISAGREEMENT_ABSTENTION_THRESHOLD_PCT + "%).");
            return new BigDecimal("40.00");
        }

        // Higher agreement -> higher score
        BigDecimal agreementScore = new BigDecimal("100.00").subtract(disagreementPct.multiply(new BigDecimal("2")));
        return agreementScore.max(new BigDecimal("50.00")).setScale(2, RoundingMode.HALF_UP);
    }
}

