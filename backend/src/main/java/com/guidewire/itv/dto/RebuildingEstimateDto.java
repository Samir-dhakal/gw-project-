package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class RebuildingEstimateDto {
    private Long id;
    private Long propertyId;
    private LocalDate estimateDate;
    private BigDecimal estimatedCost;
    private BigDecimal costPerSqm;
    private String methodology;
    private String sourceName;
    private String provenanceCategory;
    private Boolean isPrimary;
    private LocalDateTime createdAt;

    public RebuildingEstimateDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

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
