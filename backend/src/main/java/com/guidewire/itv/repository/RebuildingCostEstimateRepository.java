package com.guidewire.itv.repository;

import com.guidewire.itv.entity.RebuildingCostEstimate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RebuildingCostEstimateRepository extends JpaRepository<RebuildingCostEstimate, Long> {

    List<RebuildingCostEstimate> findByPropertyIdOrderByEstimateDateAsc(Long propertyId);

    @Query("SELECT e FROM RebuildingCostEstimate e WHERE e.property.id = :propertyId AND e.isPrimary = true ORDER BY e.estimateDate DESC, e.createdAt DESC")
    List<RebuildingCostEstimate> findPrimaryEstimatesByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT e FROM RebuildingCostEstimate e WHERE e.property.id = :propertyId ORDER BY e.estimateDate DESC")
    List<RebuildingCostEstimate> findAllEstimatesByPropertyId(@Param("propertyId") Long propertyId);
}
