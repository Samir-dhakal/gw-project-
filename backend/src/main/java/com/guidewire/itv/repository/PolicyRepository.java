package com.guidewire.itv.repository;

import com.guidewire.itv.entity.Policy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {

    Optional<Policy> findByPolicyNumber(String policyNumber);

    List<Policy> findByPolicyStatus(String policyStatus);

    List<Policy> findByWorkflowType(String workflowType);

    @Query("SELECT p FROM Policy p WHERE p.policyStatus = 'ACTIVE' AND p.expiryDate BETWEEN :today AND :cutoffDate")
    List<Policy> findPoliciesApproachingRenewal(@Param("today") LocalDate today, @Param("cutoffDate") LocalDate cutoffDate);

    long countByPolicyStatus(String policyStatus);
}

