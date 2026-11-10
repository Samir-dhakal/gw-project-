package com.guidewire.itv.service;

import com.guidewire.itv.exception.ValidationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class ItvEngineService {

    public static final BigDecimal ADEQUATE_THRESHOLD = new BigDecimal("95.00");
    public static final BigDecimal WATCH_THRESHOLD = new BigDecimal("90.00");
    public static final BigDecimal WARNING_THRESHOLD = new BigDecimal("80.00");

    /**
     * Calculates the Insurance-to-Value (ITV) Ratio:
     * ITV Ratio = (Dwelling Coverage Limit / Rebuilding Cost Estimate) * 100
     */
    public BigDecimal calculateItvRatio(BigDecimal coverageLimit, BigDecimal rebuildingCost) {
        validateInputs(coverageLimit, rebuildingCost);
        return coverageLimit
                .multiply(new BigDecimal("100"))
                .divide(rebuildingCost, 2, RoundingMode.HALF_UP);
    }

    /**
     * Calculates the Potential Coverage Gap:
     * Coverage Gap = max(0, Rebuilding Cost Estimate - Dwelling Coverage Limit)
     */
    public BigDecimal calculateCoverageGap(BigDecimal coverageLimit, BigDecimal rebuildingCost) {
        validateInputs(coverageLimit, rebuildingCost);
        BigDecimal gap = rebuildingCost.subtract(coverageLimit);
        return gap.compareTo(BigDecimal.ZERO) > 0 ? gap : BigDecimal.ZERO;
    }

    /**
     * Calculates the ITV Drift between current and previous evaluations:
     * ITV Drift = Current ITV Ratio - Previous ITV Ratio
     * A negative value indicates deterioration.
     */
    public BigDecimal calculateItvDrift(BigDecimal currentItv, BigDecimal previousItv) {
        if (currentItv == null) {
            throw new ValidationException("Current ITV ratio cannot be null");
        }
        if (previousItv == null) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return currentItv.subtract(previousItv).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Classifies ITV Ratio into defined prototype tiers:
     * - >= 95%: ADEQUATE
     * - 90% to < 95%: WATCH
     * - 80% to < 90%: WARNING
     * - < 80%: CRITICAL
     */
    public String classifyItv(BigDecimal itvRatio) {
        if (itvRatio == null) {
            throw new ValidationException("ITV Ratio cannot be null for classification");
        }
        if (itvRatio.compareTo(ADEQUATE_THRESHOLD) >= 0) {
            return "ADEQUATE";
        } else if (itvRatio.compareTo(WATCH_THRESHOLD) >= 0) {
            return "WATCH";
        } else if (itvRatio.compareTo(WARNING_THRESHOLD) >= 0) {
            return "WARNING";
        } else {
            return "CRITICAL";
        }
    }

    private void validateInputs(BigDecimal coverageLimit, BigDecimal rebuildingCost) {
        if (coverageLimit == null || coverageLimit.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Dwelling coverage limit must be greater than zero");
        }
        if (rebuildingCost == null || rebuildingCost.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ValidationException("Rebuilding cost estimate must be greater than zero");
        }
    }
}

