package com.guidewire.itv.dto;

import java.util.ArrayList;
import java.util.List;

public class ImportResultDto {
    private String datasetName;
    private String sourceFile;
    private int recordsProcessed;
    private int recordsImported;
    private int recordsUpdated;
    private int validationErrorsCount;
    private List<String> validationMessages = new ArrayList<>();
    private String status; // SUCCESS, COMPLETED_WITH_WARNINGS, FAILED
    private String provenanceLabel;

    public ImportResultDto() {}

    public ImportResultDto(String datasetName, String sourceFile, String provenanceLabel) {
        this.datasetName = datasetName;
        this.sourceFile = sourceFile;
        this.provenanceLabel = provenanceLabel;
        this.status = "SUCCESS";
    }

    public String getDatasetName() { return datasetName; }
    public void setDatasetName(String datasetName) { this.datasetName = datasetName; }

    public String getSourceFile() { return sourceFile; }
    public void setSourceFile(String sourceFile) { this.sourceFile = sourceFile; }

    public int getRecordsProcessed() { return recordsProcessed; }
    public void setRecordsProcessed(int recordsProcessed) { this.recordsProcessed = recordsProcessed; }

    public int getRecordsImported() { return recordsImported; }
    public void setRecordsImported(int recordsImported) { this.recordsImported = recordsImported; }

    public int getRecordsUpdated() { return recordsUpdated; }
    public void setRecordsUpdated(int recordsUpdated) { this.recordsUpdated = recordsUpdated; }

    public int getValidationErrorsCount() { return validationErrorsCount; }
    public void setValidationErrorsCount(int validationErrorsCount) { this.validationErrorsCount = validationErrorsCount; }

    public List<String> getValidationMessages() { return validationMessages; }
    public void setValidationMessages(List<String> validationMessages) { this.validationMessages = validationMessages; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getProvenanceLabel() { return provenanceLabel; }
    public void setProvenanceLabel(String provenanceLabel) { this.provenanceLabel = provenanceLabel; }
}

