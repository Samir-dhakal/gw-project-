package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "underwriter_decisions")
public class UnderwriterDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "case_id", nullable = false)
    private ReviewCase reviewCase;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "underwriter_id", nullable = false)
    private User underwriter;

    @Column(name = "decision_type", nullable = false, length = 30)
    private String decisionType; // APPROVE_ENDORSEMENT, REJECT_CHANGE, ESCALATE, REQUEST_FIELD_INSPECTION

    @Column(name = "approved_coverage_limit", precision = 14, scale = 2)
    private BigDecimal approvedCoverageLimit;

    @Column(name = "decision_notes", nullable = false, columnDefinition = "TEXT")
    private String decisionNotes;

    @Column(name = "decision_timestamp", nullable = false, updatable = false)
    private LocalDateTime decisionTimestamp = LocalDateTime.now();

    public UnderwriterDecision() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReviewCase getReviewCase() { return reviewCase; }
    public void setReviewCase(ReviewCase reviewCase) { this.reviewCase = reviewCase; }

    public User getUnderwriter() { return underwriter; }
    public void setUnderwriter(User underwriter) { this.underwriter = underwriter; }

    public String getDecisionType() { return decisionType; }
    public void setDecisionType(String decisionType) { this.decisionType = decisionType; }

    public BigDecimal getApprovedCoverageLimit() { return approvedCoverageLimit; }
    public void setApprovedCoverageLimit(BigDecimal approvedCoverageLimit) { this.approvedCoverageLimit = approvedCoverageLimit; }

    public String getDecisionNotes() { return decisionNotes; }
    public void setDecisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; }

    public LocalDateTime getDecisionTimestamp() { return decisionTimestamp; }
    public void setDecisionTimestamp(LocalDateTime decisionTimestamp) { this.decisionTimestamp = decisionTimestamp; }
}
