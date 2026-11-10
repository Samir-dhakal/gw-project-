-- V2__seed_demo_data.sql
-- Seed Demonstration Data for Continuous ITV Intelligence Engine

-- 1. Users
-- Passwords BCrypt encoded:
-- admin / Admin@123: $2a$10$wE8wBglR44DkO4f1mC6YheL9b8WqUj5kL4NnZbVvD2VvQ7.C0o22q
-- underwriter / Underwriter@123: $2a$10$rN3c5iK/p4Xh4hT21R73uO8z4t7hT21R73uO8z4t7hT21R73uO8z4
-- reviewer / Reviewer@123: $2a$10$rN3c5iK/p4Xh4hT21R73uO8z4t7hT21R73uO8z4t7hT21R73uO8z4
-- viewer / Viewer@123: $2a$10$rN3c5iK/p4Xh4hT21R73uO8z4t7hT21R73uO8z4t7hT21R73uO8z4
INSERT INTO users (id, username, email, password_hash, full_name, role, active, created_at, updated_at) VALUES
(1, 'admin', 'admin@guidewire-itv.in', '$2a$10$wE8wBglR44DkO4f1mC6YheL9b8WqUj5kL4NnZbVvD2VvQ7.C0o22q', 'Dr. Ramesh Sundaram (System Admin)', 'ADMIN', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'underwriter', 'underwriter@guidewire-itv.in', '$2a$10$wE8wBglR44DkO4f1mC6YheL9b8WqUj5kL4NnZbVvD2VvQ7.C0o22q', 'Ananya Krishnan (Senior Underwriter)', 'UNDERWRITER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'reviewer', 'reviewer@guidewire-itv.in', '$2a$10$wE8wBglR44DkO4f1mC6YheL9b8WqUj5kL4NnZbVvD2VvQ7.C0o22q', 'Siddharth Iyer (Quality Reviewer)', 'REVIEWER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'viewer', 'viewer@guidewire-itv.in', '$2a$10$wE8wBglR44DkO4f1mC6YheL9b8WqUj5kL4NnZbVvD2VvQ7.C0o22q', 'Kavitha Natarajan (Executive Viewer)', 'VIEWER', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Properties (Tamil Nadu Residential Demonstration Region)
INSERT INTO properties (id, property_code, address_line1, city, district, state, postal_code, latitude, longitude, construction_type, year_built, number_of_floors, ground_footprint_sqm, built_up_area_sqm, land_use_type, has_recent_renovation, renovation_details) VALUES
(1, 'PROP-TN-CHN-001', 'Flat 4B, Shanthi Colony, 4th Avenue, Anna Nagar', 'Chennai', 'Chennai', 'Tamil Nadu', '600040', 13.0850000, 80.2100000, 'RCC_FRAMED', 2018, 2, 120.00, 240.00, 'RESIDENTIAL_INDIVIDUAL', TRUE, 'Ground floor car porch enclosed and added first-floor terrace room (approx 35 sqm).'),
(2, 'PROP-TN-CHN-002', 'Plot 18, 2nd Main Road, Gandhi Nagar, Adyar', 'Chennai', 'Chennai', 'Tamil Nadu', '600020', 13.0067000, 80.2570000, 'RCC_FRAMED', 2016, 1, 160.00, 160.00, 'RESIDENTIAL_INDIVIDUAL', FALSE, NULL),
(3, 'PROP-TN-CBE-003', '74 East Sambandam Road, R.S. Puram', 'Coimbatore', 'Coimbatore', 'Tamil Nadu', '641002', 11.0089000, 76.9510000, 'RCC_FRAMED', 2020, 2, 140.00, 280.00, 'RESIDENTIAL_INDIVIDUAL', FALSE, NULL),
(4, 'PROP-TN-CBE-004', '12 NSR Road, Saibaba Colony', 'Coimbatore', 'Coimbatore', 'Tamil Nadu', '641011', 11.0280000, 76.9420000, 'RCC_FRAMED', 2015, 2, 160.00, 320.00, 'RESIDENTIAL_INDIVIDUAL', TRUE, 'Added modular kitchen extension and solar rooftop pergola.'),
(5, 'PROP-TN-MDU-005', '45 Melur Main Road, K.K. Nagar', 'Madurai', 'Madurai', 'Tamil Nadu', '625020', 9.9252000, 78.1400000, 'LOAD_BEARING', 2012, 1, 150.00, 150.00, 'RESIDENTIAL_INDIVIDUAL', FALSE, NULL),
(6, 'PROP-TN-TRY-006', '28 Shastri Road, Thillai Nagar', 'Tiruchirappalli', 'Tiruchirappalli', 'Tamil Nadu', '620018', 10.8280000, 78.6850000, 'RCC_FRAMED', 2019, 2, 105.00, 210.00, 'RESIDENTIAL_INDIVIDUAL', FALSE, NULL);

-- 3. Policies
INSERT INTO policies (id, policy_number, property_id, policyholder_name, policyholder_email, currency, current_coverage_limit, inception_date, expiry_date, policy_status, workflow_type) VALUES
(1, 'POL-IN-2025-00101', 1, 'M. K. Balasubramanian', 'mkbala@example.in', 'INR', 5000000.00, '2024-03-01', '2025-03-01', 'ACTIVE', 'MIDTERM_REVIEW'),
(2, 'POL-IN-2025-00102', 2, 'Priya Senthil Kumar', 'priya.s@example.in', 'INR', 4500000.00, '2024-01-15', '2025-01-15', 'ACTIVE', 'RENEWAL_WINDOW'),
(3, 'POL-IN-2025-00103', 3, 'K. Vijay Anand', 'vanand@example.in', 'INR', 7500000.00, '2024-06-01', '2025-06-01', 'ACTIVE', 'IN_FORCE'),
(4, 'POL-IN-2025-00104', 4, 'S. Radhakrishnan', 'radhakrishnan.s@example.in', 'INR', 6500000.00, '2024-05-10', '2025-05-10', 'ACTIVE', 'MIDTERM_REVIEW'),
(5, 'POL-IN-2025-00105', 5, 'V. Meenakshi Sundaram', 'vmeena@example.in', 'INR', 3800000.00, '2024-08-01', '2025-08-01', 'ACTIVE', 'IN_FORCE'),
(6, 'POL-IN-2025-00106', 6, 'G. Soundararajan', 'gsoundar@example.in', 'INR', 4800000.00, '2024-04-12', '2025-04-12', 'ACTIVE', 'IN_FORCE');

-- 4. Historical Coverage Snapshots
INSERT INTO coverage_snapshots (id, policy_id, effective_date, coverage_limit, endorsement_number, reason, recorded_at) VALUES
(1, 1, '2024-03-01', 5000000.00, 'END-000-BASE', 'INCEPTION', '2024-03-01 10:00:00'),
(2, 2, '2024-01-15', 4500000.00, 'END-000-BASE', 'INCEPTION', '2024-01-15 11:30:00'),
(3, 3, '2024-06-01', 7500000.00, 'END-000-BASE', 'INCEPTION', '2024-06-01 09:15:00'),
(4, 4, '2024-05-10', 6500000.00, 'END-000-BASE', 'INCEPTION', '2024-05-10 14:00:00'),
(5, 5, '2024-08-01', 3800000.00, 'END-000-BASE', 'INCEPTION', '2024-08-01 10:45:00'),
(6, 6, '2024-04-12', 4800000.00, 'END-000-BASE', 'INCEPTION', '2024-04-12 16:20:00');

-- 5. Rebuilding Cost Estimates
-- Inception estimates vs Current estimates showing inflation
INSERT INTO rebuilding_cost_estimates (id, property_id, estimate_date, estimated_cost, cost_per_sqm, methodology, source_name, provenance_category, is_primary, created_at) VALUES
-- Prop 1: Started at 50L (2024-03), rose to 65L (2024-11) via CPWD 2025 & WPI escalations
(1, 1, '2024-03-01', 5000000.00, 20833.33, 'CPWD_PAR_2024_BASELINE', 'CPWD Plinth Rate Table', 'REAL_PUBLIC_DOCUMENT', FALSE, '2024-03-01 10:00:00'),
(2, 1, '2024-11-01', 6500000.00, 27083.33, 'CPWD_PAR_2025_DERIVED', 'CPWD Plinth Rates 2025 + TN Cost Index', 'REAL_PUBLIC_DOCUMENT', TRUE, '2024-11-01 09:30:00'),
-- Prop 2: Started at 45L, now 60L (Renewal scenario)
(3, 2, '2024-01-15', 4500000.00, 28125.00, 'CPWD_PAR_2024_BASELINE', 'CPWD Plinth Rate Table', 'REAL_PUBLIC_DOCUMENT', FALSE, '2024-01-15 11:30:00'),
(4, 2, '2024-11-01', 6000000.00, 37500.00, 'CPWD_PAR_2025_DERIVED', 'CPWD Plinth Rates 2025 + Services', 'REAL_PUBLIC_DOCUMENT', TRUE, '2024-11-01 09:30:00'),
-- Prop 3: 76L vs 75L coverage (Adequate)
(5, 3, '2024-06-01', 7500000.00, 26785.71, 'CPWD_PAR_2025_DERIVED', 'CPWD Plinth Rates 2025', 'REAL_PUBLIC_DOCUMENT', FALSE, '2024-06-01 09:15:00'),
(6, 3, '2024-11-01', 7600000.00, 27142.85, 'CPWD_PAR_2025_DERIVED', 'CPWD Plinth Rates 2025', 'REAL_PUBLIC_DOCUMENT', TRUE, '2024-11-01 09:30:00'),
-- Prop 4: Conflicting Estimates (Builder 70L vs CPWD 92L) -> Demonstrating Abstention!
(7, 4, '2024-10-15', 7000000.00, 21875.00, 'BUILDER_APPRAISAL', 'Coimbatore Civil Contractors Estimate', 'DERIVED_DATA', TRUE, '2024-10-15 11:00:00'),
(8, 4, '2024-11-05', 9200000.00, 28750.00, 'CPWD_PAR_2025_DERIVED', 'CPWD Plinth Rates 2025', 'REAL_PUBLIC_DOCUMENT', FALSE, '2024-11-05 14:00:00'),
-- Prop 5: 41L (Watch)
(9, 5, '2024-11-01', 4100000.00, 27333.33, 'TN_PWD_SCHEDULE_DERIVED', 'Tamil Nadu PWD Rates 2024', 'REAL_PUBLIC_DOCUMENT', TRUE, '2024-11-01 09:30:00'),
-- Prop 6: 56L (Warning)
(10, 6, '2024-11-01', 5600000.00, 26666.67, 'CPWD_PAR_2025_DERIVED', 'CPWD Plinth Rates 2025', 'REAL_PUBLIC_DOCUMENT', TRUE, '2024-11-01 09:30:00');

-- 6. Evidence Records
INSERT INTO evidence_records (id, property_id, source_id, source_name, source_url, publication_date, retrieval_date, provenance_category, source_reliability_score, freshness_score, completeness_score, raw_payload, is_valid) VALUES
(1, 1, 'CPWD_PAR_2025', 'CPWD Plinth Area Rates 2025 (12th Edition)', 'https://cpwd.gov.in/Publication/PLINTH_AREA_RATES_2025.pdf', '2025-04-01', CURRENT_TIMESTAMP, 'REAL_PUBLIC_DOCUMENT', 95.0, 92.0, 90.0, '{"base_rate_sqm": 23530, "structural_type": "RCC_Framed", "cost_index_multiplier": 1.08}', TRUE),
(2, 1, 'DPIIT_WPI', 'DPIIT WPI Building Materials Index', 'https://eaindustry.nic.in/download_data_2223.asp', '2025-09-14', CURRENT_TIMESTAMP, 'REAL_PUBLIC_DATASET', 90.0, 88.0, 85.0, '{"cement_index": 138.6, "steel_index": 154.2}', TRUE),
(3, 1, 'MOSPI_CPI', 'MoSPI Consumer Price Index (Housing Sector)', 'https://api.mospi.gov.in/api/cpi/getCPIIndex', '2025-10-12', CURRENT_TIMESTAMP, 'REAL_PUBLIC_API', 92.0, 90.0, 85.0, '{"sector": "Urban", "cpi_general": 192.4, "inflation": 5.12}', TRUE),
(4, 2, 'CPWD_PAR_2025', 'CPWD Plinth Area Rates 2025', 'https://cpwd.gov.in/Publication/PLINTH_AREA_RATES_2025.pdf', '2025-04-01', CURRENT_TIMESTAMP, 'REAL_PUBLIC_DOCUMENT', 95.0, 90.0, 88.0, '{"base_rate_sqm": 23530}', TRUE),
(5, 4, 'BUILDER_APPRAISAL', 'Private Contractor Valuation Memo', 'https://example.in/contractors', '2024-10-15', CURRENT_TIMESTAMP, 'DERIVED_DATA', 65.0, 80.0, 70.0, '{"total_quote": 7000000, "contractor": "Local Trade Association"}', TRUE),
(6, 4, 'CPWD_PAR_2025', 'CPWD Plinth Area Rates 2025', 'https://cpwd.gov.in/Publication/PLINTH_AREA_RATES_2025.pdf', '2025-04-01', CURRENT_TIMESTAMP, 'REAL_PUBLIC_DOCUMENT', 95.0, 90.0, 90.0, '{"base_rate_sqm": 23530, "built_up_sqm": 320}', TRUE);

-- 7. Monitoring Evaluations (Historical snapshots showing drift!)
INSERT INTO monitoring_evaluations (id, policy_id, evaluation_timestamp, trigger_type, dwelling_coverage, rebuilding_cost, itv_ratio, potential_coverage_gap, itv_drift, itv_classification, confidence_score, confidence_category, abstention_triggered, abstention_reasons, recommendation_text) VALUES
-- Policy 1: Initial evaluation at inception (100% ITV)
(1, 1, '2024-03-01 10:00:00', 'SCHEDULED_DAILY', 5000000.00, 5000000.00, 100.00, 0.00, 0.00, 'ADEQUATE', 90.50, 'HIGH', FALSE, NULL, 'Coverage is adequate based on inception baseline.'),
-- Policy 1: Midterm drift evaluation (ITV 76.92%, Drift -23.08%, CRITICAL)
(2, 1, '2024-11-01 02:00:00', 'SCHEDULED_DAILY', 5000000.00, 6500000.00, 76.92, 1500000.00, -23.08, 'CRITICAL', 88.75, 'HIGH', FALSE, NULL, 'Critical underinsurance detected. Rebuilding cost increased to ₹65,00,000 while coverage remains ₹50,00,000. Underwriter review required.'),
-- Policy 2: Renewal window evaluation (ITV 75.00%, CRITICAL)
(3, 2, '2024-11-01 02:00:00', 'SCHEDULED_DAILY', 4500000.00, 6000000.00, 75.00, 1500000.00, -25.00, 'CRITICAL', 89.20, 'HIGH', FALSE, NULL, 'Policy approaching renewal in 45 days with a ₹15,00,000 coverage deficit. Propose renewal limit of ₹57,00,000 (95% ITV).'),
-- Policy 3: Adequate (ITV 98.68%)
(4, 3, '2024-11-01 02:00:00', 'SCHEDULED_DAILY', 7500000.00, 7600000.00, 98.68, 100000.00, -1.32, 'ADEQUATE', 91.00, 'HIGH', FALSE, NULL, 'Coverage remains adequate within acceptable 95%+ threshold.'),
-- Policy 4: Conflicting Evidence -> ABSTENTION TRIGGERED!
(5, 4, '2024-11-05 02:00:00', 'EVENT_DRIVEN', 6500000.00, 7000000.00, 92.86, 500000.00, -7.14, 'WATCH', 58.40, 'LOW', TRUE, 'Hard Abstention Triggered: Independent estimates diverge by 31.43% (Builder ₹70L vs CPWD ₹92L), exceeding the 20% tolerance threshold. Recommending physical field engineering inspection.', 'ABSTAIN: Cannot recommend coverage modification due to material evidence contradiction. Dispatched evidence verification task.'),
-- Policy 5: Watch (ITV 92.68%)
(6, 5, '2024-11-01 02:00:00', 'SCHEDULED_DAILY', 3800000.00, 4100000.00, 92.68, 300000.00, -7.32, 'WATCH', 82.50, 'HIGH', FALSE, NULL, 'Policy in Watch status (ITV 92.68%). Monitor at next scheduled run.'),
-- Policy 6: Warning (ITV 85.71%)
(7, 6, '2024-11-01 02:00:00', 'SCHEDULED_DAILY', 4800000.00, 5600000.00, 85.71, 800000.00, -14.29, 'WARNING', 86.10, 'HIGH', FALSE, NULL, 'Policy in Warning category. Coverage gap of ₹8,00,000 detected.');

-- 8. Review Cases
INSERT INTO review_cases (id, case_number, policy_id, case_type, status, assigned_underwriter_id, current_itv_ratio, coverage_gap, created_at, resolved_at) VALUES
(1, 'CASE-2024-00101', 1, 'MIDTERM_UNDERINSURANCE', 'OPEN', 2, 76.92, 1500000.00, '2024-11-01 02:05:00', NULL),
(2, 'CASE-2024-00102', 2, 'RENEWAL_UNDERINSURANCE', 'UNDER_REVIEW', 2, 75.00, 1500000.00, '2024-11-01 02:05:00', NULL),
(3, 'CASE-2024-00104', 4, 'EVIDENCE_VERIFICATION', 'EVIDENCE_REQUESTED', 3, 92.86, 500000.00, '2024-11-05 02:05:00', NULL),
(4, 'CASE-2024-00106', 6, 'MIDTERM_UNDERINSURANCE', 'OPEN', 2, 85.71, 800000.00, '2024-11-01 02:05:00', NULL);

-- 9. Integration Configurations
INSERT INTO integration_configs (id, source_id, source_name, source_type, base_url, status, last_sync_at, record_count, error_message, provenance_category) VALUES
(1, 'MOSPI_CPI', 'MoSPI Consumer Price Index API', 'REST_API', 'https://api.mospi.gov.in/api/cpi/getCPIIndex', 'ACTIVE', CURRENT_TIMESTAMP, 48, NULL, 'REAL_PUBLIC_API'),
(2, 'DPIIT_WPI', 'DPIIT Wholesale Price Index (Materials)', 'DATASET_IMPORT', 'https://eaindustry.nic.in/download_data_2223.asp', 'ACTIVE', CURRENT_TIMESTAMP, 120, NULL, 'REAL_PUBLIC_DATASET'),
(3, 'CPWD_PAR_2025', 'CPWD Plinth Area Rates 2025', 'DOCUMENT_EXTRACT', 'https://cpwd.gov.in/Publication/PLINTH_AREA_RATES_2025.pdf', 'ACTIVE', CURRENT_TIMESTAMP, 36, NULL, 'REAL_PUBLIC_DOCUMENT'),
(4, 'GOBS_AEEE', 'Geospatial Open Building Stack (GOBS)', 'BULK_CSV', 'https://gobs.aeee.in/get-data', 'ACTIVE', CURRENT_TIMESTAMP, 15200, NULL, 'REAL_PUBLIC_DATASET'),
(5, 'TN_PWD_SOR', 'Tamil Nadu PWD Schedule of Rates', 'DOCUMENT_EXTRACT', 'https://tnpwdea.org/downloads.php?category_id=4', 'ACTIVE', CURRENT_TIMESTAMP, 64, NULL, 'REAL_PUBLIC_DOCUMENT');

-- 10. Audit Logs
INSERT INTO audit_logs (id, timestamp, username, action, entity_type, entity_id, details) VALUES
(1, '2024-03-01 10:00:00', 'SYSTEM_MONITOR', 'POLICY_BOUND', 'POLICY', 'POL-IN-2025-00101', 'Initial policy bound with dwelling coverage limit ₹50,00,000.'),
(2, '2024-11-01 02:00:00', 'SYSTEM_MONITOR', 'SCHEDULED_MONITORING', 'EVALUATION', '2', 'Continuous monitoring executed. Deterioration detected on POL-IN-2025-00101 (ITV: 76.92%, Drift: -23.08%).'),
(3, '2024-11-01 02:05:00', 'SYSTEM_MONITOR', 'CASE_CREATED', 'CASE', 'CASE-2024-00101', 'Review case generated for critical underinsurance shortfall ₹15,00,000.'),
(4, '2024-11-05 02:05:00', 'SYSTEM_MONITOR', 'ABSTENTION_TRIGGERED', 'EVALUATION', '5', 'Hard Abstention executed on POL-IN-2025-00104 due to 31.43% estimate contradiction. Verification task generated.');

