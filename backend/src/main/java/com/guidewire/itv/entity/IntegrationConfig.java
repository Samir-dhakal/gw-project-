package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "integration_configs")
public class IntegrationConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source_id", nullable = false, unique = true, length = 50)
    private String sourceId;

    @Column(name = "source_name", nullable = false, length = 100)
    private String sourceName;

    @Column(name = "source_type", nullable = false, length = 50)
    private String sourceType;

    @Column(name = "base_url", length = 500)
    private String baseUrl;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, PENDING_APPROVAL, SIMULATED, FAILED

    @Column(name = "last_sync_at")
    private LocalDateTime lastSyncAt;

    @Column(name = "record_count")
    private Integer recordCount = 0;

    @Column(name = "error_message", columnDefinition = "TEXT")
    private String errorMessage;

    @Column(name = "provenance_category", nullable = false, length = 50)
    private String provenanceCategory;

    public IntegrationConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getBaseUrl() { return baseUrl; }
    public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getLastSyncAt() { return lastSyncAt; }
    public void setLastSyncAt(LocalDateTime lastSyncAt) { this.lastSyncAt = lastSyncAt; }

    public Integer getRecordCount() { return recordCount; }
    public void setRecordCount(Integer recordCount) { this.recordCount = recordCount; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public String getProvenanceCategory() { return provenanceCategory; }
    public void setProvenanceCategory(String provenanceCategory) { this.provenanceCategory = provenanceCategory; }
}
