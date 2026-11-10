package com.guidewire.itv.controller;

import com.guidewire.itv.dto.AuditLogDto;
import com.guidewire.itv.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit")
@Tag(name = "Audit History", description = "Immutable audit logs for compliance, governance, and traceability")
public class AuditController {

    private final AuditLogService auditLogService;

    public AuditController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    @GetMapping("/recent")
    @Operation(summary = "Get the most recent system audit log entries")
    public ResponseEntity<List<AuditLogDto>> getRecentLogs() {
        List<AuditLogDto> logs = auditLogService.getRecentLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @Operation(summary = "Get audit logs for a specific entity")
    public ResponseEntity<List<AuditLogDto>> getLogsForEntity(
            @PathVariable String entityType,
            @PathVariable String entityId) {
        List<AuditLogDto> logs = auditLogService.getLogsForEntity(entityType, entityId);
        return ResponseEntity.ok(logs);
    }
}

