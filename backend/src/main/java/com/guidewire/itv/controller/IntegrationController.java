package com.guidewire.itv.controller;

import com.guidewire.itv.dto.IntegrationConfigDto;
import com.guidewire.itv.service.ExternalDataIntegrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/integrations")
@Tag(name = "Data Integration Centre", description = "Public Indian data sources (MoSPI, DPIIT, CPWD, GOBS, TN PWD) status and sync")
public class IntegrationController {

    private final ExternalDataIntegrationService integrationService;

    public IntegrationController(ExternalDataIntegrationService integrationService) {
        this.integrationService = integrationService;
    }

    @GetMapping
    @Operation(summary = "Get all configured external data integrations and their sync status")
    public ResponseEntity<List<IntegrationConfigDto>> getAllIntegrations() {
        List<IntegrationConfigDto> integrations = integrationService.getAllIntegrations();
        return ResponseEntity.ok(integrations);
    }

    @PostMapping("/sync/{sourceId}")
    @Operation(summary = "Trigger ingestion and sync for an external data source")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<IntegrationConfigDto> syncIntegration(@PathVariable String sourceId) {
        IntegrationConfigDto config = integrationService.syncIntegration(sourceId);
        return ResponseEntity.ok(config);
    }
}
