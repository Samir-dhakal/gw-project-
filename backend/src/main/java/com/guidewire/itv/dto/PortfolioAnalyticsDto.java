package com.guidewire.itv.dto;

import java.math.BigDecimal;
import java.util.Map;

public class PortfolioAnalyticsDto {
    private long totalPoliciesMonitored;
    private long adequateCount;
    private long watchCount;
    private long warningCount;
    private long criticalCount;
    private BigDecimal totalPortfolioCoverageGap;
    private long openCasesCount;
    private long resolvedCasesCount;
    private long lowConfidenceAbstentionsCount;
    private long pendingRenewalsCount;
    private double resolutionRatePercent;
    private Map<String, Long> classificationDistribution;
    private Map<String, Long> confidenceDistribution;

    public PortfolioAnalyticsDto() {}

    public long getTotalPoliciesMonitored() { return totalPoliciesMonitored; }
    public void setTotalPoliciesMonitored(long totalPoliciesMonitored) { this.totalPoliciesMonitored = totalPoliciesMonitored; }

    public long getAdequateCount() { return adequateCount; }
    public void setAdequateCount(long adequateCount) { this.adequateCount = adequateCount; }

    public long getWatchCount() { return watchCount; }
    public void setWatchCount(long watchCount) { this.watchCount = watchCount; }

    public long getWarningCount() { return warningCount; }
    public void setWarningCount(long warningCount) { this.warningCount = warningCount; }

    public long getCriticalCount() { return criticalCount; }
    public void setCriticalCount(long criticalCount) { this.criticalCount = criticalCount; }

    public BigDecimal getTotalPortfolioCoverageGap() { return totalPortfolioCoverageGap; }
    public void setTotalPortfolioCoverageGap(BigDecimal totalPortfolioCoverageGap) { this.totalPortfolioCoverageGap = totalPortfolioCoverageGap; }

    public long getOpenCasesCount() { return openCasesCount; }
    public void setOpenCasesCount(long openCasesCount) { this.openCasesCount = openCasesCount; }

    public long getResolvedCasesCount() { return resolvedCasesCount; }
    public void setResolvedCasesCount(long resolvedCasesCount) { this.resolvedCasesCount = resolvedCasesCount; }

    public long getLowConfidenceAbstentionsCount() { return lowConfidenceAbstentionsCount; }
    public void setLowConfidenceAbstentionsCount(long lowConfidenceAbstentionsCount) { this.lowConfidenceAbstentionsCount = lowConfidenceAbstentionsCount; }

    public long getPendingRenewalsCount() { return pendingRenewalsCount; }
    public void setPendingRenewalsCount(long pendingRenewalsCount) { this.pendingRenewalsCount = pendingRenewalsCount; }

    public double getResolutionRatePercent() { return resolutionRatePercent; }
    public void setResolutionRatePercent(double resolutionRatePercent) { this.resolutionRatePercent = resolutionRatePercent; }

    public Map<String, Long> getClassificationDistribution() { return classificationDistribution; }
    public void setClassificationDistribution(Map<String, Long> classificationDistribution) { this.classificationDistribution = classificationDistribution; }

    public Map<String, Long> getConfidenceDistribution() { return confidenceDistribution; }
    public void setConfidenceDistribution(Map<String, Long> confidenceDistribution) { this.confidenceDistribution = confidenceDistribution; }
}
