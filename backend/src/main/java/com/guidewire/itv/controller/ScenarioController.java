package com.guidewire.itv.controller;

import com.guidewire.itv.dto.ScenarioProjectionDto;
import com.guidewire.itv.dto.ScenarioProjectionRequest;
import com.guidewire.itv.service.ScenarioSimulatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/scenarios")
@Tag(name = "Scenario Simulator", description = "Functional scenario simulator projecting hypothetical coverage limits without policy mutation")
public class ScenarioController {

    private final ScenarioSimulatorService scenarioSimulatorService;

    public ScenarioController(ScenarioSimulatorService scenarioSimulatorService) {
        this.scenarioSimulatorService = scenarioSimulatorService;
    }

    @PostMapping("/simulate")
    @Operation(summary = "Project 80%, 90%, 95%, 100%, and custom coverage limits with zero policy mutation")
    public ResponseEntity<ScenarioProjectionDto> simulateScenarios(@Valid @RequestBody ScenarioProjectionRequest request) {
        ScenarioProjectionDto projection = scenarioSimulatorService.simulateScenarios(request);
        return ResponseEntity.ok(projection);
    }
}

