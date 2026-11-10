# Project Architecture & Engineering Decisions (ADR)

## ADR-001: Architecture Choice — Modular Monolith over Microservices
- **Context:** The project requires end-to-end integration across continuous monitoring, evidence scoring, scenario simulation, and human underwriter workflows.
- **Decision:** Implement a modular monolith using Java 21 / Spring Boot 3 on the backend and React + TypeScript + Vite on the frontend.
- **Rationale:** Microservices introduce network latency, distributed transaction complexity, and fragile Docker networking overhead for local review demonstrations. A modular monolith enforces strict package boundaries (`service`, `controller`, `dto`, `repository`, `integration`, `security`) while running as a single, easily demonstrable executable.

---

## ADR-002: Dual Database Strategy (MySQL 8 + H2 MySQL Compatibility)
- **Context:** Production requirements mandate MySQL 8 with Flyway schema versioning, but evaluation machines may lack a running local MySQL service daemon.
- **Decision:** Structure Flyway SQL migrations using ANSI standard MySQL 8 DDL. Support a primary MySQL 8 profile and an automated file-backed H2 profile running in `MODE=MySQL`.
- **Rationale:** Guarantees zero-friction execution during final project viva/reviews on any machine while retaining 100% production MySQL syntax, foreign keys, and indexes.

---

## ADR-003: Strict Append-Only In-Force Monitoring History
- **Context:** Traditional policy databases frequently overwrite the current coverage or replacement cost limit in place.
- **Decision:** Mandate append-only tables for `coverage_snapshots`, `rebuilding_cost_estimates`, and `monitoring_evaluations`.
- **Rationale:** Reconstructing the timeline of ITV deterioration ($ITV_t - ITV_{t-1}$) and proving regulatory compliance requires complete temporal visibility into what the insurer knew and when they knew it.

---

## ADR-004: Explicit Hard Abstention over Heuristic Forcing
- **Context:** Automated decision engines often force a decision even when inputs are contradictory or unverified.
- **Decision:** If two independent estimates diverge by $> 20\%$, or if critical structural parameters are absent, or if evidence exceeds staleness thresholds, the system must trigger **Hard Abstention**, refusing to generate an automated recommendation and instead creating an **Evidence Verification Case**.
- **Rationale:** Blindly recommending coverage changes on unreliable evidence exposes insurers and homeowners to severe legal, financial, and regulatory penalties.

---

## ADR-005: Functional Scenario Simulation with Zero Policy Mutation
- **Context:** Underwriters need to test 80%, 90%, 95%, 100%, and custom coverage limits.
- **Decision:** The scenario simulator operates as a pure functional projection endpoint that accepts hypothetical parameters and returns calculated gaps and ITV ratios without writing to or mutating the `policies` table.
- **Rationale:** Under insurance law, a policy coverage limit can only be modified via an authorized endorsement signed off by an authorized underwriter and agreed upon with the policyholder.

