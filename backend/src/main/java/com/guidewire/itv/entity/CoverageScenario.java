package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coverage_scenarios")
public class CoverageScenario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "case_id", nullable = false)
    private ReviewCase reviewCase;

    @Column(name = "scenario_name", nullable = false, length = 100)
    private String scenarioName;

    @Column(name = "hypothetical_coverage", nullable = false, precision = 14, scale = 2)
    private BigDecimal hypotheticalCoverage;

    @Column(name = "projected_itv_ratio", nullable = false, precision = 6, scale = 2)
    private BigDecimal projectedItvRatio;

    @Column(name = "remaining_gap", nullable = false, precision = 14, scale = 2)
    private BigDecimal remainingGap;

    @Column(name = "difference_from_current", nullable = false, precision = 14, scale = 2)
    private BigDecimal differenceFromCurrent;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CoverageScenario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReviewCase getReviewCase() { return reviewCase; }
    public void setReviewCase(ReviewCase reviewCase) { this.reviewCase = reviewCase; }

    public String getScenarioName() { return scenarioName; }
    public void setScenarioName(String scenarioName) { this.scenarioName = scenarioName; }

    public BigDecimal getHypotheticalCoverage() { return hypotheticalCoverage; }
    public void setHypotheticalCoverage(BigDecimal hypotheticalCoverage) { this.hypotheticalCoverage = hypotheticalCoverage; }

    public BigDecimal getProjectedItvRatio() { return projectedItvRatio; }
    public void setProjectedItvRatio(BigDecimal projectedItvRatio) { this.projectedItvRatio = projectedItvRatio; }

    public BigDecimal getRemainingGap() { return remainingGap; }
    public void setRemainingGap(BigDecimal remainingGap) { this.remainingGap = remainingGap; }

    public BigDecimal getDifferenceFromCurrent() { return differenceFromCurrent; }
    public void setDifferenceFromCurrent(BigDecimal differenceFromCurrent) { this.differenceFromCurrent = differenceFromCurrent; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

