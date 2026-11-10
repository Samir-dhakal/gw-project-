package com.guidewire.itv.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class UnderwriterDecisionRequest {

    @NotNull(message = "Case ID is required")
    private Long caseId;

    @NotBlank(message = "Decision type is required")
    private String decisionType; // APPROVE_ENDORSEMENT, REJECT_CHANGE, ESCALATE, REQUEST_FIELD_INSPECTION

    private BigDecimal approvedCoverageLimit;

    @NotBlank(message = "Decision notes are required")
    private String decisionNotes;

    public UnderwriterDecisionRequest() {}

    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }

    public String getDecisionType() { return decisionType; }
    public void setDecisionType(String decisionType) { this.decisionType = decisionType; }

    public BigDecimal getApprovedCoverageLimit() { return approvedCoverageLimit; }
    public void setApprovedCoverageLimit(BigDecimal approvedCoverageLimit) { this.approvedCoverageLimit = approvedCoverageLimit; }

    public String getDecisionNotes() { return decisionNotes; }
    public void setDecisionNotes(String decisionNotes) { this.decisionNotes = decisionNotes; }
}
