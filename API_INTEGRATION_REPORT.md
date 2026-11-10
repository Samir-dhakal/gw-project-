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

### 2.4 Geospatial Open Building Stack (GOBS)
- **Portal:** `https://gobs.aeee.in`
- **Status:** **CSV / CSV.GZ IMPORTER IMPLEMENTED**.
- **Sample Region:** Chennai & Coimbatore residential clusters.
- **Fields Processed:** `area_in_meters`, `building_height`, `building_floor`, `total_built_up`, `prediction_confidence`.
