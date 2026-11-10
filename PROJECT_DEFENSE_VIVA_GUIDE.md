# Comprehensive Project Defense & Viva Voce Guide
## Continuous Insurance-to-Value (ITV) Intelligence Engine
**Academic Program:** B.Tech Computer Science & Engineering — Final Year Capstone Project  
**Domain / Industry Elective:** Guidewire Insurance Platform & Enterprise Software Engineering  
**Target Geography:** India (Tamil Nadu Case Study: Chennai, Coimbatore, Madurai, Tiruchirappalli)  
**Currency:** Indian Rupee (₹, INR)

---

## SECTION 1: ARCHITECTURAL & STRATEGIC POSITIONING (THE "WHY")

### Q1. What is the core problem your system solves, and why is it critical for Property & Casualty (P&C) insurers?
**Answer:**  
In homeowners (dwelling) insurance, a policy is bound with a specific Dwelling Coverage Limit based on the property's estimated replacement/rebuilding cost at that moment. Over time, however, building materials (cement, structural steel, sand), labour wage rates, municipal plinth rates, and unnotified residential renovations drive up the actual rebuilding cost. 

Because traditional core insurance systems treat policy limits as static until manual renewal (or worse, until a total-loss catastrophe occurs), the **Insurance-to-Value (ITV) ratio**—defined as $(\text{Dwelling Coverage Limit} / \text{Rebuilding Cost}) \times 100$—silently deteriorates. 

When a policy's ITV ratio drops below 80% (the coinsurance threshold), the policyholder faces substantial out-of-pocket loss under the Average Clause / Coinsurance Clause, while the insurer faces under-collected premium, reputational erosion, and severe regulatory scrutiny. Our system provides **continuous, evidence-aware in-force monitoring and explainable resolution** to detect, quantify, and rectify this coverage gap before claims arise.

---

### Q2. Does your system replace or compete with Guidewire HazardHub or Guidewire PolicyCenter?
**Answer:**  
**Emphatically No.** It is crucial to clarify the architectural boundary:
1. **Guidewire PolicyCenter** is the System of Record (SoR) for policy lifecycles, underwriting rules, and policy contracts.
2. **Guidewire HazardHub** is a premier geospatial risk assessment and property intelligence platform that provides catastrophic peril risk scores (flood, wildfire, storm surge) and replacement cost benchmarks.
3. **Our System's Novelty:** We do not invent a proprietary actuarial property valuation algorithm or replace HazardHub. Rather, our system implements an **in-force continuous monitoring and evidence-reliability governance layer** that sits between core policy administration and external intelligence sources. It:
   - Tracks the **temporal drift** of ITV over time across the entire active portfolio.
   - Evaluates whether external estimates (from HazardHub, CPWD, MoSPI, or builder invoices) are fresh, complete, and mutually corroborating.
   - Formulates explainable resolution scenarios (80%, 90%, 95%, 100%).
   - Preserves human underwriter authority by preparing decision-ready review workflows with an immutable audit trail.

---

### Q3. Why did you choose India (Tamil Nadu) as the target geography instead of the US or UK?
**Answer:**  
1. **Public Data Availability & Grounding:** Rather than using abstract or synthetic US zip codes, we grounded our research in genuine, publicly accessible Indian economic and engineering benchmarks:
   - **CPWD (Central Public Works Department) Plinth Area Rates 2025** (Govt. of India), incorporating Tamil Nadu regional cost indices (Chennai: 1.08, Coimbatore: 1.04, Madurai: 1.02, Tiruchirappalli: 1.01).
   - **MoSPI (Ministry of Statistics & Programme Implementation) CPI Housing Index** for urban dwelling inflation.
   - **DPIIT (Department for Promotion of Industry and Internal Trade) Wholesale Price Index (WPI)** tracking cement and steel inflation.
   - **AEEE Geospatial Open Building Stack (GOBS)** for physical structural footprints.
2. **Market Relevance:** Underinsurance in urban Indian residential properties is an acute, under-addressed challenge due to rapid urbanization, localized construction cost surges, and multi-tier contractor variations. Demonstrating this on Chennai and Coimbatore addresses real-world industrial needs.

---

## SECTION 2: MATHEMATICAL & HEURISTIC FORMULATIONS (THE "HOW")

### Q4. Walk us through the mathematical calculations in your engine.
**Answer:**  
Our system enforces three deterministic calculations executed in the backend (`ItvEngineService`):

1. **ITV Ratio ($R_{\text{ITV}}$):**
   $$R_{\text{ITV}} = \left(\frac{C_{\text{dwelling}}}{E_{\text{rebuilding}}}\right) \times 100$$
   *Validation:* Both $C_{\text{dwelling}} > 0$ and $E_{\text{rebuilding}} > 0$; currencies must match (INR ₹).

