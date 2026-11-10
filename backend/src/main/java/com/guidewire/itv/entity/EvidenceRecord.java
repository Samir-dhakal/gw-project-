package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence_records")
public class EvidenceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "source_id", nullable = false, length = 50)
    private String sourceId;

    @Column(name = "source_name", nullable = false, length = 100)
    private String sourceName;

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(name = "publication_date", nullable = false)
    private LocalDate publicationDate;

    @Column(name = "retrieval_date", nullable = false)
    private LocalDateTime retrievalDate = LocalDateTime.now();

    @Column(name = "provenance_category", nullable = false, length = 50)
    private String provenanceCategory;

    @Column(name = "source_reliability_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal sourceReliabilityScore;

    @Column(name = "freshness_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal freshnessScore;

    @Column(name = "completeness_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal completenessScore;

    @Column(name = "raw_payload", columnDefinition = "TEXT")
    private String rawPayload;

    @Column(name = "is_valid", nullable = false)
    private Boolean isValid = true;

    public EvidenceRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

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

