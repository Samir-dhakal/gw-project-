package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MonitoringEvaluationDto {
    private Long id;
    private Long policyId;
    private String policyNumber;
    private LocalDateTime evaluationTimestamp;
    private String triggerType;
    private BigDecimal dwellingCoverage;
    private BigDecimal rebuildingCost;
    private BigDecimal itvRatio;
    private BigDecimal potentialCoverageGap;
    private BigDecimal itvDrift;
    private String itvClassification;
    private BigDecimal confidenceScore;
    private String confidenceCategory;
    private Boolean abstentionTriggered;
    private String abstentionReasons;
    private String recommendationText;

    public MonitoringEvaluationDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public LocalDateTime getEvaluationTimestamp() { return evaluationTimestamp; }
    public void setEvaluationTimestamp(LocalDateTime evaluationTimestamp) { this.evaluationTimestamp = evaluationTimestamp; }

    public String getTriggerType() { return triggerType; }
    public void setTriggerType(String triggerType) { this.triggerType = triggerType; }

    public BigDecimal getDwellingCoverage() { return dwellingCoverage; }
    public void setDwellingCoverage(BigDecimal dwellingCoverage) { this.dwellingCoverage = dwellingCoverage; }

    public BigDecimal getRebuildingCost() { return rebuildingCost; }
    public void setRebuildingCost(BigDecimal rebuildingCost) { this.rebuildingCost = rebuildingCost; }

    public BigDecimal getItvRatio() { return itvRatio; }
    public void setItvRatio(BigDecimal itvRatio) { this.itvRatio = itvRatio; }

    public BigDecimal getPotentialCoverageGap() { return potentialCoverageGap; }
    public void setPotentialCoverageGap(BigDecimal potentialCoverageGap) { this.potentialCoverageGap = potentialCoverageGap; }

    public BigDecimal getItvDrift() { return itvDrift; }
    public void setItvDrift(BigDecimal itvDrift) { this.itvDrift = itvDrift; }

    public String getItvClassification() { return itvClassification; }
    public void setItvClassification(String itvClassification) { this.itvClassification = itvClassification; }

    public BigDecimal getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(BigDecimal confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getConfidenceCategory() { return confidenceCategory; }
    public void setConfidenceCategory(String confidenceCategory) { this.confidenceCategory = confidenceCategory; }

    public Boolean getAbstentionTriggered() { return abstentionTriggered; }
    public void setAbstentionTriggered(Boolean abstentionTriggered) { this.abstentionTriggered = abstentionTriggered; }

    public String getAbstentionReasons() { return abstentionReasons; }
    public void setAbstentionReasons(String abstentionReasons) { this.abstentionReasons = abstentionReasons; }

    public String getRecommendationText() { return recommendationText; }
    public void setRecommendationText(String recommendationText) { this.recommendationText = recommendationText; }
}
