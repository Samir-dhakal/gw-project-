package com.guidewire.itv.controller;

import com.guidewire.itv.dto.ImportResultDto;
import com.guidewire.itv.dto.IntegrationConfigDto;
import com.guidewire.itv.service.DataImportService;
import com.guidewire.itv.service.ExternalDataIntegrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/integrations")
@Tag(name = "Data Integration Centre", description = "Public Indian data sources (MoSPI, DPIIT, CPWD, GOBS, TN PWD) status, importers, and sync")
public class IntegrationController {

    private final ExternalDataIntegrationService integrationService;
    private final DataImportService dataImportService;

    public IntegrationController(ExternalDataIntegrationService integrationService,
                                 DataImportService dataImportService) {
        this.integrationService = integrationService;
        this.dataImportService = dataImportService;
    }

    @GetMapping
    @Operation(summary = "Get all configured external data integrations and their sync status")
    public ResponseEntity<List<IntegrationConfigDto>> getAllIntegrations() {
        List<IntegrationConfigDto> integrations = integrationService.getAllIntegrations();
        return ResponseEntity.ok(integrations);
    }

    @PostMapping("/sync/{sourceId}")
    @Operation(summary = "Trigger ingestion and sync for an external data source")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<IntegrationConfigDto> syncIntegration(@PathVariable String sourceId) {
        IntegrationConfigDto config = integrationService.syncIntegration(sourceId);
        return ResponseEntity.ok(config);
    }

    @PostMapping("/import/synthetic-csv")
    @Operation(summary = "Import supplied synthetic policies, properties, estimates, and evidence CSVs with SYNTHETIC_DEMO_DATA label")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<ImportResultDto> importSyntheticCsv(@RequestParam(defaultValue = "data/synthetic_demo") String path) {
        ImportResultDto result = dataImportService.importSyntheticDataset(path);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import/pwd-rates")
    @Operation(summary = "Import and validate Tamil Nadu PWD Schedule of Rates 2025-26 JSON")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<ImportResultDto> importPwdRates(@RequestParam(defaultValue = "data/tn_pwd_sor_2025_26.json") String path) {
        ImportResultDto result = dataImportService.importPwdScheduleOfRates(path);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import/wpi-series")
    @Operation(summary = "Import and validate DPIIT Wholesale Price Index materials CSV")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<ImportResultDto> importWpiSeries(@RequestParam(defaultValue = "data/dpiit_wpi_construction_materials.csv") String path) {
        ImportResultDto result = dataImportService.importWpiSeries(path);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/import/building-footprints")
    @Operation(summary = "Import and validate Tamil Nadu Urban Building Footprints for property intelligence")
    @PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")
    public ResponseEntity<ImportResultDto> importBuildingFootprints(@RequestParam(defaultValue = "data/tamilnadu_urban_building_footprints.csv") String path) {
        ImportResultDto result = dataImportService.importBuildingFootprints(path);
        return ResponseEntity.ok(result);
    }
}

