package com.guidewire.itv.dto;

import java.time.LocalDateTime;

public class IntegrationConfigDto {
    private Long id;
    private String sourceId;
    private String sourceName;
    private String sourceType;
    private String baseUrl;
    private String status;
    private LocalDateTime lastSyncAt;
    private Integer recordCount;
    private String errorMessage;
    private String provenanceCategory;

    public IntegrationConfigDto() {}

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

