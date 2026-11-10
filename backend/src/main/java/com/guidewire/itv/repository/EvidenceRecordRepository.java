package com.guidewire.itv.repository;

import com.guidewire.itv.entity.EvidenceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceRecordRepository extends JpaRepository<EvidenceRecord, Long> {

    List<EvidenceRecord> findByPropertyIdOrderByPublicationDateDesc(Long propertyId);

    List<EvidenceRecord> findBySourceId(String sourceId);
}

