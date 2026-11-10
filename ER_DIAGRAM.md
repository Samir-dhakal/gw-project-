# Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    users ||--o{ review_cases : "assigned to"
    users ||--o{ underwriter_decisions : "makes"
    users ||--o{ audit_logs : "triggers"

    properties ||--o{ policies : "insures"
    properties ||--o{ rebuilding_cost_estimates : "has"
    properties ||--o{ evidence_records : "supported by"

    policies ||--o{ coverage_snapshots : "maintains"
    policies ||--o{ monitoring_evaluations : "evaluated by"
    policies ||--o{ review_cases : "subject of"

    review_cases ||--o{ underwriter_decisions : "resolved by"

    users {
        bigint id PK
        string username UK
        string email UK
        string password_hash
        string full_name
        string role
        boolean active
        timestamp created_at
    }

    properties {
        bigint id PK
        string property_code UK
        string address_line1
        string city
        string district
        string state
        string postal_code
        decimal latitude
        decimal longitude
        string construction_type
        int year_built
        int number_of_floors
        decimal ground_footprint_sqm
        decimal built_up_area_sqm
        string land_use_type
        boolean has_recent_renovation
        timestamp created_at
    }

    policies {
        bigint id PK
        string policy_number UK
        bigint property_id FK
        string policyholder_name
        string currency
        decimal current_coverage_limit
        date inception_date
        date expiry_date
        string policy_status
        string workflow_type
        timestamp created_at
    }

    coverage_snapshots {
        bigint id PK
        bigint policy_id FK
        date effective_date
        decimal coverage_limit
        string endorsement_number
        string reason
        timestamp recorded_at
    }

    rebuilding_cost_estimates {
        bigint id PK
        bigint property_id FK
        date estimate_date
        decimal estimated_cost
        decimal cost_per_sqm
        string methodology
        string source_name
        string provenance_category
        boolean is_primary
        timestamp created_at
    }

    evidence_records {
        bigint id PK
        bigint property_id FK
        string source_id
        string source_name
        string source_url
        date publication_date
        timestamp retrieval_date
        string provenance_category
        decimal source_reliability_score
        decimal freshness_score
        decimal completeness_score
        boolean is_valid
    }

    monitoring_evaluations {
        bigint id PK
        bigint policy_id FK
        timestamp evaluation_timestamp
        string trigger_type
        decimal dwelling_coverage
        decimal rebuilding_cost
        decimal itv_ratio
        decimal potential_coverage_gap
        decimal itv_drift
        string itv_classification
        decimal confidence_score
        string confidence_category
        boolean abstention_triggered
        text abstention_reasons
        text recommendation_text
    }

    review_cases {
        bigint id PK
        string case_number UK
        bigint policy_id FK
        string case_type
        string status
        bigint assigned_underwriter_id FK
        decimal current_itv_ratio
        decimal coverage_gap
        timestamp created_at
        timestamp resolved_at
    }

    underwriter_decisions {
        bigint id PK
        bigint case_id FK
        bigint underwriter_id FK
        string decision_type
        decimal approved_coverage_limit
        text decision_notes
        timestamp decision_timestamp
    }

    audit_logs {
        bigint id PK
        timestamp timestamp
        string username
        string action
        string entity_type
        string entity_id
        text details
    }
```

---

## Key Relational Integrity Guarantees
1. **Cascade & Deletion Safety:** Policies and coverage snapshots have `ON DELETE RESTRICT` constraints to prevent accidental erasure of regulatory insurance contracts.
2. **Temporal Integrity:** `coverage_snapshots`, `monitoring_evaluations`, and `audit_logs` are strictly append-only. No `UPDATE` queries are ever issued against historical snapshot records.
3. **Traceability:** Every `underwriter_decision` links to an open `review_case` and records the responsible `user_id` and timestamp, guaranteeing complete accountability.
