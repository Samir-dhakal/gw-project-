package com.guidewire.itv.controller;

import com.guidewire.itv.dto.PolicyDetailDto;
import com.guidewire.itv.dto.PolicySummaryDto;
import com.guidewire.itv.service.PolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/policies")
@Tag(name = "Policies", description = "In-force policy search, portfolio filtering, and detail inspection")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @GetMapping
    @Operation(summary = "Get list of monitored policies with search, status, and classification filters")
    public ResponseEntity<List<PolicySummaryDto>> getPolicies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String classification,
            @RequestParam(required = false) String search) {
        List<PolicySummaryDto> policies = policyService.getPolicySummaries(status, classification, search);
        return ResponseEntity.ok(policies);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full policy detail including property, coverage snapshots, estimates, and evaluation drift history")
    public ResponseEntity<PolicyDetailDto> getPolicyDetail(@PathVariable Long id) {
        PolicyDetailDto detail = policyService.getPolicyDetail(id);
        return ResponseEntity.ok(detail);
    }
}

