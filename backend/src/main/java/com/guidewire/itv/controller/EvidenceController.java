package com.guidewire.itv.controller;

import com.guidewire.itv.dto.ConfidenceBreakdownDto;
import com.guidewire.itv.dto.EvidenceRecordDto;
import com.guidewire.itv.entity.EvidenceRecord;
import com.guidewire.itv.entity.Policy;
import com.guidewire.itv.entity.Property;
import com.guidewire.itv.entity.RebuildingCostEstimate;
import com.guidewire.itv.exception.ResourceNotFoundException;
import com.guidewire.itv.repository.EvidenceRecordRepository;
import com.guidewire.itv.repository.PolicyRepository;
import com.guidewire.itv.repository.PropertyRepository;
import com.guidewire.itv.repository.RebuildingCostEstimateRepository;
import com.guidewire.itv.service.EvidenceConfidenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/evidence")
@Tag(name = "Evidence Intelligence", description = "Evidence provenance inspection, reliability scoring, and explainable abstention")
public class EvidenceController {

    private final EvidenceRecordRepository evidenceRepository;
    private final PropertyRepository propertyRepository;
    private final PolicyRepository policyRepository;
    private final RebuildingCostEstimateRepository estimateRepository;
    private final EvidenceConfidenceService confidenceService;

    public EvidenceController(EvidenceRecordRepository evidenceRepository,
                              PropertyRepository propertyRepository,
                              PolicyRepository policyRepository,
                              RebuildingCostEstimateRepository estimateRepository,
                              EvidenceConfidenceService confidenceService) {
        this.evidenceRepository = evidenceRepository;
        this.propertyRepository = propertyRepository;
        this.policyRepository = policyRepository;
        this.estimateRepository = estimateRepository;
        this.confidenceService = confidenceService;
    }

    @GetMapping("/property/{propertyId}")
    @Operation(summary = "Get all evidence records associated with a property")
    public ResponseEntity<List<EvidenceRecordDto>> getEvidenceForProperty(@PathVariable Long propertyId) {
        List<EvidenceRecordDto> list = evidenceRepository.findByPropertyIdOrderByPublicationDateDesc(propertyId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @GetMapping("/confidence/{policyId}")
    @Operation(summary = "Get transparent 4-component confidence scoring breakdown (S, F, K, A) and abstention reasons")
    public ResponseEntity<ConfidenceBreakdownDto> getConfidenceBreakdown(@PathVariable Long policyId) {
        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("Policy not found with ID: " + policyId));

        Property property = policy.getProperty();
        List<RebuildingCostEstimate> primary = estimateRepository.findPrimaryEstimatesByPropertyId(property.getId());
        List<RebuildingCostEstimate> allEstimates = estimateRepository.findAllEstimatesByPropertyId(property.getId());
        RebuildingCostEstimate primaryEstimate = primary.isEmpty() ? (allEstimates.isEmpty() ? null : allEstimates.get(0)) : primary.get(0);
        List<EvidenceRecord> evidenceRecords = evidenceRepository.findByPropertyIdOrderByPublicationDateDesc(property.getId());

        ConfidenceBreakdownDto breakdown = confidenceService.evaluateConfidence(property, primaryEstimate, allEstimates, evidenceRecords);
        return ResponseEntity.ok(breakdown);
    }

    private EvidenceRecordDto toDto(EvidenceRecord r) {
        EvidenceRecordDto d = new EvidenceRecordDto();
        d.setId(r.getId());
        d.setPropertyId(r.getProperty().getId());
        d.setSourceId(r.getSourceId());
        d.setSourceName(r.getSourceName());
        d.setSourceUrl(r.getSourceUrl());
        d.setPublicationDate(r.getPublicationDate());
        d.setRetrievalDate(r.getRetrievalDate());
        d.setProvenanceCategory(r.getProvenanceCategory());
        d.setSourceReliabilityScore(r.getSourceReliabilityScore());
        d.setFreshnessScore(r.getFreshnessScore());
        d.setCompletenessScore(r.getCompletenessScore());
        d.setRawPayload(r.getRawPayload());
        d.setIsValid(r.getIsValid());
        return d;
    }
}

