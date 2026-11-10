package com.guidewire.itv.repository;

import com.guidewire.itv.entity.MonitoringEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface MonitoringEvaluationRepository extends JpaRepository<MonitoringEvaluation, Long> {

    List<MonitoringEvaluation> findByPolicyIdOrderByEvaluationTimestampDesc(Long policyId);

    List<MonitoringEvaluation> findByPolicyIdOrderByEvaluationTimestampAsc(Long policyId);

    @Query(value = "SELECT e FROM MonitoringEvaluation e WHERE e.policy.id = :policyId ORDER BY e.evaluationTimestamp DESC")
    List<MonitoringEvaluation> findLatestByPolicyId(@Param("policyId") Long policyId);

    @Query("SELECT e FROM MonitoringEvaluation e WHERE e.id IN " +
           "(SELECT MAX(m.id) FROM MonitoringEvaluation m GROUP BY m.policy.id)")
    List<MonitoringEvaluation> findLatestEvaluationsForAllPolicies();

    @Query("SELECT SUM(e.potentialCoverageGap) FROM MonitoringEvaluation e WHERE e.id IN " +
           "(SELECT MAX(m.id) FROM MonitoringEvaluation m GROUP BY m.policy.id)")
    BigDecimal sumTotalPortfolioCoverageGap();

    long countByItvClassification(String itvClassification);

    long countByAbstentionTriggered(Boolean abstentionTriggered);

    long countByConfidenceCategory(String confidenceCategory);
}

