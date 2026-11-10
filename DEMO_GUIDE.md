# Live Demonstration Guide & Examiner Walkthrough

## 1. Overview
This guide provides the step-by-step procedure to demonstrate the **Continuous Insurance-to-Value (ITV) Intelligence Engine** to academic examiners and Guidewire project evaluators.

---

## 2. Pre-Demo Setup & Verification

### Credentials for Demo Access
| Role | Username | Password | Permitted Actions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `Admin@123` | Full access, user management, integration config |
| **Underwriter** | `underwriter` | `Underwriter@123` | Case review, evidence inspection, decision approvals |
| **Reviewer** | `reviewer` | `Reviewer@123` | Case inspection, evidence verification, escalations |
| **Viewer** | `viewer` | `Viewer@123` | Read-only access to dashboards and analytics |

---

## 3. The Three Master Demonstration Scenarios

### Scenario A: Gradual Underinsurance Detection & In-Force Drift
- **Target Policy:** `POL-IN-2025-00101` (Dwelling Coverage: ₹50,00,000; Property: Chennai Residential RCC).
- **Narrative:**
  1. Show initial policy inception snapshot at ₹50L with 100% ITV (`ADEQUATE`).
  2. Navigate to **Monitoring Centre** and simulate arrival of updated CPWD PAR 2025 and WPI material escalation indexing (rebuilding cost rises to ₹65,00,000).
  3. Trigger continuous in-force evaluation.
  4. Observe automatic creation of a historical snapshot: ITV drops from 100% to 76.92% (Drift = -23.08%).
  5. Status automatically degrades from `ADEQUATE` $\rightarrow$ `CRITICAL`.
  6. Show automatic generation of Case `CASE-2025-00101` with underwriter recommendation.

### Scenario B: Conflicting Evidence & Explainable Hard Abstention
- **Target Policy:** `POL-IN-2025-00104` (Property: Coimbatore Independent Villa).
- **Narrative:**
  1. Property has two conflicting external estimates:
     - Estimate A (Local Builder Appraisal): ₹70,00,000
     - Estimate B (Derived CPWD Rate): ₹92,00,000
     - Divergence = 31.4% (exceeds the 20% hard threshold).
  2. Run evaluation.
  3. Observe **Hard Abstention Triggered**: The engine refuses to recommend a blind coverage increase.
  4. Show the **Confidence & Abstention Breakdown**: Component scores ($S, F, K, A$) and clear natural-language explanation: *"Independent estimates diverge by 31.4%, exceeding the 20% tolerance limit. Recommending physical field engineering inspection."*
  5. Demonstrate generation of an **Evidence Verification Request**.

### Scenario C: Complete Underinsurance Resolution Workflow
- **Target Policy:** `POL-IN-2025-00102` (Approaching Renewal in 45 Days).
- **Narrative:**
  1. Open Case in **Underwriter Review Workspace**.
  2. Inspect property details, structural characteristics, and evidence provenance.
  3. Launch **Coverage Scenario Simulator**:
     - Compare Existing (₹45L, 75% ITV), 80% (₹48L), 90% (₹54L), 95% (₹57L), and 100% (₹60L).
     - Emphasize to the examiners that scenario calculations **do not alter the real policy**.
  4. Select 95% target (₹57L) as recommended renewal offer.
  5. Record underwriter approval notes: *"Approved revised renewal endorsement to ₹57,00,000 based on verified CPWD Plinth Rate benchmarks."*
  6. Submit decision. Observe status transition to `RESOLVED`.
  7. Inspect **Audit History** to demonstrate timestamped, tamper-proof audit trail.
  8. Navigate to **Portfolio Outcome Analytics** to show updated resolution rate and portfolio gap reductions.

