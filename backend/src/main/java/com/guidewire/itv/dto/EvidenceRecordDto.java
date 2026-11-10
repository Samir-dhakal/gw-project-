package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EvidenceRecordDto {
    private Long id;
    private Long propertyId;
    private String sourceId;
    private String sourceName;
    private String sourceUrl;
    private LocalDate publicationDate;
    private LocalDateTime retrievalDate;
    private String provenanceCategory;
    private BigDecimal sourceReliabilityScore;
    private BigDecimal freshnessScore;
    private BigDecimal completenessScore;
    private String rawPayload;
    private Boolean isValid;

    public EvidenceRecordDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public LocalDate getPublicationDate() { return publicationDate; }
    public void setPublicationDate(LocalDate publicationDate) { this.publicationDate = publicationDate; }

    public LocalDateTime getRetrievalDate() { return retrievalDate; }
    public void setRetrievalDate(LocalDateTime retrievalDate) { this.retrievalDate = retrievalDate; }

    public String getProvenanceCategory() { return provenanceCategory; }
    public void setProvenanceCategory(String provenanceCategory) { this.provenanceCategory = provenanceCategory; }

    public BigDecimal getSourceReliabilityScore() { return sourceReliabilityScore; }
    public void setSourceReliabilityScore(BigDecimal sourceReliabilityScore) { this.sourceReliabilityScore = sourceReliabilityScore; }

    public BigDecimal getFreshnessScore() { return freshnessScore; }
    public void setFreshnessScore(BigDecimal freshnessScore) { this.freshnessScore = freshnessScore; }

    public BigDecimal getCompletenessScore() { return completenessScore; }
    public void setCompletenessScore(BigDecimal completenessScore) { this.completenessScore = completenessScore; }

    public String getRawPayload() { return rawPayload; }
    public void setRawPayload(String rawPayload) { this.rawPayload = rawPayload; }

    public Boolean getIsValid() { return isValid; }
    public void setIsValid(Boolean valid) { isValid = valid; }
}

