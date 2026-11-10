package com.guidewire.itv.service;

import com.guidewire.itv.dto.AuditLogDto;
import com.guidewire.itv.entity.AuditLog;
import com.guidewire.itv.repository.AuditLogRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(String action, String entityType, String entityId, String details) {
        String username = getCurrentUsername();
        AuditLog auditLog = new AuditLog(username, action, entityType, entityId, details);
        auditLogRepository.save(auditLog);
    }

    @Transactional
    public void log(String username, String action, String entityType, String entityId, String details) {
        AuditLog auditLog = new AuditLog(username, action, entityType, entityId, details);
        auditLogRepository.save(auditLog);
    }

    public List<AuditLogDto> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AuditLogDto> getLogsForEntity(String entityType, String entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(entityType, entityId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return auth.getName();
        }
        return "SYSTEM_MONITOR";
    }

    private AuditLogDto toDto(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setTimestamp(log.getTimestamp());
        dto.setUsername(log.getUsername());
        dto.setAction(log.getAction());
        dto.setEntityType(log.getEntityType());
        dto.setEntityId(log.getEntityId());
        dto.setDetails(log.getDetails());
        return dto;
    }
}

