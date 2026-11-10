package com.guidewire.itv.repository;

import com.guidewire.itv.entity.ReviewCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewCaseRepository extends JpaRepository<ReviewCase, Long> {

    Optional<ReviewCase> findByCaseNumber(String caseNumber);

    List<ReviewCase> findByPolicyId(Long policyId);

    List<ReviewCase> findByStatus(String status);

    List<ReviewCase> findByCaseType(String caseType);

    long countByStatus(String status);
}

