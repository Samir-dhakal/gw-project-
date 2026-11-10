# Engineering Implementation Log

### Entry 001 — Phase 0: Research, Planning & Architecture Specification
- Inspected workspace environment: Microsoft JDK 21 LTS, Apache Maven 3.9.11, Node.js v24.11.0, npm 11.6.1, Git 2.51.2.
- Verified Indian public datasets: MoSPI CPI API (`api.mospi.gov.in`), DPIIT WPI 2022-23 base series (`eaindustry.nic.in`), CPWD Plinth Area Rates 2025 (Publication No. 12, ₹23,530/sqm base), and AEEE Geospatial Open Building Stack (GOBS).
- Authored foundation documentation: `README.md`, `ARCHITECTURE.md`, `NOVELTY_AND_DIFFERENTIATION.md`, `DATA_SOURCES.md`, `DATA_DICTIONARY.md`, `ER_DIAGRAM.md`, `PROJECT_DECISIONS.md`, `DATA_QUALITY_REPORT.md`, `API_INTEGRATION_REPORT.md`, `TEST_REPORT.md`, `DEMO_GUIDE.md`, and `LIMITATIONS_AND_FUTURE_WORK.md`.

### Entry 002 — Phase 1 & 2: Backend Maven Foundation & Public Data Ingestion
- Configured `backend/pom.xml` with Spring Boot 3.3.5, Spring Web, Data JPA, Security, Validation, MySQL Connector, H2, Flyway MySQL, JJWT 0.12.6, and Springdoc OpenAPI.
- Authored Flyway database migrations:
  - `V1__init_schema.sql`: 12 normalized tables with strict foreign keys and indexed columns.
  - `V2__seed_demo_data.sql`: Seeded users, properties (Tamil Nadu residential), policies, historical snapshots, rebuilding estimates, evidence records, and review cases.
- Ingested verified public data files into `data/`:
  - `cpwd_plinth_rates_2025.json`
  - `dpiit_wpi_construction_materials.csv`
  - `mospi_cpi_housing_index.json`
  - `gobs_tamilnadu_sample.csv`

### Entry 003 — Phase 3 to 13: Core Backend Intelligence & Workflows
- Built 12 JPA Entities matching Flyway schema with temporal immutability for snapshots.
- Built Spring Data JPA Repositories with custom queries for drift calculation, active portfolio gap aggregation, and renewal horizon detection.
- Built DTO transfer models and `GlobalExceptionHandler` with standardized JSON error formatting.
- Implemented `ItvEngineService` for core business math: ITV Ratio, Coverage Gap, ITV Drift, and Classification thresholds.
- Implemented `EvidenceConfidenceService` for heuristic confidence formula $C = 0.30S + 0.25F + 0.20K + 0.25A$ and strict **Hard Abstention Rules** (divergence $> 20\%$, staleness $> 365$ days, missing attributes).
- Implemented `ContinuousMonitoringService` supporting Daily Scheduled (`@Scheduled`), Event-Driven, and Manual reassessment triggers.
- Implemented `ScenarioSimulatorService` for functional coverage limit projections (80%, 90%, 95%, 100%, and custom limits) enforcing strict **zero policy mutation**.
- Implemented `ReviewCaseService` governing separate Midterm Endorsement and Renewal review workflows with human underwriter decision sign-off.
- Implemented `PortfolioAnalyticsService` computing live database KPIs and resolution rates.
- Implemented `AuditLogService` logging immutable operational audit records.
- Implemented REST API Controllers: `AuthController`, `PolicyController`, `MonitoringController`, `EvidenceController`, `ScenarioController`, `WorkflowController`, `AnalyticsController`, `IntegrationController`, and `AuditController`.

