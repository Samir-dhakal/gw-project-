package com.guidewire.itv.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "policy_number", nullable = false, unique = true, length = 50)
    private String policyNumber;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    @Column(name = "policyholder_name", nullable = false, length = 100)
    private String policyholderName;

    @Column(name = "policyholder_email", length = 100)
    private String policyholderEmail;

    @Column(nullable = false, length = 5)
    private String currency = "INR";

    @Column(name = "current_coverage_limit", nullable = false, precision = 14, scale = 2)
    private BigDecimal currentCoverageLimit;

    @Column(name = "inception_date", nullable = false)
    private LocalDate inceptionDate;

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @Column(name = "policy_status", nullable = false, length = 30)
    private String policyStatus = "ACTIVE"; // ACTIVE, PENDING_RENEWAL, EXPIRED, CANCELLED

    @Column(name = "workflow_type", nullable = false, length = 30)
    private String workflowType = "IN_FORCE"; // IN_FORCE, MIDTERM_REVIEW, RENEWAL_WINDOW

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Policy() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }

    public Property getProperty() { return property; }
    public void setProperty(Property property) { this.property = property; }

    public String getPolicyholderName() { return policyholderName; }
    public void setPolicyholderName(String policyholderName) { this.policyholderName = policyholderName; }

    public String getPolicyholderEmail() { return policyholderEmail; }
    public void setPolicyholderEmail(String policyholderEmail) { this.policyholderEmail = policyholderEmail; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public BigDecimal getCurrentCoverageLimit() { return currentCoverageLimit; }
    public void setCurrentCoverageLimit(BigDecimal currentCoverageLimit) { this.currentCoverageLimit = currentCoverageLimit; }

    public LocalDate getInceptionDate() { return inceptionDate; }
    public void setInceptionDate(LocalDate inceptionDate) { this.inceptionDate = inceptionDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public String getPolicyStatus() { return policyStatus; }
    public void setPolicyStatus(String policyStatus) { this.policyStatus = policyStatus; }

    public String getWorkflowType() { return workflowType; }
    public void setWorkflowType(String workflowType) { this.workflowType = workflowType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
