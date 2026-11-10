# Data Quality & Governance Report

## 1. Overview
This report establishes data quality criteria, verification rubrics, anomaly detection, and handling rules across all external Indian public datasets and synthetic policy records utilized within the Continuous ITV Intelligence Engine.

---

## 2. Source-by-Source Data Quality Assessment

| Source | Dimension | Assessment | Handling Rule in Engine |
| :--- | :--- | :--- | :--- |
| **MoSPI CPI API** | Completeness | High for all-India macro series; variable for localized rural baskets | Used strictly for regional macroeconomic inflation scaling; fallback to national headline index if state series is absent. |
| **DPIIT WPI Tables** | Timeliness | Released with 14-day publication lag; provisional for 60 days | Record marked with `is_provisional = true` until final revision published. Marked stale if $> 90$ days. |
| **CPWD PAR 2025** | Accuracy | High (Official Central PWD publication, 12th Edition) | Serves as authoritative baseline. Regional index multiplier applied for Tamil Nadu (1.08x). |
| **GOBS Building Stock** | Validity | Satellite ML predictions have confidence scores ($0.0 - 1.0$) | Records with `prediction_confidence < 0.70` flagged for manual review; footprint vs. built-up area strictly segregated. |
| **TN PWD SOR** | Consistency | Periodic revisions by TN state gazette | Versioned by financial year. Effective dates strictly validated against policy evaluation timestamps. |
| **Synthetic Policy Data** | Provenance | Explicitly synthesized for demonstration | Policyholder names and contract limits explicitly marked `SYNTHETIC_DEMO_DATA` to ensure ethical research standards. |

---

## 3. Data Cleansing & Validation Rules
1. **Numerical Bounds Checking:**
   - Dwelling coverage limit $> 0$.
   - Rebuilding cost estimate $> 0$.
   - Built-up area $> 10$ sqm and $< 100,000$ sqm for residential dwellings.
   - Ground footprint $\le$ total built-up area.
2. **Currency Uniformity:**
   - Strict currency assertion: `currency == 'INR'`. Cross-currency contamination rejected with HTTP 422 Unprocessable Entity.
3. **Temporal Validity:**
   - `inception_date <= expiry_date`.
   - Rebuilding cost estimate date cannot be in the future.
