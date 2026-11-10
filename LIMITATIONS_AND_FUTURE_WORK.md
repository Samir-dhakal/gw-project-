# Limitations and Future Work

## 1. Technical & Domain Limitations

### 1.1 Data Scope & Geographic Coverage
- **Current Scope:** Demonstrates residential dwelling/building structures across urban Tamil Nadu (Chennai, Coimbatore, Madurai). Does not cover commercial properties, industrial complexes, agricultural holdings, or household contents insurance.
- **Granular Cadastral Mapping:** Indian public cadastre records (e.g., Tamil Nadu Patta/Chitta) currently lack unified programmatic REST APIs across all municipal wards. Local property boundary matching relies on address clustering and GOBS centroid coordinates.

### 1.2 Synthetic Policyholder Contracts
- **Regulatory Privacy:** Under Indian privacy regulations and IRDAI confidentiality norms, actual private policyholder records and claims histories cannot be published publicly. Therefore, policyholder identities and baseline coverage limits are explicitly synthetic, while regional construction indices, plinth rates, and building footprints are real.

### 1.3 Premium Pricing Actuarial Models
- The coverage scenario simulator projects hypothetical coverage limits and ITV gaps. It intentionally does not fabricate premium quotes or rate filings, as insurance premium calculations require filed and approved IRDAI rating algorithms.

---

## 2. Future Extensions & Enterprise Roadmap

1. **Direct Guidewire Cloud Integration:**
   - Implement Guidewire Cloud Integration Framework (GWIC) webhooks to automatically push approved endorsements directly into PolicyCenter via PolicyCenter REST APIs.
2. **HazardHub Peril Multipliers:**
   - Incorporate Guidewire HazardHub peril scoring (flood, cyclone, earthquake risk zones in coastal Tamil Nadu) to weight structural vulnerability factors alongside replacement costs.
3. **Computer Vision & Drone / Satellite Imagery:**
   - Integrate automated roof classification and change detection models comparing historical satellite imagery to detect unnotified second-floor additions or rooftop structures.
4. **Machine Learning Confidence Calibration:**
   - Transition the four-component heuristic confidence formula ($S, F, K, A$) to a calibrated Bayesian uncertainty framework trained on empirical claim settlement loss histories.

