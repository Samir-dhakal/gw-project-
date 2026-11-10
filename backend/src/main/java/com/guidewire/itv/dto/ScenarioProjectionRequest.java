package com.guidewire.itv.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ScenarioProjectionRequest {

    @NotNull(message = "Policy ID is required")
    private Long policyId;

    private BigDecimal customCoverageLimit;

    public ScenarioProjectionRequest() {}

    public ScenarioProjectionRequest(Long policyId, BigDecimal customCoverageLimit) {
        this.policyId = policyId;
        this.customCoverageLimit = customCoverageLimit;
    }

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public BigDecimal getCustomCoverageLimit() { return customCoverageLimit; }
    public void setCustomCoverageLimit(BigDecimal customCoverageLimit) { this.customCoverageLimit = customCoverageLimit; }
}

