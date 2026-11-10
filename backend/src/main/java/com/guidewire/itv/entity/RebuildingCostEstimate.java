package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "rebuilding_cost_estimates")
public class RebuildingCostEstimate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "estimate_date", nullable = false)
    private LocalDate estimateDate;

    @Column(name = "estimated_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "cost_per_sqm", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPerSqm;

    @Column(nullable = false, length = 100)
    private String methodology;

    @Column(name = "source_name", nullable = false, length = 100)
    private String sourceName;

    @Column(name = "provenance_category", nullable = false, length = 50)
    private String provenanceCategory;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public RebuildingCostEstimate() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public LocalDate getEstimateDate() { return estimateDate; }
    public void setEstimateDate(LocalDate estimateDate) { this.estimateDate = estimateDate; }

    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }

    public BigDecimal getCostPerSqm() { return costPerSqm; }
    public void setCostPerSqm(BigDecimal costPerSqm) { this.costPerSqm = costPerSqm; }

    public String getMethodology() { return methodology; }
    public void setMethodology(String methodology) { this.methodology = methodology; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getProvenanceCategory() { return provenanceCategory; }
    public void setProvenanceCategory(String provenanceCategory) { this.provenanceCategory = provenanceCategory; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean primary) { isPrimary = primary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
