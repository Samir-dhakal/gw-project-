package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class CoverageSnapshotDto {
    private Long id;
    private Long policyId;
    private LocalDate effectiveDate;
    private BigDecimal coverageLimit;
    private String endorsementNumber;
    private String reason;
    private LocalDateTime recordedAt;

    public CoverageSnapshotDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }

    public BigDecimal getCoverageLimit() { return coverageLimit; }
    public void setCoverageLimit(BigDecimal coverageLimit) { this.coverageLimit = coverageLimit; }

    public String getEndorsementNumber() { return endorsementNumber; }
    public void setEndorsementNumber(String endorsementNumber) { this.endorsementNumber = endorsementNumber; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }
}
