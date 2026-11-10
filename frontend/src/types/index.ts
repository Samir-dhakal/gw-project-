export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'UNDERWRITER' | 'REVIEWER' | 'VIEWER';
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  fullName: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface Property {
  id: number;
  propertyCode: string;
  addressLine1: string;
  city: string;
  district: string;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  constructionType: string;
  yearBuilt: number;
  numberOfFloors: number;
  groundFootprintSqm: number;
  builtUpAreaSqm: number;
  landUseType: string;
  hasRecentRenovation: boolean;
  renovationDetails?: string;
}

export interface CoverageSnapshot {
  id: number;
  policyId: number;
  effectiveDate: string;
  coverageLimit: number;
  endorsementNumber?: string;
  reason: string;
  recordedAt: string;
}

export interface RebuildingEstimate {
  id: number;
  propertyId: number;
  estimateDate: string;
  estimatedCost: number;
  costPerSqm: number;
  methodology: string;
  sourceName: string;
  provenanceCategory: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface EvidenceRecord {
  id: number;
  propertyId: number;
  sourceId: string;
  sourceName: string;
  sourceUrl?: string;
  publicationDate: string;
  retrievalDate: string;
  provenanceCategory: string;
  sourceReliabilityScore: number;
  freshnessScore: number;
  completenessScore: number;
  rawPayload?: string;
  isValid: boolean;
}

export interface ConfidenceBreakdown {
  overallScore: number;
  category: 'HIGH' | 'MEDIUM' | 'LOW';
  sourceReliabilityWeight: number;
  sourceReliabilityScore: number;
  freshnessWeight: number;
  freshnessScore: number;
  completenessWeight: number;
  completenessScore: number;
  agreementWeight: number;
  agreementScore: number;
  abstentionTriggered: boolean;
  abstentionReasons: string[];
  missingFields: string[];
  recommendedVerificationAction: string;
}

export interface MonitoringEvaluation {
  id: number;
  policyId: number;
  policyNumber: string;
  evaluationTimestamp: string;
  triggerType: string;
  dwellingCoverage: number;
  rebuildingCost: number;
  itvRatio: number;
  potentialCoverageGap: number;
  itvDrift: number;
  itvClassification: 'ADEQUATE' | 'WATCH' | 'WARNING' | 'CRITICAL';
  confidenceScore: number;
  confidenceCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  abstentionTriggered: boolean;
  abstentionReasons?: string;
  recommendationText?: string;
}

export interface PolicySummary {
  id: number;
  policyNumber: string;
  policyholderName: string;
  city: string;
  state: string;
  currentCoverageLimit: number;
  latestRebuildingCost: number;
  currentItvRatio: number;
  potentialCoverageGap: number;
  itvDrift: number;
  itvClassification: 'ADEQUATE' | 'WATCH' | 'WARNING' | 'CRITICAL';
  confidenceScore: number;
  confidenceCategory: 'HIGH' | 'MEDIUM' | 'LOW';
  abstentionTriggered: boolean;
  inceptionDate: string;
  expiryDate: string;
  policyStatus: string;
  workflowType: string;
}

export interface PolicyDetail {
  id: number;
  policyNumber: string;
  policyholderName: string;
  policyholderEmail?: string;
  currency: string;
  currentCoverageLimit: number;
  inceptionDate: string;
  expiryDate: string;
  policyStatus: string;
  workflowType: string;
  property: Property;
  coverageHistory: CoverageSnapshot[];
  estimateHistory: RebuildingEstimate[];
  evaluationHistory: MonitoringEvaluation[];
  evidenceRecords: EvidenceRecord[];
  reviewCases: ReviewCase[];
}

export interface ReviewCase {
  id: number;
  caseNumber: string;
  policyId: number;
  policyNumber: string;
  policyholderName: string;
  propertyAddress: string;
  caseType: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'EVIDENCE_REQUESTED' | 'RESOLVED' | 'CLOSED';
  assignedUnderwriterId?: number;
  assignedUnderwriterName?: string;
  currentCoverageLimit: number;
  latestRebuildingCost: number;
  currentItvRatio: number;
  coverageGap: number;
  createdAt: string;
  resolvedAt?: string;
}

export interface UnderwriterDecisionRequest {
  caseId: number;
  decisionType: 'APPROVE_ENDORSEMENT' | 'REJECT_CHANGE' | 'ESCALATE' | 'REQUEST_FIELD_INSPECTION';
  approvedCoverageLimit?: number;
  decisionNotes: string;
}

export interface ScenarioOption {
  scenarioKey: string;
  label: string;
  proposedCoverage: number;
  projectedItvRatio: number;
  remainingGap: number;
  coverageDelta: number;
  classification: string;
  rationale: string;
}

export interface ScenarioProjection {
  policyId: number;
  policyNumber: string;
  currentCoverage: number;
  rebuildingCostEstimate: number;
  currentItvRatio: number;
  currentGap: number;
  scenarios: ScenarioOption[];
}

export interface PortfolioAnalytics {
  totalPoliciesMonitored: number;
  adequateCount: number;
  watchCount: number;
  warningCount: number;
  criticalCount: number;
  totalPortfolioCoverageGap: number;
  openCasesCount: number;
  resolvedCasesCount: number;
  lowConfidenceAbstentionsCount: number;
  pendingRenewalsCount: number;
  resolutionRatePercent: number;
  classificationDistribution: Record<string, number>;
  confidenceDistribution: Record<string, number>;
}

export interface IntegrationConfig {
  id: number;
  sourceId: string;
  sourceName: string;
  sourceType: string;
  baseUrl: string;
  status: string;
  lastSyncAt?: string;
  recordCount: number;
  errorMessage?: string;
  provenanceCategory: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  username: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
}