2. **Potential Coverage Gap ($G_{\text{coverage}}$):**
   $$G_{\text{coverage}} = \max\left(0, E_{\text{rebuilding}} - C_{\text{dwelling}}\right)$$
   *Semantics:* If coverage exceeds rebuilding cost, the gap is ₹0 (not negative).

3. **ITV Drift ($\Delta_{\text{ITV}}$):**
   $$\Delta_{\text{ITV}} = R_{\text{ITV, current}} - R_{\text{ITV, baseline}}$$
   *Semantics:* A negative value indicates deterioration (e.g., $-23.08\%$ in Scenario A).

4. **Classification Thresholds (Configurable Heuristic Tiers):**
   - **ADEQUATE:** $R_{\text{ITV}} \ge 95\%$
   - **WATCH:** $90\% \le R_{\text{ITV}} < 95\%$
   - **WARNING:** $80\% \le R_{\text{ITV}} < 90\%$
   - **CRITICAL:** $R_{\text{ITV}} < 80\%$ (coinsurance risk triggered)

---

### Q5. Explain the Evidence Confidence Score formula and how the component weights were chosen.
**Answer:**  
The prototype confidence score is calculated in `EvidenceConfidenceService`:
$$C = (0.30 \times S) + (0.25 \times F) + (0.20 \times K) + (0.25 \times A)$$

Where each component is normalized to $[0, 100]$:
1. **Source Reliability ($S$, 30%):** Evaluates the institutional credibility of the data origin. Government schedule of rates (CPWD, PWD) receive 95–100; licensed engineering surveyor reports receive 85–90; contractor invoices receive 75–80; unverified crowdsourced or algorithmic estimates receive 50–60.
2. **Freshness ($F$, 25%):** Penalizes stale evidence using a linear temporal decay function:
   $$F = \max\left(0, 100 - \left(\frac{\text{Age in Days}}{\text{Max Validity Window}}\right) \times 100\right)$$
   For our 365-day validity window, an estimate that is 180 days old scores 50.68, while an estimate $>365$ days old scores 0.
3. **Completeness ($K$, 20%):** Evaluates the presence of essential structural parameters: built-up plinth area, structural typology (RCC framed vs. load bearing), storey count, construction year, and regional cost multiplier.
4. **Agreement ($A$, 25%):** Evaluates mutual corroboration between two or more independent estimates:
   $$D = \frac{|E_1 - E_2|}{\min(E_1, E_2)} \times 100$$
   $$A = \max\left(0, 100 - (D \times 2)\right)$$

*Important Reviewer Defense:* We do not claim this formula is an actuarially calibrated Bayesian probability. It is an explainable multi-criteria prototype heuristic designed to prevent blind automated reliance on unverified third-party numbers.

---

### Q6. What is "Explainable Abstention" and what conditions trigger a Hard Abstention?
**Answer:**  
In enterprise financial and insurance systems, knowing **when not to decide** is just as critical as computing a number. If an automated system recommends an insurance limit increase based on conflicting or corrupt evidence, the insurer faces legal liability and customer disputes.

**Hard Abstention Invariant:** Even if the mathematical confidence score $C \ge 80$, the system must **immediately abstain** from issuing an actionable recommendation if any of the following non-negotiable failure conditions occur:
1. **Material Contradiction / Divergence $> 20\%$:** When independent replacement cost estimates differ by more than 20% (demonstrated in Scenario B: Builder Invoice ₹70L vs. CPWD Plinth Estimate ₹92L = 31.43% divergence).
2. **Evidence Staleness Exceeding Window:** When primary evidence is older than 365 days (Policy 4 evidence is 756 days old).
3. **Missing Critical Structural Attributes:** Missing plinth area, zero storey count, or unverified construction type.
4. **Unverifiable Source Provenance:** Estimates lacking cryptographic checksum, API source origin, or surveyor identity.

When hard abstention triggers, the system:
- Flags `abstentionTriggered = true`.
- Categorizes confidence as `LOW`.
- Enumerates the exact natural-language failure reasons.
- Generates a **Verification Request** (e.g., "Dispatch field engineering inspection to verify physical plinth dimensions") instead of an unverified policy alteration.

---

## SECTION 3: BACKEND SOFTWARE ENGINEERING & ARCHITECTURE

