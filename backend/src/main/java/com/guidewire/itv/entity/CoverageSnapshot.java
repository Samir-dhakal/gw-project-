package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coverage_snapshots")
public class CoverageSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "effective_date", nullable = false)
    private LocalDate effectiveDate;

    @Column(name = "coverage_limit", nullable = false, precision = 14, scale = 2)
    private BigDecimal coverageLimit;

    @Column(name = "endorsement_number", length = 50)
    private String endorsementNumber;

    @Column(nullable = false)
    private String reason; // INCEPTION, MIDTERM_ENDORSEMENT, ANNUAL_RENEWAL

    @Column(name = "recorded_at", nullable = false, updatable = false)
    private LocalDateTime recordedAt = LocalDateTime.now();

    public CoverageSnapshot() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

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

