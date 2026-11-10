package com.guidewire.itv.service;

import com.guidewire.itv.dto.ReviewCaseDto;
import com.guidewire.itv.dto.UnderwriterDecisionRequest;
import com.guidewire.itv.entity.*;
import com.guidewire.itv.exception.ResourceNotFoundException;
import com.guidewire.itv.exception.ValidationException;
import com.guidewire.itv.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewCaseService {

    private final ReviewCaseRepository reviewCaseRepository;
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;
    private final CoverageSnapshotRepository coverageSnapshotRepository;
    private final UnderwriterDecisionRepository decisionRepository;
    private final RebuildingCostEstimateRepository estimateRepository;
    private final AuditLogService auditLogService;

    public ReviewCaseService(ReviewCaseRepository reviewCaseRepository,
                             PolicyRepository policyRepository,
                             UserRepository userRepository,
                             CoverageSnapshotRepository coverageSnapshotRepository,
                             UnderwriterDecisionRepository decisionRepository,
                             RebuildingCostEstimateRepository estimateRepository,
                             AuditLogService auditLogService) {
        this.reviewCaseRepository = reviewCaseRepository;
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
        this.coverageSnapshotRepository = coverageSnapshotRepository;
        this.decisionRepository = decisionRepository;
        this.estimateRepository = estimateRepository;
        this.auditLogService = auditLogService;
    }

    public List<ReviewCaseDto> getAllCases() {
        return reviewCaseRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ReviewCaseDto> getCasesByStatus(String status) {
        return reviewCaseRepository.findByStatus(status).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public ReviewCaseDto getCaseById(Long id) {
        ReviewCase reviewCase = reviewCaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review case not found with ID: " + id));
        return toDto(reviewCase);
    }

    @Transactional
    public ReviewCaseDto assignUnderwriter(Long caseId, Long underwriterId) {
        ReviewCase reviewCase = reviewCaseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Review case not found with ID: " + caseId));
        User user = userRepository.findById(underwriterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + underwriterId));

        reviewCase.setAssignedUnderwriter(user);
        if ("OPEN".equals(reviewCase.getStatus())) {
            reviewCase.setStatus("UNDER_REVIEW");
        }

        ReviewCase saved = reviewCaseRepository.save(reviewCase);
        auditLogService.log("CASE_ASSIGNED", "REVIEW_CASE", saved.getCaseNumber(),
                "Assigned case to underwriter " + user.getFullName());

        return toDto(saved);
    }

    @Transactional
    public ReviewCaseDto recordDecision(UnderwriterDecisionRequest request) {
        ReviewCase reviewCase = reviewCaseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new ResourceNotFoundException("Review case not found with ID: " + request.getCaseId()));

        User underwriter = getCurrentUser();

        UnderwriterDecision decision = new UnderwriterDecision();
        decision.setReviewCase(reviewCase);
        decision.setUnderwriter(underwriter);
        decision.setDecisionType(request.getDecisionType());
        decision.setApprovedCoverageLimit(request.getApprovedCoverageLimit());
        decision.setDecisionNotes(request.getDecisionNotes());
        decision.setDecisionTimestamp(LocalDateTime.now());
        decisionRepository.save(decision);

        Policy policy = reviewCase.getPolicy();

        if ("APPROVE_ENDORSEMENT".equalsIgnoreCase(request.getDecisionType())) {
            if (request.getApprovedCoverageLimit() == null || request.getApprovedCoverageLimit().compareTo(BigDecimal.ZERO) <= 0) {
                throw new ValidationException("Approved coverage limit must be greater than zero");
            }

            // Create immutable Coverage Snapshot
            CoverageSnapshot snapshot = new CoverageSnapshot();
            snapshot.setPolicy(policy);
            snapshot.setEffectiveDate(LocalDate.now());
            snapshot.setCoverageLimit(request.getApprovedCoverageLimit());
            snapshot.setEndorsementNumber("END-" + System.currentTimeMillis() % 100000);
            snapshot.setReason("UNDERWRITER_ENDORSEMENT_APPROVED: " + reviewCase.getCaseType());
            snapshot.setRecordedAt(LocalDateTime.now());
            coverageSnapshotRepository.save(snapshot);

            // Update Policy coverage limit
            BigDecimal priorCoverage = policy.getCurrentCoverageLimit();
            policy.setCurrentCoverageLimit(request.getApprovedCoverageLimit());
            policy.setWorkflowType("IN_FORCE");
            policyRepository.save(policy);

            reviewCase.setStatus("RESOLVED");
            reviewCase.setResolvedAt(LocalDateTime.now());
            reviewCaseRepository.save(reviewCase);

            auditLogService.log("ENDORSEMENT_APPROVED", "POLICY", policy.getPolicyNumber(),
                    "Underwriter " + underwriter.getFullName() + " approved coverage adjustment from ₹"
                            + priorCoverage + " to ₹" + request.getApprovedCoverageLimit() + ". Endorsement: " + snapshot.getEndorsementNumber());

        } else if ("REJECT_CHANGE".equalsIgnoreCase(request.getDecisionType())) {
            reviewCase.setStatus("CLOSED");
            reviewCase.setResolvedAt(LocalDateTime.now());
            policy.setWorkflowType("IN_FORCE");
            policyRepository.save(policy);
            reviewCaseRepository.save(reviewCase);

            auditLogService.log("ENDORSEMENT_REJECTED", "REVIEW_CASE", reviewCase.getCaseNumber(),
                    "Underwriter rejected coverage change. Rationale: " + request.getDecisionNotes());

        } else if ("REQUEST_FIELD_INSPECTION".equalsIgnoreCase(request.getDecisionType())) {
            reviewCase.setStatus("EVIDENCE_REQUESTED");
            reviewCaseRepository.save(reviewCase);

            auditLogService.log("INSPECTION_REQUESTED", "REVIEW_CASE", reviewCase.getCaseNumber(),
                    "Field inspection requested for physical property verification.");

        } else if ("ESCALATE".equalsIgnoreCase(request.getDecisionType())) {
            reviewCase.setStatus("UNDER_REVIEW");
            reviewCaseRepository.save(reviewCase);

            auditLogService.log("CASE_ESCALATED", "REVIEW_CASE", reviewCase.getCaseNumber(),
                    "Case escalated for senior underwriter concurrence.");
        }

        return toDto(reviewCase);
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return userRepository.findByUsername(auth.getName())
                    .orElseGet(() -> userRepository.findAll().get(0));
        }
        return userRepository.findAll().get(0);
    }

    private ReviewCaseDto toDto(ReviewCase c) {
        ReviewCaseDto dto = new ReviewCaseDto();
        dto.setId(c.getId());
        dto.setCaseNumber(c.getCaseNumber());
        dto.setPolicyId(c.getPolicy().getId());
        dto.setPolicyNumber(c.getPolicy().getPolicyNumber());
        dto.setPolicyholderName(c.getPolicy().getPolicyholderName());
        dto.setPropertyAddress(c.getPolicy().getProperty().getAddressLine1() + ", " + c.getPolicy().getProperty().getCity());
        dto.setCaseType(c.getCaseType());
        dto.setStatus(c.getStatus());
        if (c.getAssignedUnderwriter() != null) {
            dto.setAssignedUnderwriterId(c.getAssignedUnderwriter().getId());
            dto.setAssignedUnderwriterName(c.getAssignedUnderwriter().getFullName());
        }
        dto.setCurrentCoverageLimit(c.getPolicy().getCurrentCoverageLimit());

        List<RebuildingCostEstimate> estimates = estimateRepository.findPrimaryEstimatesByPropertyId(c.getPolicy().getProperty().getId());
        if (!estimates.isEmpty()) {
            dto.setLatestRebuildingCost(estimates.get(0).getEstimatedCost());
        } else {
            dto.setLatestRebuildingCost(BigDecimal.ZERO);
        }

        dto.setCurrentItvRatio(c.getCurrentItvRatio());
        dto.setCoverageGap(c.getCoverageGap());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setResolvedAt(c.getResolvedAt());
        return dto;
    }
}