### Q7. Walk us through your database schema design and normalization.
**Answer:**  
The relational database consists of **12 normalized entities** adhering to Third Normal Form (3NF) managed by Flyway migrations (`V1__init_schema.sql` and `V2__seed_demo_data.sql`):
1. `users`: System users with BCrypt credentials and role-based access control (`ADMIN`, `UNDERWRITER`, `REVIEWER`, `VIEWER`).
2. `properties`: Physical residential real-estate assets (address, city, state, plinth area sqm, storeys, year built, structural type).
3. `policies`: Legal insurance contracts binding a policyholder to a property with current dwelling limits and active dates.
4. `coverage_snapshots`: **Temporally immutable ledger** storing every coverage limit and rebuilding cost estimate at each snapshot date.
5. `rebuilding_cost_estimates`: Multiple replacement cost valuations from different sources for the same property over time.
6. `evidence_records`: Provenance metadata, raw JSON payloads, and validation status for each ingested data source.
7. `monitoring_evaluations`: Complete audit records of every evaluation run (ITV ratio, drift, gap, confidence score, abstention flag).
8. `review_cases`: Underwriting review case management queue (`OPEN`, `UNDER_REVIEW`, `EVIDENCE_REQUESTED`, `RESOLVED`).
9. `underwriter_decisions`: Formally recorded human underwriter actions (`APPROVE_ENDORSEMENT`, `REJECT_CHANGE`, `ESCALATE`, `REQUEST_FIELD_INSPECTION`).
10. `audit_logs`: Append-only, tamper-evident security and operational audit trail.
11. `coverage_scenarios`: Read-only financial scenario projections (80%, 90%, 95%, 100%, custom).
12. `integration_configs`: External data source sync registry (MoSPI, DPIIT, CPWD, GOBS, TN PWD).

---

### Q8. What is the "Temporal Immutability Pattern" in your `coverage_snapshots` table and why is it important?
**Answer:**  
A common architectural flaw in naive systems is updating the existing policy row when new estimates arrive (`UPDATE policies SET coverage_limit = ...`). This destroys the historical time series.

In our architecture:
- Historical snapshots are **immutable** (`INSERT`-only).
- Every reassessment or endorsement appends a new record to `coverage_snapshots` with an incremented version number, effective timestamp, and provenance metadata.
- This allows our `ItvEngineService` to calculate true historical trajectory and drift:
  $$\Delta_{\text{ITV}} = R_{\text{ITV, current}} - R_{\text{ITV, baseline}}$$
- It provides non-repudiation during claims litigation: the insurer can prove exactly what the property's estimated replacement cost and dwelling limit were on any historical calendar date.

---

### Q9. How do you guarantee the "Zero Policy Mutation" invariant in the Scenario Simulator?
**Answer:**  
In insurance software, simulating "what-if" financial options must never accidentally corrupt active in-force policy contracts.
We enforce this across three architectural layers:
1. **Service Layer Design (`ScenarioSimulatorService`):** The service takes a policy ID and optional custom limit, reads the baseline from the database, executes financial projections purely in memory, and returns a `ScenarioProjectionDto`. No JPA `.save()`, `.merge()`, or database write operations are invoked.
2. **Database Integrity:** Foreign keys and state machines prevent unapproved state transitions; only formal underwriter decisions through `ReviewCaseService.recordDecision()` can emit an endorsement.
3. **Automated Integration Test Verification:** In `PolicySafetyTest.java`, test method `testZeroMutationScenarioSimulation()` asserts that after executing multiple simulation projections, the in-force policy's `coverageLimit`, `updatedAt`, and version fields remain 100% identical.

---

