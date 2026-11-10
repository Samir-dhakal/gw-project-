package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.util.List;

public class ScenarioProjectionDto {
    private Long policyId;
    private String policyNumber;
    private BigDecimal currentCoverage;
    private BigDecimal rebuildingCostEstimate;
    private BigDecimal currentItvRatio;
    private BigDecimal currentGap;
    private List<ScenarioOption> scenarios;

    public static class ScenarioOption {
        private String scenarioKey; // CURRENT, PCT_80, PCT_90, PCT_95, PCT_100, CUSTOM
        private String label;
        private BigDecimal proposedCoverage;
        private BigDecimal projectedItvRatio;
        private BigDecimal remainingGap;
        private BigDecimal coverageDelta;
        private String classification;
        private String rationale;

        public ScenarioOption() {}

        public ScenarioOption(String scenarioKey, String label, BigDecimal proposedCoverage,
                              BigDecimal projectedItvRatio, BigDecimal remainingGap,
                              BigDecimal coverageDelta, String classification, String rationale) {
            this.scenarioKey = scenarioKey;
            this.label = label;
            this.proposedCoverage = proposedCoverage;
            this.projectedItvRatio = projectedItvRatio;
            this.remainingGap = remainingGap;
            this.coverageDelta = coverageDelta;
            this.classification = classification;
            this.rationale = rationale;
        }

        public String getScenarioKey() { return scenarioKey; }
        public void setScenarioKey(String scenarioKey) { this.scenarioKey = scenarioKey; }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }

        public BigDecimal getProposedCoverage() { return proposedCoverage; }
        public void setProposedCoverage(BigDecimal proposedCoverage) { this.proposedCoverage = proposedCoverage; }

        public BigDecimal getProjectedItvRatio() { return projectedItvRatio; }
        public void setProjectedItvRatio(BigDecimal projectedItvRatio) { this.projectedItvRatio = projectedItvRatio; }

        public BigDecimal getRemainingGap() { return remainingGap; }
        public void setRemainingGap(BigDecimal remainingGap) { this.remainingGap = remainingGap; }

        public BigDecimal getCoverageDelta() { return coverageDelta; }
        public void setCoverageDelta(BigDecimal coverageDelta) { this.coverageDelta = coverageDelta; }

        public String getClassification() { return classification; }
        public void setClassification(String classification) { this.classification = classification; }

        public String getRationale() { return rationale; }
        public void setRationale(String rationale) { this.rationale = rationale; }
    }

    public ScenarioProjectionDto() {}

    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public BigDecimal getCurrentCoverage() { return currentCoverage; }
    public void setCurrentCoverage(BigDecimal currentCoverage) { this.currentCoverage = currentCoverage; }

    public BigDecimal getRebuildingCostEstimate() { return rebuildingCostEstimate; }
    public void setRebuildingCostEstimate(BigDecimal rebuildingCostEstimate) { this.rebuildingCostEstimate = rebuildingCostEstimate; }

    public BigDecimal getCurrentItvRatio() { return currentItvRatio; }
    public void setCurrentItvRatio(BigDecimal currentItvRatio) { this.currentItvRatio = currentItvRatio; }

    public BigDecimal getCurrentGap() { return currentGap; }
    public void setCurrentGap(BigDecimal currentGap) { this.currentGap = currentGap; }

    public List<ScenarioOption> getScenarios() { return scenarios; }
    public void setScenarios(List<ScenarioOption> scenarios) { this.scenarios = scenarios; }
}
