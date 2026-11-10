-- V1__init_schema.sql
-- Normalized Schema for Continuous Insurance-to-Value (ITV) Intelligence Engine

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_code VARCHAR(50) NOT NULL UNIQUE,
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    construction_type VARCHAR(50) NOT NULL,
    year_built INT NOT NULL,
    number_of_floors INT NOT NULL DEFAULT 1,
    ground_footprint_sqm DECIMAL(10, 2) NOT NULL,
    built_up_area_sqm DECIMAL(10, 2) NOT NULL,
    land_use_type VARCHAR(50) NOT NULL,
    has_recent_renovation BOOLEAN DEFAULT FALSE,
    renovation_details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,
    property_id BIGINT NOT NULL,
    policyholder_name VARCHAR(100) NOT NULL,
    policyholder_email VARCHAR(100),
    currency VARCHAR(5) NOT NULL DEFAULT 'INR',
    current_coverage_limit DECIMAL(14, 2) NOT NULL,
    inception_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    policy_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    workflow_type VARCHAR(30) NOT NULL DEFAULT 'IN_FORCE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_policy_property FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE coverage_snapshots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_id BIGINT NOT NULL,
    effective_date DATE NOT NULL,
    coverage_limit DECIMAL(14, 2) NOT NULL,
    endorsement_number VARCHAR(50),
    reason VARCHAR(255) NOT NULL,
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_snapshot_policy FOREIGN KEY (policy_id) REFERENCES policies(id)
);

CREATE TABLE rebuilding_cost_estimates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    estimate_date DATE NOT NULL,
    estimated_cost DECIMAL(14, 2) NOT NULL,
    cost_per_sqm DECIMAL(10, 2) NOT NULL,
    methodology VARCHAR(100) NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    provenance_category VARCHAR(50) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estimate_property FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE evidence_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    source_id VARCHAR(50) NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    source_url VARCHAR(500),
    publication_date DATE NOT NULL,
    retrieval_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    provenance_category VARCHAR(50) NOT NULL,
    source_reliability_score DECIMAL(5, 2) NOT NULL,
    freshness_score DECIMAL(5, 2) NOT NULL,
    completeness_score DECIMAL(5, 2) NOT NULL,
    raw_payload TEXT,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_evidence_property FOREIGN KEY (property_id) REFERENCES properties(id)
);

CREATE TABLE monitoring_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    policy_id BIGINT NOT NULL,
    evaluation_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    trigger_type VARCHAR(30) NOT NULL,
    dwelling_coverage DECIMAL(14, 2) NOT NULL,
    rebuilding_cost DECIMAL(14, 2) NOT NULL,
    itv_ratio DECIMAL(6, 2) NOT NULL,
    potential_coverage_gap DECIMAL(14, 2) NOT NULL,
    itv_drift DECIMAL(6, 2) NOT NULL DEFAULT 0.0,
    itv_classification VARCHAR(30) NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    confidence_category VARCHAR(20) NOT NULL,
    abstention_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    abstention_reasons TEXT,
    recommendation_text TEXT,
    CONSTRAINT fk_eval_policy FOREIGN KEY (policy_id) REFERENCES policies(id)
);

CREATE TABLE review_cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    policy_id BIGINT NOT NULL,
    case_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    assigned_underwriter_id BIGINT,
    current_itv_ratio DECIMAL(6, 2) NOT NULL,
    coverage_gap DECIMAL(14, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_case_policy FOREIGN KEY (policy_id) REFERENCES policies(id),
    CONSTRAINT fk_case_user FOREIGN KEY (assigned_underwriter_id) REFERENCES users(id)
);

CREATE TABLE underwriter_decisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    underwriter_id BIGINT NOT NULL,
    decision_type VARCHAR(30) NOT NULL,
    approved_coverage_limit DECIMAL(14, 2),
    decision_notes TEXT NOT NULL,
    decision_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_decision_case FOREIGN KEY (case_id) REFERENCES review_cases(id),
    CONSTRAINT fk_decision_user FOREIGN KEY (underwriter_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    username VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    details TEXT
);

CREATE TABLE coverage_scenarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    scenario_name VARCHAR(100) NOT NULL,
    hypothetical_coverage DECIMAL(14, 2) NOT NULL,
    projected_itv_ratio DECIMAL(6, 2) NOT NULL,
    remaining_gap DECIMAL(14, 2) NOT NULL,
    difference_from_current DECIMAL(14, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scenario_case FOREIGN KEY (case_id) REFERENCES review_cases(id)
);

CREATE TABLE integration_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    source_id VARCHAR(50) NOT NULL UNIQUE,
    source_name VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    base_url VARCHAR(500),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    last_sync_at TIMESTAMP,
    record_count INT DEFAULT 0,
    error_message TEXT,
    provenance_category VARCHAR(50) NOT NULL
);

-- Indexes for high-frequency queries
CREATE INDEX idx_policy_status ON policies(policy_status);
CREATE INDEX idx_policy_expiry ON policies(expiry_date);
CREATE INDEX idx_eval_policy_time ON monitoring_evaluations(policy_id, evaluation_timestamp);
CREATE INDEX idx_case_status ON review_cases(status);
CREATE INDEX idx_audit_time ON audit_logs(timestamp);

