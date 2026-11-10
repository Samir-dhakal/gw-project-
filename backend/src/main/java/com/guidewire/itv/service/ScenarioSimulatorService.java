package com.guidewire.itv.service;

import com.guidewire.itv.dto.ScenarioProjectionDto;
import com.guidewire.itv.dto.ScenarioProjectionRequest;
import com.guidewire.itv.entity.Policy;
import com.guidewire.itv.entity.RebuildingCostEstimate;
import com.guidewire.itv.exception.ResourceNotFoundException;
import com.guidewire.itv.repository.PolicyRepository;
import com.guidewire.itv.repository.RebuildingCostEstimateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScenarioSimulatorService {

    private final PolicyRepository policyRepository;
    private final RebuildingCostEstimateRepository estimateRepository;
    private final ItvEngineService itvEngineService;

    public ScenarioSimulatorService(PolicyRepository policyRepository,
                                    RebuildingCostEstimateRepository estimateRepository,
                                    ItvEngineService itvEngineService) {
        this.policyRepository = policyRepository;
        this.estimateRepository = estimateRepository;
        this.itvEngineService = itvEngineService;
    }

    /**
     * Pure functional simulation: Projects hypothetical coverage limits without mutating the actual policy.
     */
    @Transactional(readOnly = true)
    public ScenarioProjectionDto simulateScenarios(ScenarioProjectionRequest request) {
        Policy policy = policyRepository.findById(request.getPolicyId())
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + request.getPolicyId()));

        List<RebuildingCostEstimate> estimates = estimateRepository.findPrimaryEstimatesByPropertyId(policy.getProperty().getId());
        if (estimates.isEmpty()) {
            estimates = estimateRepository.findAllEstimatesByPropertyId(policy.getProperty().getId());
        }
        if (estimates.isEmpty()) {
            throw new ResourceNotFoundException("No rebuilding cost estimates found for property: " + policy.getProperty().getPropertyCode());
        }

        RebuildingCostEstimate primaryEstimate = estimates.get(0);
        BigDecimal rebuildingCost = primaryEstimate.getEstimatedCost();
        BigDecimal currentCoverage = policy.getCurrentCoverageLimit();

        BigDecimal currentItv = itvEngineService.calculateItvRatio(currentCoverage, rebuildingCost);
        BigDecimal currentGap = itvEngineService.calculateCoverageGap(currentCoverage, rebuildingCost);

        ScenarioProjectionDto dto = new ScenarioProjectionDto();
        dto.setPolicyId(policy.getId());
        dto.setPolicyNumber(policy.getPolicyNumber());
        dto.setCurrentCoverage(currentCoverage);
        dto.setRebuildingCostEstimate(rebuildingCost);
        dto.setCurrentItvRatio(currentItv);
        dto.setCurrentGap(currentGap);

        List<ScenarioProjectionDto.ScenarioOption> options = new ArrayList<>();

        // 1. Current Baseline
        options.add(buildOption("CURRENT", "Existing In-Force Coverage", currentCoverage, rebuildingCost, currentCoverage,
                "Maintains existing dwelling limit; leaves policyholder exposed to existing coverage shortfall."));

        // 2. 80% Coinsurance Floor
        BigDecimal cov80 = rebuildingCost.multiply(new BigDecimal("0.80")).setScale(2, RoundingMode.HALF_UP);
        options.add(buildOption("PCT_80", "80% Minimum Standard (Coinsurance Threshold)", cov80, rebuildingCost, currentCoverage,
                "Satisfies standard coinsurance clauses but leaves 20% total-loss risk unhedged."));

        // 3. 90% Conservative Target
        BigDecimal cov90 = rebuildingCost.multiply(new BigDecimal("0.90")).setScale(2, RoundingMode.HALF_UP);
        options.add(buildOption("PCT_90", "90% Prudent Coverage Benchmark", cov90, rebuildingCost, currentCoverage,
                "Strong coverage buffer absorbing minor material inflation fluctuations."));

        // 4. 95% Recommended Target (Adequate boundary)
        BigDecimal cov95 = rebuildingCost.multiply(new BigDecimal("0.95")).setScale(2, RoundingMode.HALF_UP);
        options.add(buildOption("PCT_95", "95% Recommended Adequate Tier", cov95, rebuildingCost, currentCoverage,
                "Restores policy to 'ADEQUATE' status with minimal premium inflation for policyholder."));

        // 5. 100% Full Replacement Cost
        BigDecimal cov100 = rebuildingCost.setScale(2, RoundingMode.HALF_UP);
        options.add(buildOption("PCT_100", "100% Full Replacement Valuation", cov100, rebuildingCost, currentCoverage,
                "Complete indemnity coverage eliminating 100% of property shortfall."));

        // 6. Custom Scenario (if requested)
        if (request.getCustomCoverageLimit() != null && request.getCustomCoverageLimit().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal customCov = request.getCustomCoverageLimit();
            options.add(buildOption("CUSTOM", "Custom Underwriter Proposal (₹" + customCov + ")", customCov, rebuildingCost, currentCoverage,
                    "Underwriter-tailored limit based on negotiation or inspection findings."));
        }

        dto.setScenarios(options);
        return dto;
    }

    private ScenarioProjectionDto.ScenarioOption buildOption(String key, String label, BigDecimal proposedCoverage,
                                                             BigDecimal rebuildingCost, BigDecimal currentCoverage,
                                                             String rationale) {
        BigDecimal itv = itvEngineService.calculateItvRatio(proposedCoverage, rebuildingCost);
        BigDecimal gap = itvEngineService.calculateCoverageGap(proposedCoverage, rebuildingCost);
        BigDecimal delta = proposedCoverage.subtract(currentCoverage);
        String classification = itvEngineService.classifyItv(itv);

        return new ScenarioProjectionDto.ScenarioOption(
                key, label, proposedCoverage, itv, gap, delta, classification, rationale
        );
    }
}

