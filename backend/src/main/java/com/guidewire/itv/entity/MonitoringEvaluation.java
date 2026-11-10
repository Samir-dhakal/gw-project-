package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "monitoring_evaluations")
public class MonitoringEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "evaluation_timestamp", nullable = false)
    private LocalDateTime evaluationTimestamp = LocalDateTime.now();

    @Column(name = "trigger_type", nullable = false, length = 30)
    private String triggerType; // SCHEDULED_DAILY, EVENT_DRIVEN, MANUAL_REASSESSMENT

    @Column(name = "dwelling_coverage", nullable = false, precision = 14, scale = 2)
    private BigDecimal dwellingCoverage;

    @Column(name = "rebuilding_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal rebuildingCost;

    @Column(name = "itv_ratio", nullable = false, precision = 6, scale = 2)
    private BigDecimal itvRatio;

    @Column(name = "potential_coverage_gap", nullable = false, precision = 14, scale = 2)
    private BigDecimal potentialCoverageGap;

    @Column(name = "itv_drift", nullable = false, precision = 6, scale = 2)
    private BigDecimal itvDrift = BigDecimal.ZERO;

    @Column(name = "itv_classification", nullable = false, length = 30)
    private String itvClassification; // ADEQUATE, WATCH, WARNING, CRITICAL

    @Column(name = "confidence_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal confidenceScore;

    @Column(name = "confidence_category", nullable = false, length = 20)
    private String confidenceCategory; // HIGH, MEDIUM, LOW

    @Column(name = "abstention_triggered", nullable = false)
    private Boolean abstentionTriggered = false;

    @Column(name = "abstention_reasons", columnDefinition = "TEXT")
    private String abstentionReasons;

    @Column(name = "recommendation_text", columnDefinition = "TEXT")
    private String recommendationText;

    public MonitoringEvaluation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Policy getPolicy() { return policy; }
    public void setPolicy(Policy policy) { this.policy = policy; }

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

