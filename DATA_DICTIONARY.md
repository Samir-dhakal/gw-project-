# Comprehensive Data Dictionary & Schema Specification

This document details the normalized relational entities, fields, data types, constraints, and business definitions for the **Continuous Insurance-to-Value (ITV) Intelligence Engine**.

---

## 1. Security & Identity Management

### 1.1 `users`
Represents system operators, underwriters, and administrators.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique user identifier |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | User login name |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Official email address |
| `password_hash` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `full_name` | VARCHAR(100) | NOT NULL | User's legal name |
| `role` | VARCHAR(30) | NOT NULL | `ADMIN`, `UNDERWRITER`, `REVIEWER`, `VIEWER` |
| `active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Account active status |
| `created_at` | TIMESTAMP | NOT NULL | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Record modification timestamp |

---

## 2. Core Insurance Portfolio Entities

### 2.1 `properties`
Represents the insured physical residential dwelling.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique property ID |
| `property_code` | VARCHAR(50) | NOT NULL, UNIQUE | Unique identifier (e.g. `PROP-TN-CHN-001`) |
| `address_line1` | VARCHAR(255) | NOT NULL | Street address / Door number |
| `city` | VARCHAR(100) | NOT NULL | City (e.g., Chennai, Coimbatore) |
| `district` | VARCHAR(100) | NOT NULL | District name |
| `state` | VARCHAR(100) | NOT NULL | State (Tamil Nadu) |
| `postal_code` | VARCHAR(10) | NOT NULL | Indian PIN Code (e.g., `600028`) |
| `latitude` | DECIMAL(10, 7) | NULL | GPS Latitude |
| `longitude` | DECIMAL(10, 7) | NULL | GPS Longitude |
| `construction_type` | VARCHAR(50) | NOT NULL | `RCC_FRAMED`, `LOAD_BEARING`, `STEEL_FRAME` |
| `year_built` | INT | NOT NULL | Year of construction completion |
| `number_of_floors`| INT | NOT NULL, DEFAULT 1 | Total storeys above ground |
| `ground_footprint_sqm`| DECIMAL(10, 2) | NOT NULL | Base polygon footprint in sq. meters |
| `built_up_area_sqm` | DECIMAL(10, 2) | NOT NULL | Total gross built-up area in sq. meters |
| `land_use_type` | VARCHAR(50) | NOT NULL | `RESIDENTIAL_INDIVIDUAL`, `RESIDENTIAL_APARTMENT` |
| `has_recent_renovation`| BOOLEAN | DEFAULT FALSE | Flag indicating unappraised additions |
| `renovation_details`| TEXT | NULL | Description of structural additions |
| `created_at` | TIMESTAMP | NOT NULL | Creation timestamp |

### 2.2 `policies`
Represents an active homeowners residential insurance policy.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Unique policy record ID |
| `policy_number` | VARCHAR(50) | NOT NULL, UNIQUE | Policy contract number (e.g. `POL-IN-2025-00101`) |
| `property_id` | BIGINT | NOT NULL, FK(`properties.id`)| Associated physical property |
| `policyholder_name` | VARCHAR(100) | NOT NULL | Insured customer's legal name |
| `policyholder_email`| VARCHAR(100) | NULL | Contact email |
| `currency` | VARCHAR(5) | NOT NULL, DEFAULT 'INR' | Currency code (`INR` / ₹) |
| `current_coverage_limit`| DECIMAL(14, 2)| NOT NULL | Current dwelling building coverage limit |
| `inception_date` | DATE | NOT NULL | Coverage start date |
| `expiry_date` | DATE | NOT NULL | Coverage expiration / renewal date |
| `policy_status` | VARCHAR(30) | NOT NULL | `ACTIVE`, `PENDING_RENEWAL`, `EXPIRED`, `CANCELLED` |
| `workflow_type` | VARCHAR(30) | NOT NULL | Current state: `IN_FORCE`, `MIDTERM_REVIEW`, `RENEWAL_WINDOW` |
| `created_at` | TIMESTAMP | NOT NULL | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | Modification timestamp |

### 2.3 `coverage_snapshots`
Immutable historical log of coverage limits over the policy lifecycle.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Snapshot ID |
| `policy_id` | BIGINT | NOT NULL, FK(`policies.id`) | Foreign key to policy |
| `effective_date` | DATE | NOT NULL | Date coverage took effect |
| `coverage_limit` | DECIMAL(14, 2) | NOT NULL | Dwelling limit in INR |
| `endorsement_number`| VARCHAR(50) | NULL | Endorsement reference if modified midterm |
| `reason` | VARCHAR(255) | NOT NULL | Reason: `INCEPTION`, `MIDTERM_ENDORSEMENT`, `ANNUAL_RENEWAL` |
| `recorded_at` | TIMESTAMP | NOT NULL | Audit insertion timestamp |

---

## 3. Valuation & Evidence Entities

### 3.1 `rebuilding_cost_estimates`
Historical and active structural replacement cost estimates for a property.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Estimate ID |
| `property_id` | BIGINT | NOT NULL, FK(`properties.id`) | Property evaluated |
| `estimate_date` | DATE | NOT NULL | Effective calculation date |
| `estimated_cost` | DECIMAL(14, 2) | NOT NULL | Rebuilding cost in INR |
| `cost_per_sqm` | DECIMAL(10, 2) | NOT NULL | Derived unit rate (INR / sqm) |
| `methodology` | VARCHAR(100) | NOT NULL | `CPWD_PAR_2025_DERIVED`, `TN_PWD_SCHEDULE_DERIVED`, `BUILDER_APPRAISAL` |
| `source_name` | VARCHAR(100) | NOT NULL | Primary data source name |
| `provenance_category`| VARCHAR(50) | NOT NULL | `REAL_PUBLIC_DOCUMENT`, `DERIVED_DATA`, `SIMULATED_API` |
| `is_primary` | BOOLEAN | NOT NULL, DEFAULT TRUE | Whether this estimate is currently active for ITV |
| `created_at` | TIMESTAMP | NOT NULL | Insertion timestamp |

### 3.2 `evidence_records`
Specific external or physical evidence items supporting property estimates.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Evidence record ID |
| `property_id` | BIGINT | NOT NULL, FK(`properties.id`) | Linked property |
| `source_id` | VARCHAR(50) | NOT NULL | Identifier (`MOSPI_CPI`, `DPIIT_WPI`, `CPWD_PAR_2025`, `GOBS_AEEE`, `TN_PWD`) |
| `source_name` | VARCHAR(100) | NOT NULL | Human-readable source title |
| `source_url` | VARCHAR(500) | NULL | Official public URL |
| `publication_date` | DATE | NOT NULL | Date data was published by authority |
| `retrieval_date` | TIMESTAMP | NOT NULL | Timestamp when fetched into engine |
| `provenance_category`| VARCHAR(50) | NOT NULL | `REAL_PUBLIC_API`, `REAL_PUBLIC_DATASET`, etc. |
| `source_reliability_score`| DECIMAL(5, 2)| NOT NULL | $S \in [0, 100]$ |
| `freshness_score` | DECIMAL(5, 2)| NOT NULL | $F \in [0, 100]$ |
| `completeness_score` | DECIMAL(5, 2)| NOT NULL | $K \in [0, 100]$ |
| `raw_payload` | TEXT | NULL | JSON representation of underlying data points |
| `is_valid` | BOOLEAN | NOT NULL, DEFAULT TRUE | Verification status |

---

## 4. Continuous Monitoring & Decision Entities

### 4.1 `monitoring_evaluations`
Audit record of every in-force policy evaluation run (scheduled, event, or manual).
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Evaluation ID |
| `policy_id` | BIGINT | NOT NULL, FK(`policies.id`) | Evaluated policy |
| `evaluation_timestamp`| TIMESTAMP | NOT NULL | Evaluation time |
| `trigger_type` | VARCHAR(30) | NOT NULL | `SCHEDULED_DAILY`, `EVENT_DRIVEN`, `MANUAL_REASSESSMENT` |
| `dwelling_coverage` | DECIMAL(14, 2)| NOT NULL | Policy coverage evaluated |
| `rebuilding_cost` | DECIMAL(14, 2)| NOT NULL | Rebuilding estimate evaluated |
| `itv_ratio` | DECIMAL(6, 2) | NOT NULL | $(\text{Coverage} / \text{Cost}) \times 100$ |
| `potential_coverage_gap`| DECIMAL(14, 2)| NOT NULL | $\max(0, \text{Cost} - \text{Coverage})$ |
| `itv_drift` | DECIMAL(6, 2) | NOT NULL | Current ITV minus prior ITV |
| `itv_classification` | VARCHAR(30) | NOT NULL | `ADEQUATE`, `WATCH`, `WARNING`, `CRITICAL` |
| `confidence_score` | DECIMAL(5, 2)| NOT NULL | Overall $C = 0.30S + 0.25F + 0.20K + 0.25A$ |
| `confidence_category`| VARCHAR(20) | NOT NULL | `HIGH` ($\ge 80$), `MEDIUM` ($60-79.99$), `LOW` ($< 60$) |
| `abstention_triggered`| BOOLEAN | NOT NULL, DEFAULT FALSE | Whether hard abstention was triggered |
| `abstention_reasons` | TEXT | NULL | Human-readable explanation of abstention |
| `recommendation_text` | TEXT | NULL | Generated underwriter guidance |

### 4.2 `review_cases`
Work items created when an in-force policy enters Warning/Critical or requires evidence verification.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Case ID |
| `case_number` | VARCHAR(50) | NOT NULL, UNIQUE | Human identifier (e.g. `CASE-2025-0042`) |
| `policy_id` | BIGINT | NOT NULL, FK(`policies.id`) | Targeted policy |
| `case_type` | VARCHAR(30) | NOT NULL | `MIDTERM_UNDERINSURANCE`, `RENEWAL_UNDERINSURANCE`, `EVIDENCE_VERIFICATION` |
| `status` | VARCHAR(30) | NOT NULL | `OPEN`, `UNDER_REVIEW`, `EVIDENCE_REQUESTED`, `RESOLVED`, `CLOSED` |
| `assigned_underwriter_id`| BIGINT | NULL, FK(`users.id`) | Assigned reviewer |
| `current_itv_ratio` | DECIMAL(6, 2) | NOT NULL | ITV ratio at case creation |
| `coverage_gap` | DECIMAL(14, 2)| NOT NULL | Rupee shortfall |
| `created_at` | TIMESTAMP | NOT NULL | Case open timestamp |
| `resolved_at` | TIMESTAMP | NULL | Case resolution timestamp |

### 4.3 `underwriter_decisions`
Immutable record of human approvals, rejections, and endorsement endorsements.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Decision ID |
| `case_id` | BIGINT | NOT NULL, FK(`review_cases.id`) | Case resolved |
| `underwriter_id` | BIGINT | NOT NULL, FK(`users.id`) | Deciding user |
| `decision_type` | VARCHAR(30) | NOT NULL | `APPROVE_ENDORSEMENT`, `REJECT_CHANGE`, `ESCALATE`, `REQUEST_FIELD_INSPECTION` |
| `approved_coverage_limit`| DECIMAL(14, 2)| NULL | Revised limit if approved |
| `decision_notes` | TEXT | NOT NULL | Underwriter rationale |
| `decision_timestamp`| TIMESTAMP | NOT NULL | Timestamp |

### 4.4 `audit_logs`
System-wide immutable audit trail for security and regulatory compliance.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, AUTO_INCREMENT | Audit log ID |
| `timestamp` | TIMESTAMP | NOT NULL | Event time |
| `username` | VARCHAR(50) | NOT NULL | User or `SYSTEM_MONITOR` |
| `action` | VARCHAR(50) | NOT NULL | `EVALUATION_RUN`, `CASE_CREATED`, `DECISION_RECORDED`, `ENDORSEMENT_APPLIED` |
| `entity_type` | VARCHAR(50) | NOT NULL | `POLICY`, `EVALUATION`, `CASE`, `DECISION` |
| `entity_id` | VARCHAR(50) | NOT NULL | Identifier of affected entity |
| `details` | TEXT | NULL | JSON or textual diff of state change |
