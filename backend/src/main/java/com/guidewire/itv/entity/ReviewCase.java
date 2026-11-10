package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_cases")
public class ReviewCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "case_number", nullable = false, unique = true, length = 50)
    private String caseNumber;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "case_type", nullable = false, length = 30)
    private String caseType; // MIDTERM_UNDERINSURANCE, RENEWAL_UNDERINSURANCE, EVIDENCE_VERIFICATION

    @Column(nullable = false, length = 30)
    private String status = "OPEN"; // OPEN, UNDER_REVIEW, EVIDENCE_REQUESTED, RESOLVED, CLOSED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_underwriter_id")
    private User assignedUnderwriter;

    @Column(name = "current_itv_ratio", nullable = false, precision = 6, scale = 2)
    private BigDecimal currentItvRatio;

    @Column(name = "coverage_gap", nullable = false, precision = 14, scale = 2)
    private BigDecimal coverageGap;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public ReviewCase() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

    public String getCaseType() { return caseType; }
    public void setCaseType(String caseType) { this.caseType = caseType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getAssignedUnderwriter() { return assignedUnderwriter; }
    public void setAssignedUnderwriter(User assignedUnderwriter) { this.assignedUnderwriter = assignedUnderwriter; }

    public BigDecimal getCurrentItvRatio() { return currentItvRatio; }
    public void setCurrentItvRatio(BigDecimal currentItvRatio) { this.currentItvRatio = currentItvRatio; }

    public BigDecimal getCoverageGap() { return coverageGap; }
    public void setCoverageGap(BigDecimal coverageGap) { this.coverageGap = coverageGap; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}

