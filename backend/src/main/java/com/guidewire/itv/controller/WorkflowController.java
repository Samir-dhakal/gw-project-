package com.guidewire.itv.controller;

import com.guidewire.itv.dto.ReviewCaseDto;
import com.guidewire.itv.dto.UnderwriterDecisionRequest;
import com.guidewire.itv.service.ReviewCaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workflows")
@Tag(name = "Workflows & Underwriter Review", description = "Review cases, underwriter approvals, rejections, and resolution state machines")
public class WorkflowController {

    private final ReviewCaseService reviewCaseService;

    public WorkflowController(ReviewCaseService reviewCaseService) {
        this.reviewCaseService = reviewCaseService;
    }

    @GetMapping("/cases")
    @Operation(summary = "Get list of review cases filtered by status (OPEN, UNDER_REVIEW, EVIDENCE_REQUESTED, RESOLVED)")
    public ResponseEntity<List<ReviewCaseDto>> getCases(@RequestParam(required = false) String status) {
        List<ReviewCaseDto> cases = (status != null && !status.trim().isEmpty())
                ? reviewCaseService.getCasesByStatus(status)
                : reviewCaseService.getAllCases();
        return ResponseEntity.ok(cases);
    }

    @GetMapping("/cases/{id}")
    @Operation(summary = "Get specific review case by ID")
    public ResponseEntity<ReviewCaseDto> getCaseById(@PathVariable Long id) {
        ReviewCaseDto c = reviewCaseService.getCaseById(id);
        return ResponseEntity.ok(c);
    }

    @PostMapping("/cases/{id}/assign")
    @Operation(summary = "Assign a review case to an underwriter")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<ReviewCaseDto> assignCase(@PathVariable Long id, @RequestParam Long underwriterId) {
        ReviewCaseDto c = reviewCaseService.assignUnderwriter(id, underwriterId);
        return ResponseEntity.ok(c);
    }

    @PostMapping("/cases/decision")
    @Operation(summary = "Record authorized underwriter decision (APPROVE_ENDORSEMENT, REJECT_CHANGE, ESCALATE, REQUEST_FIELD_INSPECTION)")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<ReviewCaseDto> recordDecision(@Valid @RequestBody UnderwriterDecisionRequest request) {
        ReviewCaseDto c = reviewCaseService.recordDecision(request);
        return ResponseEntity.ok(c);
    }
}
