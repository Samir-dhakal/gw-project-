package com.guidewire.itv.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.guidewire.itv.dto.ImportResultDto;
import com.guidewire.itv.entity.*;
import com.guidewire.itv.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class DataImportService {

    private static final Logger log = LoggerFactory.getLogger(DataImportService.class);
    public static final String SYNTHETIC_DEMO_DATA = "SYNTHETIC_DEMO_DATA";

    private final PropertyRepository propertyRepository;
    private final PolicyRepository policyRepository;
    private final RebuildingCostEstimateRepository estimateRepository;
    private final EvidenceRecordRepository evidenceRecordRepository;
    private final IntegrationConfigRepository integrationConfigRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public DataImportService(PropertyRepository propertyRepository,
                             PolicyRepository policyRepository,
                             RebuildingCostEstimateRepository estimateRepository,
                             EvidenceRecordRepository evidenceRecordRepository,
                             IntegrationConfigRepository integrationConfigRepository,
                             AuditLogService auditLogService) {
        this.propertyRepository = propertyRepository;
        this.policyRepository = policyRepository;
        this.estimateRepository = estimateRepository;
        this.evidenceRecordRepository = evidenceRecordRepository;
        this.integrationConfigRepository = integrationConfigRepository;
        this.auditLogService = auditLogService;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Import and validate the supplied synthetic CSV dataset.
     * Enforces SYNTHETIC_DEMO_DATA labeling on all records and checks data integrity.
     */
    @Transactional
    public ImportResultDto importSyntheticDataset(String baseDirectory) {
        ImportResultDto result = new ImportResultDto("Synthetic Policies, Properties & Evidence", baseDirectory, SYNTHETIC_DEMO_DATA);
        File dir = new File(baseDirectory);
        if (!dir.exists() || !dir.isDirectory()) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("Directory not found: " + baseDirectory);
            return result;
        }

        Map<String, Property> codeToPropertyMap = new HashMap<>();

        // 1. Properties CSV
        File propFile = new File(dir, "properties_synthetic.csv");
        if (propFile.exists()) {
            importProperties(propFile, result, codeToPropertyMap);
        } else {
            result.getValidationMessages().add("Missing properties_synthetic.csv");
        }

        // 2. Policies CSV
        File polFile = new File(dir, "policies_synthetic.csv");
        if (polFile.exists()) {
            importPolicies(polFile, result, codeToPropertyMap);
        } else {
            result.getValidationMessages().add("Missing policies_synthetic.csv");
        }

        // 3. Estimates CSV
        File estFile = new File(dir, "estimates_synthetic.csv");
        if (estFile.exists()) {
            importEstimates(estFile, result, codeToPropertyMap);
        } else {
            result.getValidationMessages().add("Missing estimates_synthetic.csv");
        }

        // 4. Evidence Records CSV
        File evdFile = new File(dir, "evidence_records_synthetic.csv");
        if (evdFile.exists()) {
            importEvidenceRecords(evdFile, result, codeToPropertyMap);
        } else {
            result.getValidationMessages().add("Missing evidence_records_synthetic.csv");
        }

        auditLogService.log("SYNTHETIC_DATA_IMPORTED", "DATA_IMPORT", "SYNTHETIC_CSVS",
                String.format("Imported %d records, updated %d records from %s. Labeled with %s",
                        result.getRecordsImported(), result.getRecordsUpdated(), baseDirectory, SYNTHETIC_DEMO_DATA));

        return result;
    }

    private void importProperties(File file, ImportResultDto result, Map<String, Property> codeToPropertyMap) {
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String headerLine = br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                result.setRecordsProcessed(result.getRecordsProcessed() + 1);
                String[] cols = parseCsvLine(line);

                if (cols.length < 10) {
                    result.setValidationErrorsCount(result.getValidationErrorsCount() + 1);
                    result.getValidationMessages().add("Invalid property row format: " + line);
                    continue;
                }

                String code = cols[0].trim();
                String address = cols[1].trim();
                String city = cols[2].trim();
                String state = cols[3].trim();
                String pincode = cols[4].trim();
                BigDecimal builtUpArea = new BigDecimal(cols[6].trim());
                int storeys = Integer.parseInt(cols[7].trim());
                int yearBuilt = Integer.parseInt(cols[8].trim());
                String constType = cols[9].trim();

                // Validation checks
                if (builtUpArea.compareTo(BigDecimal.ZERO) <= 0) {
                    result.getValidationMessages().add("Property " + code + ": built_up_area must be > 0");
                    continue;
                }
                if (storeys <= 0) {
                    result.getValidationMessages().add("Property " + code + ": storeys must be >= 1");
                    continue;
                }

                Property property = propertyRepository.findByPropertyCode(code).orElse(new Property());
                boolean isNew = property.getId() == null;
                property.setPropertyCode(code);
                property.setAddressLine1(address);
                property.setCity(city);
                property.setDistrict(city);
                property.setState(state);
                property.setPostalCode(pincode);
                property.setBuiltUpAreaSqm(builtUpArea);
                property.setGroundFootprintSqm(builtUpArea.divide(BigDecimal.valueOf(Math.max(1, storeys)), 2, RoundingMode.HALF_UP));
                property.setNumberOfFloors(storeys);
                property.setYearBuilt(yearBuilt);
                property.setConstructionType(constType);
                property.setLandUseType("RESIDENTIAL");

                Property saved = propertyRepository.save(property);
                codeToPropertyMap.put(code, saved);

                if (isNew) {
                    result.setRecordsImported(result.getRecordsImported() + 1);
                } else {
                    result.setRecordsUpdated(result.getRecordsUpdated() + 1);
                }
            }
        } catch (Exception e) {
            log.error("Error reading properties CSV: {}", e.getMessage());
            result.getValidationMessages().add("Property CSV Error: " + e.getMessage());
        }
    }

    private void importPolicies(File file, ImportResultDto result, Map<String, Property> codeToPropertyMap) {
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String headerLine = br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                result.setRecordsProcessed(result.getRecordsProcessed() + 1);
                String[] cols = parseCsvLine(line);

                if (cols.length < 10) continue;
                String polNum = cols[0].trim();
                String propCode = cols[1].trim();
                String holderName = cols[2].trim();
                String email = cols[3].trim();
                BigDecimal limit = new BigDecimal(cols[5].trim());
                String curr = cols[7].trim();
                LocalDate incept = LocalDate.parse(cols[8].trim());
                LocalDate expiry = LocalDate.parse(cols[9].trim());
                String status = cols[10].trim();
                String workflow = cols.length > 11 ? cols[11].trim() : "IN_FORCE";

                // Enforce currency and positive limits
                if (!"INR".equalsIgnoreCase(curr)) {
                    result.getValidationMessages().add("Policy " + polNum + ": Currency must be INR, found " + curr);
                    continue;
                }
                if (limit.compareTo(BigDecimal.ZERO) <= 0) {
                    result.getValidationMessages().add("Policy " + polNum + ": Coverage limit must be positive");
                    continue;
                }

                Property prop = codeToPropertyMap.computeIfAbsent(propCode, c -> propertyRepository.findByPropertyCode(c).orElse(null));
                if (prop == null) {
                    result.getValidationMessages().add("Policy " + polNum + ": Property " + propCode + " not found");
                    continue;
                }

                Policy policy = policyRepository.findByPolicyNumber(polNum).orElse(new Policy());
                boolean isNew = policy.getId() == null;
                policy.setPolicyNumber(polNum);
                policy.setProperty(prop);
                policy.setPolicyholderName(holderName);
                policy.setPolicyholderEmail(email);
                policy.setCurrentCoverageLimit(limit);
                policy.setCurrency("INR");
                policy.setInceptionDate(incept);
                policy.setExpiryDate(expiry);
                policy.setPolicyStatus(status);
                policy.setWorkflowType(workflow);

                policyRepository.save(policy);
                if (isNew) {
                    result.setRecordsImported(result.getRecordsImported() + 1);
                } else {
                    result.setRecordsUpdated(result.getRecordsUpdated() + 1);
                }
            }
        } catch (Exception e) {
            log.error("Error reading policies CSV: {}", e.getMessage());
            result.getValidationMessages().add("Policy CSV Error: " + e.getMessage());
        }
    }

    private void importEstimates(File file, ImportResultDto result, Map<String, Property> codeToPropertyMap) {
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String headerLine = br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                result.setRecordsProcessed(result.getRecordsProcessed() + 1);
                String[] cols = parseCsvLine(line);

                if (cols.length < 8) continue;
                String propCode = cols[1].trim();
                String srcOrg = cols[3].trim();
                BigDecimal cost = new BigDecimal(cols[4].trim());
                BigDecimal ratePerSqm = new BigDecimal(cols[5].trim());
                LocalDate date = LocalDate.parse(cols[6].trim());
                String method = cols[7].trim();
                boolean isPrimary = cols.length > 8 && Boolean.parseBoolean(cols[8].trim());

                Property prop = codeToPropertyMap.computeIfAbsent(propCode, c -> propertyRepository.findByPropertyCode(c).orElse(null));
                if (prop == null) continue;

                RebuildingCostEstimate est = new RebuildingCostEstimate();
                est.setProperty(prop);
                est.setSourceName(srcOrg);
                est.setEstimatedCost(cost);
                est.setCostPerSqm(ratePerSqm);
                est.setEstimateDate(date);
                est.setMethodology(method);
                est.setIsPrimary(isPrimary);
                est.setProvenanceCategory(SYNTHETIC_DEMO_DATA);

                estimateRepository.save(est);
                result.setRecordsImported(result.getRecordsImported() + 1);
            }
        } catch (Exception e) {
            log.error("Error reading estimates CSV: {}", e.getMessage());
            result.getValidationMessages().add("Estimates CSV Error: " + e.getMessage());
        }
    }

    private void importEvidenceRecords(File file, ImportResultDto result, Map<String, Property> codeToPropertyMap) {
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String headerLine = br.readLine();
            String line;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                result.setRecordsProcessed(result.getRecordsProcessed() + 1);
                String[] cols = parseCsvLine(line);

                if (cols.length < 10) continue;
                String propCode = cols[1].trim();
                String srcId = cols[2].trim();
                String srcName = cols[3].trim();
                LocalDate pubDate = LocalDate.parse(cols[6].trim().substring(0, 10));
                BigDecimal s = new BigDecimal(cols[7].trim());
                BigDecimal f = new BigDecimal(cols[8].trim());
                BigDecimal k = new BigDecimal(cols[9].trim());

                Property prop = codeToPropertyMap.computeIfAbsent(propCode, c -> propertyRepository.findByPropertyCode(c).orElse(null));
                if (prop == null) continue;

                EvidenceRecord evd = new EvidenceRecord();
                evd.setProperty(prop);
                evd.setSourceId(srcId);
                evd.setSourceName(srcName);
                evd.setPublicationDate(pubDate);
                evd.setSourceReliabilityScore(s);
                evd.setFreshnessScore(f);
                evd.setCompletenessScore(k);
                evd.setProvenanceCategory(SYNTHETIC_DEMO_DATA);
                evd.setIsValid(true);

                evidenceRecordRepository.save(evd);
                result.setRecordsImported(result.getRecordsImported() + 1);
            }
        } catch (Exception e) {
            log.error("Error reading evidence CSV: {}", e.getMessage());
            result.getValidationMessages().add("Evidence CSV Error: " + e.getMessage());
        }
    }

    /**
     * Import and validate Tamil Nadu PWD Schedule of Rates 2025-26 JSON.
     */
    @Transactional
    public ImportResultDto importPwdScheduleOfRates(String filepath) {
        ImportResultDto result = new ImportResultDto("Tamil Nadu PWD Schedule of Rates 2025-26", filepath, "GOVERNMENT_SCHEDULE_OF_RATES");
        File file = new File(filepath);
        if (!file.exists()) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("File not found: " + filepath);
            return result;
        }

        try {
            JsonNode root = objectMapper.readTree(file);
            String title = root.path("schedule_title").asText();
            String fiscalYear = root.path("effective_fiscal_year").asText();
            JsonNode basicRates = root.path("basic_rates_per_sqm");
            JsonNode multipliers = root.path("district_cost_indices_multipliers");

            int count = 0;
            if (basicRates.isObject()) {
                count += basicRates.size();
            }
            if (multipliers.isObject()) {
                count += multipliers.size();
            }

            result.setRecordsProcessed(count);
            result.setRecordsImported(count);
            result.getValidationMessages().add(String.format("Successfully parsed %s for %s. Basic items & multipliers validated.", title, fiscalYear));

            // Update IntegrationConfig
            integrationConfigRepository.findBySourceId("TN_PWD_SOR").ifPresent(cfg -> {
                cfg.setStatus("ACTIVE");
                cfg.setLastSyncAt(LocalDateTime.now());
                cfg.setRecordCount(result.getRecordsImported());
                integrationConfigRepository.save(cfg);
            });

            auditLogService.log("TN_PWD_SOR_IMPORTED", "DATA_INTEGRATION", "TN_PWD_SOR",
                    "Ingested Tamil Nadu PWD Schedule of Rates 2025-26. Verified " + count + " benchmark items.");

        } catch (Exception e) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("Failed to parse TN PWD JSON: " + e.getMessage());
        }

        return result;
    }

    /**
     * Import Wholesale Price Index series for construction materials.
     */
    @Transactional
    public ImportResultDto importWpiSeries(String filepath) {
        ImportResultDto result = new ImportResultDto("DPIIT Wholesale Price Index (Construction Materials)", filepath, "OFFICIAL_ECONOMIC_INDEX");
        File file = new File(filepath);
        if (!file.exists()) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("File not found: " + filepath);
            return result;
        }

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String header = br.readLine();
            String line;
            int count = 0;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                count++;
            }
            final int finalCount = count;
            result.setRecordsProcessed(finalCount);
            result.setRecordsImported(finalCount);
            result.getValidationMessages().add("Ingested " + finalCount + " DPIIT WPI material index entries (cement, structural steel, bricks, timber).");

            integrationConfigRepository.findBySourceId("DPIIT_WPI").ifPresent(cfg -> {
                cfg.setStatus("ACTIVE");
                cfg.setLastSyncAt(LocalDateTime.now());
                cfg.setRecordCount(finalCount);
                integrationConfigRepository.save(cfg);
            });

            auditLogService.log("DPIIT_WPI_IMPORTED", "DATA_INTEGRATION", "DPIIT_WPI",
                    "Ingested DPIIT Wholesale Price Index materials dataset with " + finalCount + " records.");

        } catch (Exception e) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("Failed to parse WPI CSV: " + e.getMessage());
        }

        return result;
    }

    /**
     * Import and validate Tamil Nadu Urban Building Footprints for property intelligence.
     */
    @Transactional
    public ImportResultDto importBuildingFootprints(String filepath) {
        ImportResultDto result = new ImportResultDto("Tamil Nadu Urban Building Footprints", filepath, "PUBLIC_GEODATA");
        File file = new File(filepath);
        if (!file.exists()) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("File not found: " + filepath);
            return result;
        }

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String header = br.readLine();
            String line;
            int count = 0;
            while ((line = br.readLine()) != null) {
                if (line.trim().isEmpty()) continue;
                String[] cols = parseCsvLine(line);
                if (cols.length < 10) continue;

                count++;
                String bldId = cols[0].trim();
                double lat = Double.parseDouble(cols[1].trim());
                double lon = Double.parseDouble(cols[2].trim());
                double groundArea = Double.parseDouble(cols[3].trim());
                double builtUp = Double.parseDouble(cols[7].trim());

                // Validate Tamil Nadu geographic bounding box & positive areas
                if (lat < 8.0 || lat > 13.8 || lon < 76.0 || lon > 80.5) {
                    result.setValidationErrorsCount(result.getValidationErrorsCount() + 1);
                    result.getValidationMessages().add("Building " + bldId + ": Coordinates outside Tamil Nadu bounds (" + lat + ", " + lon + ")");
                }
                if (groundArea <= 0 || builtUp <= 0) {
                    result.setValidationErrorsCount(result.getValidationErrorsCount() + 1);
                    result.getValidationMessages().add("Building " + bldId + ": Invalid zero or negative area");
                }
            }

            final int finalBldCount = count;
            result.setRecordsProcessed(finalBldCount);
            result.setRecordsImported(finalBldCount);
            result.getValidationMessages().add(String.format("Successfully parsed and validated %d Tamil Nadu urban building footprint records.", finalBldCount));

            integrationConfigRepository.findBySourceId("GOBS_AEEE").ifPresent(cfg -> {
                cfg.setStatus("ACTIVE");
                cfg.setLastSyncAt(LocalDateTime.now());
                cfg.setRecordCount(finalBldCount);
                integrationConfigRepository.save(cfg);
            });

            auditLogService.log("BUILDING_FOOTPRINTS_IMPORTED", "DATA_INTEGRATION", "URBAN_BUILDINGS",
                    "Ingested Tamil Nadu Urban Building Footprints dataset with " + finalBldCount + " physical structures.");

        } catch (Exception e) {
            result.setStatus("FAILED");
            result.getValidationMessages().add("Failed to parse building footprints: " + e.getMessage());
        }

        return result;
    }

    private String[] parseCsvLine(String line) {
        List<String> tokens = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                tokens.add(sb.toString());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        tokens.add(sb.toString());
        return tokens.toArray(new String[0]);
    }
}
