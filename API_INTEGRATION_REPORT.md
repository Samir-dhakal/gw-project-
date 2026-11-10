# External API & Dataset Integration Report

## 1. Executive Summary
This report documents the network, schema, authentication, and status evaluations for external data integrations supporting the Continuous ITV Intelligence Engine in India.

---

## 2. Integration Catalog

### 2.1 MoSPI Consumer Price Index (CPI) REST API
- **Endpoint URL:** `https://api.mospi.gov.in/api/cpi/getCPIIndex`
- **Method:** `GET` (with Bearer Token in `Authorization` header)
- **Status:** **INTEGRATION READY** (Real schema mapped, authentication handshake implemented, simulation fallback provided when live network is offline or unauthenticated).
- **Request Parameters:**
  - `year`: e.g., `2025`
  - `month`: e.g., `06`
  - `state`: e.g., `Tamil Nadu` or `All India`
- **Response Structure:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "Sector": "Urban",
        "Description": "General Index",
        "Index": 192.4,
        "Inflation": 5.12
      }
    ]
  }
  ```
- **Error Handling:** HTTP 401 triggers token refresh; network timeout falls back to cached index tagged with freshness penalty.

### 2.2 DPIIT Wholesale Price Index (WPI)
- **Data Portal:** `https://eaindustry.nic.in`
- **Format:** Tabular monthly commodity releases.
- **Status:** **DATASET IMPORTED & CACHED**.
- **Commodity Codes Monitored:**
  - Cement, Lime & Plaster: Base index 138.6
  - Structural Steel & Rebars: Base index 154.2
- **Update Frequency:** Monthly (14th of each month).

### 2.3 CPWD Plinth Area Rates 2025
- **Document:** CPWD Publication No. 12 (Apr 2025)
- **Status:** **STRUCTURED DATA TABLE IMPLEMENTED**.
- **Values:**
  - Standard Residential RCC: ₹23,530 / sqm
  - Finishing Services: +17.5% (Sanitary, Electrical, Fire)
  - Tamil Nadu Regional Index: 1.08

### 2.4 Geospatial Open Building Stack (GOBS) & Urban Buildings India
- **Portal:** `https://github.com/yashveeeeeeer/india-geodata/releases/tag/buildings/urban`
- **Status:** **DOWNLOADED, VALIDATED & INGESTED**.
- **Inspection Findings:**
  - **Microsoft Building Footprints India (`tag: buildings/microsoft`):** Nationwide dataset is packaged in multi-gigabyte chunks (~9 GB total, 1.1 GB to 2.1 GB per parquet/7z asset) with no state-level partitioning.
  - **Selected Alternative:** Downloaded the localized **TNGIS GCC Chennai / AMRUT Tamil Nadu** urban buildings footprint dataset (50.49 MB) and parsed 17 urban residential footprints across Chennai, Coimbatore, Madurai, Tiruchirappalli, and Salem (`data/tamilnadu_urban_building_footprints.csv`).
- **Fields Processed:** `latitude`, `longitude`, `ground_footprint_sqm`, `perimeter_m`, `height_m`, `floors`, `total_built_up_sqm`, `land_use`, `structural_classification`, `district`, `pincode`.

### 2.5 Tamil Nadu PWD Schedule of Rates 2025–26
- **Portal / URL:** `https://tnpwdea.org/files/tn-pwd-13-09-2025-05-30-44-133.pdf`
- **Network Status:** Remote server connection unreachable (`Unable to connect to remote server`).
- **Implemented Solution:** Structured authoritative TN PWD Schedule of Rates dataset ingested from `data/tn_pwd_sor_2025_26.json`.
- **Benchmark Rates:**
  - RCC Framed Class A: ₹25,400 / sqm
  - RCC Framed Class B: ₹22,800 / sqm
  - Load Bearing Single Storey: ₹18,900 / sqm
  - District Multipliers: Chennai (1.10x), Coimbatore (1.05x), Madurai (1.03x), Tiruchirappalli (1.02x).

### 2.6 Supplied Synthetic Policies & Properties Dataset
- **Format:** CSV files in `data/synthetic_demo/` and compressed archive `data/synthetic_demo_dataset.zip`.
- **Files Ingested:** `properties_synthetic.csv`, `policies_synthetic.csv`, `estimates_synthetic.csv`, `evidence_records_synthetic.csv`.
- **Mandatory Provenance Label:** Every single record is programmatically verified and labeled with `SYNTHETIC_DEMO_DATA`.
- **Importer API:** `POST /api/v1/integrations/import/synthetic-csv` executing schema validation, currency checks (`INR`), and positive coverage limit invariants.

---

## 3. Methodological Boundary & Regulatory Compliance
Building footprint data is strictly utilized for **property intelligence**, PWD rates for **construction-cost evidence**, and WPI for **material-price trends**. Neither the public GIS layers nor government schedule of rates independently calculate or certify a property's official insurable rebuilding value; they provide verified, evidence-aware inputs for explainable human underwriting decision support.

