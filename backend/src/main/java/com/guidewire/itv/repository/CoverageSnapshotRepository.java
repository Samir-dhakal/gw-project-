package com.guidewire.itv.repository;

import com.guidewire.itv.entity.CoverageSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoverageSnapshotRepository extends JpaRepository<CoverageSnapshot, Long> {

    List<CoverageSnapshot> findByPolicyIdOrderByEffectiveDateAsc(Long policyId);

    @Query("SELECT s FROM CoverageSnapshot s WHERE s.policy.id = :policyId ORDER BY s.effectiveDate DESC, s.recordedAt DESC")
    List<CoverageSnapshot> findLatestSnapshotsByPolicyId(@Param("policyId") Long policyId);
}

