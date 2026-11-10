package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.util.List;

public class ConfidenceBreakdownDto {
    private BigDecimal overallScore;
    private String category; // HIGH, MEDIUM, LOW
    private BigDecimal sourceReliabilityWeight = new BigDecimal("0.30");
    private BigDecimal sourceReliabilityScore;
    private BigDecimal freshnessWeight = new BigDecimal("0.25");
    private BigDecimal freshnessScore;
    private BigDecimal completenessWeight = new BigDecimal("0.20");
    private BigDecimal completenessScore;
    private BigDecimal agreementWeight = new BigDecimal("0.25");
    private BigDecimal agreementScore;
    private Boolean abstentionTriggered;
    private List<String> abstentionReasons;
    private List<String> missingFields;
    private String recommendedVerificationAction;

    public ConfidenceBreakdownDto() {}

    public BigDecimal getOverallScore() { return overallScore; }
    public void setOverallScore(BigDecimal overallScore) { this.overallScore = overallScore; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getSourceReliabilityWeight() { return sourceReliabilityWeight; }
    public void setSourceReliabilityWeight(BigDecimal sourceReliabilityWeight) { this.sourceReliabilityWeight = sourceReliabilityWeight; }

    public BigDecimal getSourceReliabilityScore() { return sourceReliabilityScore; }
    public void setSourceReliabilityScore(BigDecimal sourceReliabilityScore) { this.sourceReliabilityScore = sourceReliabilityScore; }

    public BigDecimal getFreshnessWeight() { return freshnessWeight; }
    public void setFreshnessWeight(BigDecimal freshnessWeight) { this.freshnessWeight = freshnessWeight; }

    public BigDecimal getFreshnessScore() { return freshnessScore; }
    public void setFreshnessScore(BigDecimal freshnessScore) { this.freshnessScore = freshnessScore; }

    public BigDecimal getCompletenessWeight() { return completenessWeight; }
    public void setCompletenessWeight(BigDecimal completenessWeight) { this.completenessWeight = completenessWeight; }

    public BigDecimal getCompletenessScore() { return completenessScore; }
    public void setCompletenessScore(BigDecimal completenessScore) { this.completenessScore = completenessScore; }

    public BigDecimal getAgreementWeight() { return agreementWeight; }
    public void setAgreementWeight(BigDecimal agreementWeight) { this.agreementWeight = agreementWeight; }

    public BigDecimal getAgreementScore() { return agreementScore; }
    public void setAgreementScore(BigDecimal agreementScore) { this.agreementScore = agreementScore; }

    public Boolean getAbstentionTriggered() { return abstentionTriggered; }
    public void setAbstentionTriggered(Boolean abstentionTriggered) { this.abstentionTriggered = abstentionTriggered; }

    public List<String> getAbstentionReasons() { return abstentionReasons; }
    public void setAbstentionReasons(List<String> abstentionReasons) { this.abstentionReasons = abstentionReasons; }

    public List<String> getMissingFields() { return missingFields; }
    public void setMissingFields(List<String> missingFields) { this.missingFields = missingFields; }

    public String getRecommendedVerificationAction() { return recommendedVerificationAction; }
    public void setRecommendedVerificationAction(String recommendedVerificationAction) { this.recommendedVerificationAction = recommendedVerificationAction; }
}
