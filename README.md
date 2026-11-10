# Continuous Insurance-to-Value (ITV) Intelligence Engine

**Subtitle:** An Evidence-Aware, Explainable In-Force Monitoring and Underinsurance Resolution System for Homeowners Insurance  
**Target Geography:** India (Demonstration Region: Tamil Nadu — Chennai, Coimbatore, Madurai, Tiruchirappalli)  
**Currencies:** Indian Rupee (INR / ₹)  
**Academic / Industry Project:** Guidewire Industry-Elective Final-Year Capstone Project (B.Tech Computer Science)

---

## 1. Executive Summary

Homeowners insurance policies establish a dwelling coverage limit at policy inception or renewal. Over time, however, building replacement costs escalate due to inflation in construction materials (cement, structural steel, sand, aggregates), labor wage revisions, municipal guideline value updates, aging structural components, and unnotified renovations. When dwelling coverage limits stay static while rebuilding costs increase, **Insurance-to-Value (ITV) deterioration** occurs, resulting in severe underinsurance gaps.

Traditional insurance workflows suffer from two structural shortcomings:
1. **Periodic Point-in-Time Review:** Insurers typically review coverage adequacy only at annual renewal or after a catastrophic loss claim, leaving in-force policies exposed to unmonitored drift for months.
2. **Blind Valuation Trust vs. Opaque Models:** Systems either blindly accept third-party replacement cost calculators without provenance checks or rely on black-box valuation algorithms without explainability or uncertainty bounds.

### Our Solution
The **Continuous Insurance-to-Value Intelligence Engine** addresses these gaps through an integrated, evidence-aware, explainable in-force monitoring and resolution architecture:
- **Continuous In-Force Monitoring:** Real-time event-driven and scheduled daily re-evaluations tracking policy coverage against multi-source rebuilding cost estimates, persisting full historical snapshots and computing metric drift ($ITV_{t} - ITV_{t-1}$).
- **Evidence Reliability Intelligence & Hard Abstention:** Explicit evaluation of external data source reliability ($S$), freshness ($F$), property data completeness ($K$), and multi-estimate agreement ($A$). When evidence is stale, conflicting, or incomplete, the engine executes **Hard Abstention**, generating transparent verification tasks rather than unfounded policy adjustments.
- **Explainable Decision Support & Resolution:** Underwriters are provided with explainable coverage gap breakdowns, interactive scenario simulations (80%, 90%, 95%, 100%, and custom rebuilding cost ratios), distinct midterm endorsement vs. renewal workflows, and human-in-the-loop approval logs ensuring no automated policy tampering occurs.

---

## 2. Distinction from Guidewire Core & HazardHub

| Capability Dimension | Guidewire PolicyCenter / HazardHub | Continuous ITV Intelligence Engine (Our System) |
| :--- | :--- | :--- |
| **Primary Focus** | Policy lifecycle admin, underwriting risk scoring, hazard risk lookups | Post-bind continuous in-force coverage adequacy monitoring |
| **Valuation Approach** | Relies on external replacement cost integrations (e.g., CoreLogic, 360Value) | Multi-source evidence aggregation with explicit agreement/disagreement scoring |
| **Uncertainty & Abstention** | Typically returns a single estimate value or vendor score | Explains confidence components ($S, F, K, A$) and executes hard abstention when sources diverge |
| **Workflow State Machine** | Standard policy renewal/endorsement lifecycle | Distinct evidence verification, midterm endorsement, and renewal mitigation workflows |
| **Transparency & Provenance** | Proprietary algorithms | Open data provenance tagging (`REAL_PUBLIC_API`, `REAL_PUBLIC_DATASET`, `DERIVED_DATA`, `SYNTHETIC_DEMO_DATA`) |

*Note: Our system does not replace Guidewire HazardHub or core insurance suites; it operates as an intelligent evidence-aware monitoring layer that integrates with and augments policy administration workflows.*

---

## 3. Technology Stack

