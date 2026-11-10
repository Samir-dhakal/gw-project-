package com.guidewire.itv.controller;

import com.guidewire.itv.dto.MonitoringEvaluationDto;
import com.guidewire.itv.entity.MonitoringEvaluation;
import com.guidewire.itv.repository.MonitoringEvaluationRepository;
import com.guidewire.itv.service.ContinuousMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/monitoring")
@Tag(name = "Continuous Monitoring", description = "Automated, event-driven, and manual continuous in-force evaluations")
public class MonitoringController {

    private final ContinuousMonitoringService monitoringService;
    private final MonitoringEvaluationRepository evaluationRepository;

    public MonitoringController(ContinuousMonitoringService monitoringService,
                                MonitoringEvaluationRepository evaluationRepository) {
        this.monitoringService = monitoringService;
        this.evaluationRepository = evaluationRepository;
    }

    @PostMapping("/evaluate/{policyId}")
    @Operation(summary = "Trigger on-demand or event-driven reassessment for a specific policy")
    public ResponseEntity<MonitoringEvaluationDto> evaluatePolicy(
            @PathVariable Long policyId,
            @RequestParam(defaultValue = "MANUAL_REASSESSMENT") String triggerType) {
        MonitoringEvaluation eval = monitoringService.evaluatePolicy(policyId, triggerType);
        return ResponseEntity.ok(toDto(eval));
    }

    @PostMapping("/batch-scan")
    @Operation(summary = "Trigger continuous batch evaluation across all active policies")
    public ResponseEntity<Map<String, Object>> runBatchScan(
            @RequestParam(defaultValue = "MANUAL_BATCH_TRIGGER") String triggerType) {
        int count = monitoringService.runBatchMonitoring(triggerType);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Continuous monitoring scan executed successfully");
        resp.put("policiesEvaluated", count);
        resp.put("triggerType", triggerType);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/evaluations/{policyId}")
    @Operation(summary = "Get historical evaluation snapshots for drift and deterioration tracking")
    public ResponseEntity<List<MonitoringEvaluationDto>> getEvaluationsForPolicy(@PathVariable Long policyId) {
        List<MonitoringEvaluationDto> list = evaluationRepository.findByPolicyIdOrderByEvaluationTimestampAsc(policyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    private MonitoringEvaluationDto toDto(MonitoringEvaluation e) {
        MonitoringEvaluationDto d = new MonitoringEvaluationDto();
        d.setId(e.getId());
        d.setPolicyId(e.getPolicy().getId());
        d.setPolicyNumber(e.getPolicy().getPolicyNumber());
        d.setEvaluationTimestamp(e.getEvaluationTimestamp());
        d.setTriggerType(e.getTriggerType());
        d.setDwellingCoverage(e.getDwellingCoverage());
        d.setRebuildingCost(e.getRebuildingCost());
        d.setItvRatio(e.getItvRatio());
        d.setPotentialCoverageGap(e.getPotentialCoverageGap());
        d.setItvDrift(e.getItvDrift());
        d.setItvClassification(e.getItvClassification());
        d.setConfidenceScore(e.getConfidenceScore());
        d.setConfidenceCategory(e.getConfidenceCategory());
        d.setAbstentionTriggered(e.getAbstentionTriggered());
        d.setAbstentionReasons(e.getAbstentionReasons());
        d.setRecommendationText(e.getRecommendationText());
        return d;
    }
}
