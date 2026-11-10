package com.guidewire.itv;

import com.guidewire.itv.dto.ConfidenceBreakdownDto;
import com.guidewire.itv.entity.EvidenceRecord;
import com.guidewire.itv.entity.Property;
import com.guidewire.itv.entity.RebuildingCostEstimate;
import com.guidewire.itv.service.EvidenceConfidenceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Evidence Reliability & Hard Abstention Unit Tests")
class ConfidenceEngineTest {

    private EvidenceConfidenceService confidenceService;

    @BeforeEach
    void setUp() {
        confidenceService = new EvidenceConfidenceService();
    }

    private Property createCompleteProperty() {
        Property p = new Property();
        p.setPropertyCode("PROP-TEST-001");
        p.setAddressLine1("123 Anna Nagar, Chennai");
        p.setCity("Chennai");
        p.setState("Tamil Nadu");
        p.setBuiltUpAreaSqm(new BigDecimal("200.00"));
        p.setGroundFootprintSqm(new BigDecimal("100.00"));
        p.setConstructionType("RCC_FRAMED");
        p.setYearBuilt(2018);
        p.setNumberOfFloors(2);
        return p;
    }

    @Test
    @DisplayName("Should evaluate high confidence when evidence is fresh, complete, and singular")
    void testEvaluateConfidence_High() {
        Property property = createCompleteProperty();

        RebuildingCostEstimate primary = new RebuildingCostEstimate();
        primary.setEstimatedCost(new BigDecimal("5000000.00"));
        primary.setEstimateDate(LocalDate.now().minusDays(30));
        primary.setProvenanceCategory("REAL_PUBLIC_DOCUMENT");

        List<RebuildingCostEstimate> allEstimates = List.of(primary);
        List<EvidenceRecord> records = new ArrayList<>();

        ConfidenceBreakdownDto result = confidenceService.evaluateConfidence(property, primary, allEstimates, records);

        assertNotNull(result);
        assertEquals("HIGH", result.getCategory());
        assertFalse(result.getAbstentionTriggered());
        assertTrue(result.getOverallScore().compareTo(new BigDecimal("80.00")) >= 0);
    }

    @Test
    @DisplayName("Should trigger HARD ABSTENTION when independent estimates disagree by > 20%")
    void testEvaluateConfidence_ConflictingEstimates_HardAbstention() {
        Property property = createCompleteProperty();

        // Primary: Builder appraisal 70L
        RebuildingCostEstimate est1 = new RebuildingCostEstimate();
        est1.setEstimatedCost(new BigDecimal("7000000.00"));
        est1.setEstimateDate(LocalDate.now().minusDays(20));
        est1.setProvenanceCategory("DERIVED_DATA");

        // Secondary: CPWD Rate 92L -> Divergence = (92 - 70) / 70 = 31.4%
        RebuildingCostEstimate est2 = new RebuildingCostEstimate();
        est2.setEstimatedCost(new BigDecimal("9200000.00"));
        est2.setEstimateDate(LocalDate.now().minusDays(10));
        est2.setProvenanceCategory("REAL_PUBLIC_DOCUMENT");

        List<RebuildingCostEstimate> allEstimates = List.of(est1, est2);
        List<EvidenceRecord> records = new ArrayList<>();

        ConfidenceBreakdownDto result = confidenceService.evaluateConfidence(property, est1, allEstimates, records);

        assertNotNull(result);
        assertTrue(result.getAbstentionTriggered(), "Hard abstention MUST be triggered when estimates diverge > 20%");
        assertTrue(result.getAbstentionReasons().stream()
                .anyMatch(r -> r.contains("materially contradict") || r.contains("Disagreement")));
        assertTrue(result.getRecommendedVerificationAction().contains("inspection"));
    }

    @Test
    @DisplayName("Should trigger HARD ABSTENTION when evidence is older than 365 days")
    void testEvaluateConfidence_StaleEvidence_HardAbstention() {
        Property property = createCompleteProperty();

        RebuildingCostEstimate staleEst = new RebuildingCostEstimate();
        staleEst.setEstimatedCost(new BigDecimal("5000000.00"));
        staleEst.setEstimateDate(LocalDate.now().minusDays(400)); // 400 days old
        staleEst.setProvenanceCategory("REAL_PUBLIC_DOCUMENT");

        List<RebuildingCostEstimate> allEstimates = List.of(staleEst);

        ConfidenceBreakdownDto result = confidenceService.evaluateConfidence(property, staleEst, allEstimates, new ArrayList<>());

        assertTrue(result.getAbstentionTriggered());
        assertTrue(result.getAbstentionReasons().stream().anyMatch(r -> r.contains("stale")));
    }

    @Test
    @DisplayName("Should trigger HARD ABSTENTION when critical property metrics (e.g. builtUpArea) are missing")
    void testEvaluateConfidence_MissingMetrics_HardAbstention() {
        Property property = createCompleteProperty();
        property.setBuiltUpAreaSqm(null); // Missing built-up area!

        RebuildingCostEstimate primary = new RebuildingCostEstimate();
        primary.setEstimatedCost(new BigDecimal("5000000.00"));
        primary.setEstimateDate(LocalDate.now().minusDays(30));
        primary.setProvenanceCategory("REAL_PUBLIC_DOCUMENT");

        ConfidenceBreakdownDto result = confidenceService.evaluateConfidence(property, primary, List.of(primary), new ArrayList<>());

        assertTrue(result.getAbstentionTriggered());
        assertTrue(result.getMissingFields().contains("builtUpAreaSqm"));
    }
}
