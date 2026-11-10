package com.guidewire.itv.dto;

import java.math.BigDecimal;

public class PropertyDto {
    private Long id;
    private String propertyCode;
    private String addressLine1;
    private String city;
    private String district;
    private String state;
    private String postalCode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String constructionType;
    private Integer yearBuilt;
    private Integer numberOfFloors;
    private BigDecimal groundFootprintSqm;
    private BigDecimal builtUpAreaSqm;
    private String landUseType;
    private Boolean hasRecentRenovation;
    private String renovationDetails;

    public PropertyDto() {}

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
}

