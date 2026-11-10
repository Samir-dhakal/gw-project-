# Data Sources & Public Indian Integration Specifications

## 1. Summary of Public Indian Sources

| Source Name | Organization / Authority | Access Mechanism | Status in Prototype | Data Type & Role |
| :--- | :--- | :--- | :--- | :--- |
| **MoSPI CPI API** | Ministry of Statistics and Programme Implementation | REST API (`api.mospi.gov.in`) | API client ready / Real schema mapped (Auth registration required) | Macroeconomic inflation context for cost escalation over time |
| **DPIIT WPI Data** | Office of the Economic Adviser, Ministry of Commerce & Industry | Monthly Tables (`eaindustry.nic.in`) | Monthly dataset downloaded & imported | Construction commodity price indices (Portland cement, TMT steel bars) |
| **CPWD Plinth Area Rates 2025** | Central Public Works Department, MoHUA | Official Published Document (12th Edition, Apr 2025) | Extracted & structured in rate tables | Primary baseline residential rebuilding cost benchmark (₹23,530/sqm base) |
| **Tamil Nadu PWD Schedule of Rates** | TN Public Works Department | Official Schedule of Rates (SOR) | Regional adjustment factors & district indices | Regional labor and material cost multipliers for Tamil Nadu (Chennai, Coimbatore) |
| **Geospatial Open Building Stack (GOBS)** | Alliance for an Energy Efficient Economy (AEEE) | Bulk `.csv.gz` Download (`gobs.aeee.in`) | CSV importer ready / Sample Tamil Nadu building polygons | Footprint area, building height, floor count, and built-up area |
| **Census of India & Data.gov.in** | Registrar General & Census Commissioner / NIC | Open Government Data Platform | Reference demographic & structural typology | Regional wall/roof material prevalence statistics |

---

## 2. Detailed Source Profiles

### 2.1 MoSPI Consumer Price Index (CPI) API
- **Official Portal:** `https://esankhyiki.mospi.gov.in`
- **API Base URL:** `https://api.mospi.gov.in`
- **Target Endpoints:**
  - `POST /api/users/usersignup` — User registration.
  - `POST /api/login` — Authenticate and receive a temporary Bearer Token (15-minute validity).
  - `GET /api/cpi/getCPIIndex` — General, group, and sub-group level consumer price index.
  - `GET /api/cpi/getItemIndex` — Granular item-level index and retail inflation.
- **Unauthenticated Mode:** Limited to first 10 records.
- **Role in Engine:** Provides general inflation trends and housing index sub-components to assess overall currency depreciation. Not treated as a standalone property rebuilding estimator.

### 2.2 DPIIT Wholesale Price Index (WPI)
- **Portal:** `https://eaindustry.nic.in/download_data_2223.asp`
- **Current Base Year:** 2022–23 series (effective May 2026 data release with back-series from April 2023).
- **Previous Base Year:** 2011–12 series.
- **Relevant Commodity Sub-categories:**
  - *Manufactured Products $\rightarrow$ Non-metallic mineral products:* Cement, Lime and Plaster (Grey Cement, Portland Pozzolana Cement).
  - *Manufactured Products $\rightarrow$ Basic metals:* Mild steel, semi-finished steel, steel bars and rods.
- **Role in Engine:** Quantifies physical building material cost increases to adjust historical rebuilding cost baselines between formal engineering appraisals.

### 2.3 CPWD Plinth Area Rates 2025 (PAR 2025)
- **Reference:** CPWD Publication No. 12 (Base Delhi Cost Index = 100 as of 01.04.2025).
- **Core Rates Extracted:**
  - **RCC Framed Structure (Residential Quarters up to 6 storeys, 3.6m floor height):** ₹23,530 per sq. meter (~₹2,186 per sq. foot).
  - **Load Bearing Masonry Structure:** ₹18,450 per sq. meter (~₹1,714 per sq. foot).
  - **Finishing & Services Multipliers:** Electrical (7.5%), Internal Water Supply & Sanitation (7.5%), Firefighting & Lightning Protection (2.5%).
- **Regional Adjustment Index:** Delhi = 100; Chennai, Tamil Nadu index multiplier = 1.08; Coimbatore = 1.04.

### 2.4 Geospatial Open Building Stack (GOBS)
- **Publisher:** Alliance for an Energy Efficient Economy (AEEE).
- **Coverage:** 180+ million buildings across India derived from satellite imagery and machine learning.
- **Data Schema:**
  - `latitude`, `longitude` (Float, Centroids)
  - `area_in_meters` (Float, Ground footprint area)
  - `perimeter` (Float, Building polygon boundary in meters)
  - `building_height` (Float, Height in meters from Google Open Buildings 2.5D)
  - `building_floor` (Integer, Estimated storeys)
  - `total_built_up` (Float, Footprint $\times$ Floor count)
  - `landuse` (String: `Residential`, `Commercial`, `Industrial`)
  - `is_predicted` (Boolean)
  - `prediction_confidence` (Float, $0.0 - 1.0$)
  - `state_name`, `district_name` (String)

---

## 3. Data Provenance Categorization

To guarantee transparency and defend against academic criticism regarding data integrity:
1. `REAL_PUBLIC_API`: Records fetched directly from live government endpoints (e.g., MoSPI API with response metadata).
2. `REAL_PUBLIC_DATASET`: Records parsed from verified government datasets (DPIIT WPI CSVs, GOBS Tamil Nadu district extracts).
3. `REAL_PUBLIC_DOCUMENT`: Values extracted from published government gazettes (CPWD PAR 2025, TN PWD Schedule of Rates).
4. `DERIVED_DATA`: Rebuilding cost estimates calculated deterministically from verified plinth rates, built-up areas, and material escalation formulas.
5. `SYNTHETIC_DEMO_DATA`: Policyholder names, policy numbers, and insured coverage limits (since Indian public data does not publish private household policy contracts). Clearly labelled in all UI views.
6. `SIMULATED_API`: Mock adapters replicating exact production schemas when external credentials or live access are pending.

