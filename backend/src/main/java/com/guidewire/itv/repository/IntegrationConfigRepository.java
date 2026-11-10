package com.guidewire.itv.repository;

import com.guidewire.itv.entity.IntegrationConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IntegrationConfigRepository extends JpaRepository<IntegrationConfig, Long> {

    Optional<IntegrationConfig> findBySourceId(String sourceId);
}
