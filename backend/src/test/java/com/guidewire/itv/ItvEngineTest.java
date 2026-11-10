package com.guidewire.itv;

import com.guidewire.itv.exception.ValidationException;
import com.guidewire.itv.service.ItvEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ITV Calculation & Classification Unit Tests")
class ItvEngineTest {

    private ItvEngineService itvEngineService;

    @BeforeEach
    void setUp() {
        itvEngineService = new ItvEngineService();
    }

    @Test
    @DisplayName("Should correctly calculate 100% ITV ratio when coverage matches rebuilding cost")
    void testCalculateItvRatio_Equal() {
        BigDecimal coverage = new BigDecimal("5000000.00");
        BigDecimal rebuildingCost = new BigDecimal("5000000.00");

        BigDecimal ratio = itvEngineService.calculateItvRatio(coverage, rebuildingCost);
        assertEquals(new BigDecimal("100.00"), ratio);
    }

    @Test
    @DisplayName("Should correctly calculate 76.92% ITV ratio and 15L gap for deteriorated policy")
    void testCalculateItvRatio_Deteriorated() {
        BigDecimal coverage = new BigDecimal("5000000.00");
        BigDecimal rebuildingCost = new BigDecimal("6500000.00");

        BigDecimal ratio = itvEngineService.calculateItvRatio(coverage, rebuildingCost);
        assertEquals(new BigDecimal("76.92"), ratio);

        BigDecimal gap = itvEngineService.calculateCoverageGap(coverage, rebuildingCost);
        assertEquals(new BigDecimal("1500000.00"), gap);
    }

    @Test
    @DisplayName("Should return 0 coverage gap when coverage exceeds rebuilding cost")
    void testCalculateCoverageGap_Surplus() {
        BigDecimal coverage = new BigDecimal("6000000.00");
        BigDecimal rebuildingCost = new BigDecimal("5000000.00");

        BigDecimal gap = itvEngineService.calculateCoverageGap(coverage, rebuildingCost);
        assertEquals(BigDecimal.ZERO, gap);
    }

    @Test
    @DisplayName("Should correctly classify all ITV boundary thresholds")
    void testClassifyItv_Boundaries() {
        // Adequate: >= 95%
        assertEquals("ADEQUATE", itvEngineService.classifyItv(new BigDecimal("100.00")));
        assertEquals("ADEQUATE", itvEngineService.classifyItv(new BigDecimal("95.00")));

        // Watch: 90% to < 95%
        assertEquals("WATCH", itvEngineService.classifyItv(new BigDecimal("94.99")));
        assertEquals("WATCH", itvEngineService.classifyItv(new BigDecimal("90.00")));

        // Warning: 80% to < 90%
        assertEquals("WARNING", itvEngineService.classifyItv(new BigDecimal("89.99")));
        assertEquals("WARNING", itvEngineService.classifyItv(new BigDecimal("80.00")));

        // Critical: < 80%
        assertEquals("CRITICAL", itvEngineService.classifyItv(new BigDecimal("79.99")));
        assertEquals("CRITICAL", itvEngineService.classifyItv(new BigDecimal("50.00")));
    }

    @Test
    @DisplayName("Should correctly calculate ITV drift between current and prior snapshots")
    void testCalculateItvDrift() {
        BigDecimal current = new BigDecimal("76.92");
        BigDecimal previous = new BigDecimal("100.00");

        BigDecimal drift = itvEngineService.calculateItvDrift(current, previous);
        assertEquals(new BigDecimal("-23.08"), drift);
    }

    @Test
    @DisplayName("Should reject zero or negative coverage limits")
    void testValidateInputs_ZeroOrNegative() {
        assertThrows(ValidationException.class, () ->
                itvEngineService.calculateItvRatio(BigDecimal.ZERO, new BigDecimal("5000000.00")));

        assertThrows(ValidationException.class, () ->
                itvEngineService.calculateItvRatio(new BigDecimal("5000000.00"), new BigDecimal("-1000.00")));
    }
}