### Q10. Explain the Dual-Database Strategy (H2 in MySQL mode vs. MySQL 8).
**Answer:**  
- **Development & Demonstration Profile (`dev`):** Uses an embedded H2 file-backed database (`jdbc:h2:file:./data/itv_dev_db`) configured with `MODE=MySQL`, `DATABASE_TO_LOWER=TRUE`, and `CASE_INSENSITIVE_IDENTIFIERS=TRUE`. This ensures **zero setup friction**—an evaluator can clone the repo and run the system on any laptop without installing or starting a local MySQL server daemon.
- **Production Profile (`mysql`):** Uses standard MySQL 8 with connection pooling (HikariCP) and environment variable injection (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
- **Flyway Database Migrations:** Both profiles share the exact same idempotent SQL scripts (`V1__init_schema.sql` and `V2__seed_demo_data.sql`), guaranteeing schema fidelity across environments.

---

### Q11. How does your JWT Authentication and Security architecture work?
**Answer:**  
- **Stateless Architecture:** Standard Spring Security with session creation policy set to `STATELESS`. No server-side HTTP session state is stored.
- **Token Generation:** Upon successful authentication (`POST /api/v1/auth/login`), `JwtUtil` constructs an HMAC-SHA256 signed JWT containing the username, full name, role, issued-at timestamp, and 24-hour expiration.
- **Request Filter:** `JwtAuthenticationFilter` intercepts incoming HTTP requests, extracts the `Bearer <token>` from the `Authorization` header, cryptographically verifies the signature, extracts claims, and populates the `SecurityContextHolder`.
- **Role-Based Method Security:** Sensitive endpoints use `@PreAuthorize("hasAnyRole('ADMIN', 'UNDERWRITER')")` to restrict decision-making and assignment operations.

---

## SECTION 4: FRONTEND ENGINEERING & HUMAN-IN-THE-LOOP DESIGN

### Q12. Why did you include a Human-in-the-Loop Underwriter Workspace instead of automatically adjusting policies?
**Answer:**  
Under insurance regulations (such as IRDAI in India or state insurance commissions in the US), an insurer **cannot unilaterally modify an in-force legal contract or increase policyholder premiums without informed consent and authorized underwriting review**.

Automated adjustment introduces severe risks:
- False positives caused by temporary material price spikes.
- Dispute liability with policyholders.
- Misclassification of property upgrades vs. routine maintenance.

Therefore, our system positions AI and automation as **Decision Support**, not autonomous contract alteration:
- The system continuously calculates, correlates, and alerts.
- When reliable underinsurance is detected, it prepares a structured `ReviewCase` with side-by-side scenario projections.
- An authorized underwriter reviews the evidence, selects an action (`APPROVE_ENDORSEMENT`, `REQUEST_FIELD_INSPECTION`, `REJECT_CHANGE`, `ESCALATE`), inputs decision notes, and signs off.
- The approval transitions the case to `RESOLVED` and records an immutable entry in `audit_logs`.

---

### Q13. Describe the frontend architecture and key user experience decisions.
**Answer:**  
- **Modern Single Page Application (SPA):** Built with React 18, TypeScript for strict compile-time type safety, and Vite for fast development and optimized production bundling.
- **Styling & Visual Design:** Styled with Tailwind CSS 3 following an enterprise Guidewire/Fintech design language (slate neutral palettes, distinct badge tiers for ITV classifications and confidence categories).
- **Interactive Visualizations:** Built with Recharts 2 to display:
  - Historical ITV trajectory line charts with horizontal reference lines at the 80% coinsurance threshold and 95% adequate threshold.
  - Multi-tier scenario comparison bar charts (Coverage Limit vs. Remaining Gap).
  - Portfolio health distribution pie and bar charts.
- **18 Functional Screens:** Covers every operational persona from Executive Dashboard to Data Integration sync controls, Policy Portfolio, Underwriter Workspace, Renewal Horizon Management, and Audit History.

---

## SECTION 5: LIVE DEMO SCENARIO CHEAT-SHEET FOR PRESENTATION

| Scenario | Policy ID | City | Key Problem / Dynamic | System Finding | Outcome & Takeaway |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Scenario A** | `POL-IN-2025-00101` | Chennai | Cost increased from ₹50L to ₹65L due to inflation; coverage static at ₹50L. | **ITV: 76.92%**<br>Drift: $-23.08\%$<br>Status: `CRITICAL`<br>Confidence: 88.75 (`HIGH`) | System accurately flags high-confidence underinsurance and recommends underwriter review to close the ₹15L gap. |
| **Scenario B** | `POL-IN-2025-00104` | Coimbatore | Builder invoice (₹70L, 756 days old) conflicts with CPWD estimate (₹92L). | **Divergence: 31.43%**<br>Confidence: 58.40 (`LOW`)<br>**Abstention: TRUE** | System refuses to generate a blind recommendation; creates an evidence verification / inspection request instead. |
| **Scenario C** | `POL-IN-2025-00102` | Chennai | Policy approaching renewal; in-force limit ₹45L vs. ₹60L cost (ITV 75%). | Underwriter reviews Scenario Simulator options; selects 100% tier (₹60L). | Underwriter signs off; case transitions to `RESOLVED`; immutable audit log #5 recorded. |

---

## SECTION 6: QUICK-FIRE TECHNICAL DEFINITIONS

- **Insurance-to-Value (ITV):** Ratio of dwelling coverage limit to property rebuilding cost estimate, expressed as a percentage.
- **Coinsurance / Average Clause:** Policy condition requiring a minimum percentage of coverage (typically 80%); failing to meet it reduces claim payouts proportionally.
- **ITV Drift:** The rate and direction of change in the ITV ratio over time ($\Delta_{\text{ITV}}$).
- **Plinth Area:** The built-up covered area measured at the floor level of any storey of a building.
- **Hard Abstention:** An architectural safeguard where the system explicitly declines to make a recommendation due to violated data integrity or conflicting evidence invariants.
- **Zero Policy Mutation:** Architectural guarantee that exploratory simulations execute strictly in-memory without altering stored policy records.
- **Temporal Immutability:** Append-only ledger pattern where historical state is never overwritten, enabling retrospective auditability.
