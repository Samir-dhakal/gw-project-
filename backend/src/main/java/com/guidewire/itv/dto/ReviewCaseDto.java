package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ReviewCaseDto {
    private Long id;
    private String caseNumber;
    private Long policyId;
    private String policyNumber;
    private String policyholderName;
    private String propertyAddress;
    private String caseType;
    private String status;
    private Long assignedUnderwriterId;
    private String assignedUnderwriterName;
    private BigDecimal currentCoverageLimit;
    private BigDecimal latestRebuildingCost;
    private BigDecimal currentItvRatio;
    private BigDecimal coverageGap;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public ReviewCaseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public String getPolicyholderName() { return policyholderName; }
    public void setPolicyholderName(String policyholderName) { this.policyholderName = policyholderName; }

    public String getPropertyAddress() { return propertyAddress; }
    public void setPropertyAddress(String propertyAddress) { this.propertyAddress = propertyAddress; }

    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Long getAssignedUnderwriterId() { return assignedUnderwriterId; }
    public void setAssignedUnderwriterId(Long assignedUnderwriterId) { this.assignedUnderwriterId = assignedUnderwriterId; }

    public String getAssignedUnderwriterName() { return assignedUnderwriterName; }
    public void setAssignedUnderwriterName(String assignedUnderwriterName) { this.assignedUnderwriterName = assignedUnderwriterName; }

    public BigDecimal getCurrentCoverageLimit() { return currentCoverageLimit; }
    public void setCurrentCoverageLimit(BigDecimal currentCoverageLimit) { this.currentCoverageLimit = currentCoverageLimit; }

    public BigDecimal getLatestRebuildingCost() { return latestRebuildingCost; }
    public void setLatestRebuildingCost(BigDecimal latestRebuildingCost) { this.latestRebuildingCost = latestRebuildingCost; }

    public BigDecimal getCurrentItvRatio() { return currentItvRatio; }
    public void setCurrentItvRatio(BigDecimal currentItvRatio) { this.currentItvRatio = currentItvRatio; }

    public BigDecimal getCoverageGap() { return coverageGap; }
    public void setCoverageGap(BigDecimal coverageGap) { this.coverageGap = coverageGap; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}