- **Backend:** Java 21 LTS, Spring Boot 3.3.x, Spring Web, Spring Data JPA, Spring Security (JWT), Spring Scheduler, Bean Validation, Flyway Database Migrations, Maven.
- **Frontend:** React 18 / 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6.
- **Database:** Relational Database (MySQL 8 / H2 MySQL-compatibility mode with identical DDL scripts), Flyway schema versioning.
- **Data Integration:** Adapters for MoSPI CPI API (`api.mospi.gov.in`), DPIIT WPI material tables, CPWD Plinth Area Rates 2025, GOBS (Geospatial Open Building Stack), and Tamil Nadu PWD schedules.

---

## 4. Key Metrics & Calculations

1. **ITV Ratio ($%$)**:
   $$\text{ITV Ratio} = \left(\frac{\text{Dwelling Coverage Limit}}{\text{Rebuilding Cost Estimate}}\right) \times 100$$
2. **Potential Coverage Gap ($\text{INR}$)**:
   $$\text{Coverage Gap} = \max(0, \text{Rebuilding Cost Estimate} - \text{Dwelling Coverage Limit})$$
3. **ITV Drift ($\text{Percentage Points}$)**:
   $$\text{ITV Drift} = \text{ITV Ratio}_{\text{current}} - \text{ITV Ratio}_{\text{previous}}$$
4. **Evidence Confidence Score ($C \in [0, 100]$)**:
   $$C = 0.30 \times S + 0.25 \times F + 0.20 \times K + 0.25 \times A$$
   - $S$: Source Reliability Score ($0-100$)
   - $F$: Evidence Freshness Score ($0-100$)
   - $K$: Property Completeness Score ($0-100$)
   - $A$: Multi-Estimate Agreement Score ($0-100$)

### Classification Thresholds
- **Adequate:** $\text{ITV} \ge 95\%$ (Green)
- **Watch:** $90\% \le \text{ITV} < 95\%$ (Yellow)
- **Warning:** $80\% \le \text{ITV} < 90\%$ (Orange)
- **Critical Underinsurance:** $\text{ITV} < 80\%$ (Red)

---

## 5. Repository Structure

```
d:\gw project
├── backend/                  # Spring Boot 3 Java application
│   ├── src/main/java/com/guidewire/itv/
│   │   ├── config/           # Security, OpenAPI, Scheduler configs
│   │   ├── controller/       # REST API endpoints
│   │   ├── dto/              # Request / Response DTOs
│   │   ├── entity/           # JPA entities matching normalized DB schema
│   │   ├── event/            # Application events and monitoring listeners
│   │   ├── exception/        # Global error handlers
│   │   ├── integration/      # Real & simulated Indian data adapters
│   │   ├── repository/       # Spring Data JPA repositories
│   │   ├── scheduler/        # Continuous monitoring daily cron jobs
│   │   ├── service/          # Core calculation, confidence, and workflow engines
│   │   └── util/             # Calculation math & date helpers
│   ├── src/main/resources/
│   │   ├── db/migration/     # Flyway SQL migrations (V1__init.sql, etc.)
│   │   └── application.yml   # Profiles for mysql and test
│   └── pom.xml               # Maven dependencies and build plugins
├── frontend/                 # React + TypeScript + Vite UI
│   ├── src/
│   │   ├── components/       # Reusable UI widgets (cards, badges, modals)
│   │   ├── pages/            # 18 enterprise insurance screens
│   │   ├── services/         # Axios API clients
│   │   ├── types/            # TypeScript interfaces
│   │   └── App.tsx           # Router and role-based guards
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── data/                     # Public Indian datasets, sample CSVs, and rate schedules
└── docs/                     # Specifications, ER diagrams, test logs, and audit templates
```

---

## 6. Getting Started

### Prerequisites
- JDK 17 or JDK 21 installed (`java -version`)
- Apache Maven 3.8+ installed (`mvn -version`)
- Node.js v18+ and npm (`node -v`)

### Quick Start Commands
See [DEMO_GUIDE.md](docs/DEMO_GUIDE.md) and [DEVELOPMENT_PROGRESS.md](DEVELOPMENT_PROGRESS.md) for step-by-step startup, demo scenarios, and execution instructions.
