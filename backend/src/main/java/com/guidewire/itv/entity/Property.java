package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_code", nullable = false, unique = true, length = 50)
    private String propertyCode;

    @Column(name = "address_line1", nullable = false)
    private String addressLine1;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(nullable = false, length = 100)
    private String district;

    @Column(nullable = false, length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 10)
    private String postalCode;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "construction_type", nullable = false, length = 50)
    private String constructionType; // RCC_FRAMED, LOAD_BEARING, STEEL_FRAME

    @Column(name = "year_built", nullable = false)
    private Integer yearBuilt;

    @Column(name = "number_of_floors", nullable = false)
    private Integer numberOfFloors = 1;

    @Column(name = "ground_footprint_sqm", nullable = false, precision = 10, scale = 2)
    private BigDecimal groundFootprintSqm;

    @Column(name = "built_up_area_sqm", nullable = false, precision = 10, scale = 2)
    private BigDecimal builtUpAreaSqm;

    @Column(name = "land_use_type", nullable = false, length = 50)
    private String landUseType;

    @Column(name = "has_recent_renovation")
    private Boolean hasRecentRenovation = false;

    @Column(name = "renovation_details", columnDefinition = "TEXT")
    private String renovationDetails;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Property() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPropertyCode() { return propertyCode; }
    public void setPropertyCode(String propertyCode) { this.propertyCode = propertyCode; }

    public String getAddressLine1() { return addressLine1; }
    public void setAddressLine1(String addressLine1) { this.addressLine1 = addressLine1; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public String getConstructionType() { return constructionType; }
    public void setConstructionType(String constructionType) { this.constructionType = constructionType; }

    public Integer getYearBuilt() { return yearBuilt; }
    public void setYearBuilt(Integer yearBuilt) { this.yearBuilt = yearBuilt; }

    public Integer getNumberOfFloors() { return numberOfFloors; }
    public void setNumberOfFloors(Integer numberOfFloors) { this.numberOfFloors = numberOfFloors; }

    public BigDecimal getGroundFootprintSqm() { return groundFootprintSqm; }
    public void setGroundFootprintSqm(BigDecimal groundFootprintSqm) { this.groundFootprintSqm = groundFootprintSqm; }

    public BigDecimal getBuiltUpAreaSqm() { return builtUpAreaSqm; }
    public void setBuiltUpAreaSqm(BigDecimal builtUpAreaSqm) { this.builtUpAreaSqm = builtUpAreaSqm; }

    public String getLandUseType() { return landUseType; }
    public void setLandUseType(String landUseType) { this.landUseType = landUseType; }

    public Boolean getHasRecentRenovation() { return hasRecentRenovation; }
    public void setHasRecentRenovation(Boolean hasRecentRenovation) { this.hasRecentRenovation = hasRecentRenovation; }

    public String getRenovationDetails() { return renovationDetails; }
    public void setRenovationDetails(String renovationDetails) { this.renovationDetails = renovationDetails; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

