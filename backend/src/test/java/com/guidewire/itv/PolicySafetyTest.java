package com.guidewire.itv;

import com.guidewire.itv.dto.ScenarioProjectionDto;
import com.guidewire.itv.dto.ScenarioProjectionRequest;
import com.guidewire.itv.entity.Policy;
import com.guidewire.itv.repository.CoverageSnapshotRepository;
import com.guidewire.itv.repository.PolicyRepository;
import com.guidewire.itv.service.ContinuousMonitoringService;
import com.guidewire.itv.service.ScenarioSimulatorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@DisplayName("Policy Safety & Non-Mutation Tests")
class PolicySafetyTest {

    @Autowired
    private ScenarioSimulatorService scenarioSimulatorService;

    @Autowired
    private ContinuousMonitoringService monitoringService;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private CoverageSnapshotRepository snapshotRepository;

    @Test
    @Transactional
    @DisplayName("SAFETY INVARIANT: Scenario simulations must NEVER alter actual policy coverage limit")
    void testScenarioSimulation_DoesNotMutatePolicy() {
        Policy policyBefore = policyRepository.findById(1L).orElseThrow();
        BigDecimal originalCoverage = policyBefore.getCurrentCoverageLimit();

        // Run scenario projection with custom limit of 80L
        ScenarioProjectionRequest req = new ScenarioProjectionRequest(1L, new BigDecimal("8000000.00"));
        ScenarioProjectionDto projection = scenarioSimulatorService.simulateScenarios(req);

        assertNotNull(projection);
        assertEquals(6, projection.getScenarios().size());

        // Re-read policy directly from repository
        Policy policyAfter = policyRepository.findById(1L).orElseThrow();
        assertEquals(originalCoverage, policyAfter.getCurrentCoverageLimit(),
                "CRITICAL VIOLATION: Scenario simulation modified actual database policy coverage limit!");
    }

    @Test
    @Transactional
    @DisplayName("SAFETY INVARIANT: Monitoring evaluations must never delete or overwrite existing historical snapshots")
    void testContinuousMonitoring_PreservesHistoricalSnapshots() {
        long initialSnapshotCount = snapshotRepository.count();

        // Run batch monitoring scan
        monitoringService.runBatchMonitoring("TEST_MANUAL_RUN");

        long afterSnapshotCount = snapshotRepository.count();
        assertTrue(afterSnapshotCount >= initialSnapshotCount,
                "Historical snapshots must never be deleted during monitoring evaluations");
    }
}
