package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PolicySummaryDto {
    private Long id;
    private String policyNumber;
    private String policyholderName;
    private String city;
    private String state;
    private BigDecimal currentCoverageLimit;
    private BigDecimal latestRebuildingCost;
    private BigDecimal currentItvRatio;
    private BigDecimal potentialCoverageGap;
    private BigDecimal itvDrift;
    private String itvClassification; // ADEQUATE, WATCH, WARNING, CRITICAL
    private BigDecimal confidenceScore;
    private String confidenceCategory; // HIGH, MEDIUM, LOW
    private Boolean abstentionTriggered;
    private LocalDate inceptionDate;
    private LocalDate expiryDate;
    private String policyStatus;
    private String workflowType;

    public PolicySummaryDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getPolicyholderName() { return policyholderName; }
    public void setPolicyholderName(String policyholderName) { this.policyholderName = policyholderName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public BigDecimal getCurrentCoverageLimit() { return currentCoverageLimit; }
    public void setCurrentCoverageLimit(BigDecimal currentCoverageLimit) { this.currentCoverageLimit = currentCoverageLimit; }

    public BigDecimal getLatestRebuildingCost() { return latestRebuildingCost; }
    public void setLatestRebuildingCost(BigDecimal latestRebuildingCost) { this.latestRebuildingCost = latestRebuildingCost; }

    public BigDecimal getCurrentItvRatio() { return currentItvRatio; }
    public void setCurrentItvRatio(BigDecimal currentItvRatio) { this.currentItvRatio = currentItvRatio; }

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

    public LocalDate getInceptionDate() { return inceptionDate; }
    public void setInceptionDate(LocalDate inceptionDate) { this.inceptionDate = inceptionDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getPolicyStatus() { return policyStatus; }
    public void setPolicyStatus(String policyStatus) { this.policyStatus = policyStatus; }

    public String getWorkflowType() { return workflowType; }
    public void setWorkflowType(String workflowType) { this.workflowType = workflowType; }
}

