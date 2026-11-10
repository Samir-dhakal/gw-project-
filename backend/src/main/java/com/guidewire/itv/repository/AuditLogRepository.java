package com.guidewire.itv.repository;

import com.guidewire.itv.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, String entityId);

    List<AuditLog> findTop50ByOrderByTimestampDesc();
}
