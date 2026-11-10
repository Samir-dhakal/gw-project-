package com.guidewire.itv.repository;

import com.guidewire.itv.entity.UnderwriterDecision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnderwriterDecisionRepository extends JpaRepository<UnderwriterDecision, Long> {

    List<UnderwriterDecision> findByReviewCaseIdOrderByDecisionTimestampDesc(Long caseId);

    List<UnderwriterDecision> findByUnderwriterId(Long underwriterId);

    long countByDecisionType(String decisionType);
}
