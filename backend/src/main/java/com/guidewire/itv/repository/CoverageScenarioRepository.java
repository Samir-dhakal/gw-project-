package com.guidewire.itv.repository;

import com.guidewire.itv.entity.CoverageScenario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoverageScenarioRepository extends JpaRepository<CoverageScenario, Long> {

    List<CoverageScenario> findByReviewCaseId(Long caseId);
}
