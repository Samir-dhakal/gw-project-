package com.guidewire.itv.repository;

import com.guidewire.itv.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    Optional<Property> findByPropertyCode(String propertyCode);
}