### Entry 004 — Phase 14 & 15: Frontend & Automated Testing
- Initialized React 18 + TypeScript + Vite + Tailwind CSS frontend with Lucide icons and Recharts.
- Implemented full suite of 18 enterprise insurance screens:
  1. `LoginPage.tsx` (with one-click demo role switchers)
  2. `ExecutiveDashboardPage.tsx` (live KPI cards, classification charts, critical policy table)
  3. `PolicyPortfolioPage.tsx` (search, status filters, classification filters, sorting)
  4. `PolicyDetailPage.tsx` (full property specs, historical snapshot ledger, drift line chart)
  5. `PropertyIntelligencePage.tsx` (Tamil Nadu property typology, footprints, built-up areas)
  6. `DataIntegrationCentrePage.tsx` (MoSPI, DPIIT, CPWD, GOBS sync controls and status)
  7. `MonitoringCentrePage.tsx` (scheduled, event-driven, manual trigger console & history)
  8. `ItvDriftAnalysisPage.tsx` (trajectory charts highlighting Scenario A gradual drift)
  9. `EvidenceIntelligencePage.tsx` (provenance inspection, scores, raw JSON payloads)
  10. `ConfidenceAbstentionPage.tsx` (4-component breakdown highlighting Scenario B hard abstention)
  11. `RecommendationCentrePage.tsx` (explainable underwriter action guidance)
  12. `ScenarioSimulatorPage.tsx` (interactive projection table and financial comparison bar chart)
  13. `UnderwriterWorkspacePage.tsx` (case queue, decision modals, endorsement approvals, Scenario C)
  14. `MidtermManagementPage.tsx` (active in-force endorsement queue)
  15. `RenewalManagementPage.tsx` (30/60/90 day renewal horizon management)
  16. `AuditHistoryPage.tsx` (system-wide chronological audit trail)
  17. `PortfolioAnalyticsPage.tsx` (portfolio health distribution and underwriter resolution rate)
  18. `AdministrationPage.tsx` (RBAC accounts, runtime status, and scheduler parameters)
- Executed JUnit 5 and Spring Boot integration tests:
  - `ItvEngineTest`: 6 tests passing.
  - `ConfidenceEngineTest`: 4 tests passing.
  - `PolicySafetyTest`: 2 tests passing (verified zero-mutation safety invariant).
  - Total: 12 tests run, 0 failures, 0 errors.
- Executed Vite production build: `npm run build` completed with zero TypeScript errors.
- Created `start_all.bat`, `docker-compose.yml`, Dockerfiles, `.env.example`, and Postman API collection.

### Entry 005 — Live Runtime Verification & Scenario Validation
- Packaged executable Spring Boot production archive `target/itv-intelligence-engine-1.0.0-SNAPSHOT.jar`.
- Resolved H2 2.2.x Flyway read-only compatibility by pruning `;AUTO_SERVER=TRUE` from the local dev JDBC URL.
- Launched backend microservice on `http://localhost:8080` (PID 25556); Flyway automatically migrated 2 schema versions and seeded demo records into H2 embedded database.
- Launched Vite frontend development server on `http://localhost:5173`.
- Verified live end-to-end integration:
  - **Authentication:** `POST /api/v1/auth/login` successfully returned JWT token and session claims for underwriter credentials.
  - **Scenario A (ITV Drift):** Querying `POL-IN-2025-00101` verified Coverage: ₹50,00,000, Rebuilding Cost: ₹65,00,000, ITV: 76.92%, Coverage Gap: ₹15,00,000, Drift: -23.08%, Status: CRITICAL, Confidence: 88.75% (HIGH).
  - **Scenario B (Hard Abstention):** Querying `POL-IN-2025-00104` verified abstention triggered due to 31.43% divergence between builder invoice (₹70L) and CPWD estimate (₹92L), exceeding the 20% tolerance, with Staleness at 756 days.
  - **Scenario C (Renewal Decision & Audit):** Approved endorsement for Case 2 (`CASE-2024-00102`), updating policy coverage from ₹45,00,000 to ₹60,00,000, transitioning case status to `RESOLVED`, and recording immutable audit log entry #5.
  - **Scenario Simulation:** Verified read-only projections for 80%, 90%, 95%, 100%, and custom limits with zero database mutation on policy coverage.
  - **OpenAPI / Swagger:** Verified `GET /v3/api-docs` returning HTTP 200 with 19 documented API paths.
  - **Frontend Live:** Verified HTTP 200 response on `http://localhost:5173` serving the Single Page Application.
