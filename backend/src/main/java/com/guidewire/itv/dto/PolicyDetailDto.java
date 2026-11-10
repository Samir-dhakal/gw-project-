package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class PolicyDetailDto {
    private Long id;
    private String policyNumber;
    private String policyholderName;
    private String policyholderEmail;
    private String currency;
    private BigDecimal currentCoverageLimit;
    private LocalDate inceptionDate;
    private LocalDate expiryDate;
    private String policyStatus;
    private String workflowType;

    private PropertyDto property;
    private List<CoverageSnapshotDto> coverageHistory;
    private List<RebuildingEstimateDto> estimateHistory;
    private List<MonitoringEvaluationDto> evaluationHistory;
    private List<EvidenceRecordDto> evidenceRecords;
    private List<ReviewCaseDto> reviewCases;

    public PolicyDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getPolicyholderName() { return policyholderName; }
    public void setPolicyholderName(String policyholderName) { this.policyholderName = policyholderName; }

    public String getPolicyholderEmail() { return policyholderEmail; }
    public void setPolicyholderEmail(String policyholderEmail) { this.policyholderEmail = policyholderEmail; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getCurrentCoverageLimit() { return currentCoverageLimit; }
    public void setCurrentCoverageLimit(BigDecimal currentCoverageLimit) { this.currentCoverageLimit = currentCoverageLimit; }

    public LocalDate getInceptionDate() { return inceptionDate; }
    public void setInceptionDate(LocalDate inceptionDate) { this.inceptionDate = inceptionDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getPolicyStatus() { return policyStatus; }
    public void setPolicyStatus(String policyStatus) { this.policyStatus = policyStatus; }

    public String getWorkflowType() { return workflowType; }
    public void setWorkflowType(String workflowType) { this.workflowType = workflowType; }

    public PropertyDto getProperty() { return property; }
    public void setProperty(PropertyDto property) { this.property = property; }

    public List<CoverageSnapshotDto> getCoverageHistory() { return coverageHistory; }
    public void setCoverageHistory(List<CoverageSnapshotDto> coverageHistory) { this.coverageHistory = coverageHistory; }

    public List<RebuildingEstimateDto> getEstimateHistory() { return estimateHistory; }
    public void setEstimateHistory(List<RebuildingEstimateDto> estimateHistory) { this.estimateHistory = estimateHistory; }

    public List<MonitoringEvaluationDto> getEvaluationHistory() { return evaluationHistory; }
    public void setEvaluationHistory(List<MonitoringEvaluationDto> evaluationHistory) { this.evaluationHistory = evaluationHistory; }

    public List<EvidenceRecordDto> getEvidenceRecords() { return evidenceRecords; }
    public void setEvidenceRecords(List<EvidenceRecordDto> evidenceRecords) { this.evidenceRecords = evidenceRecords; }

    public List<ReviewCaseDto> getReviewCases() { return reviewCases; }
    public void setReviewCases(List<ReviewCaseDto> reviewCases) { this.reviewCases = reviewCases; }
}

