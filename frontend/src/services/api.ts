import axios from 'axios';
import {
  AuthResponse,
  PolicySummary,
  PolicyDetail,
  ConfidenceBreakdown,
  MonitoringEvaluation,
  ReviewCase,
  UnderwriterDecisionRequest,
  ScenarioProjection,
  PortfolioAnalytics,
  IntegrationConfig,
  ImportResult,
  AuditLog
} from '../types';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('itv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('itv_token');
      localStorage.removeItem('itv_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { username, password });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
};

export const policyApi = {
  getPolicies: async (status?: string, classification?: string, search?: string): Promise<PolicySummary[]> => {
    const res = await api.get<PolicySummary[]>('/policies', {
      params: { status, classification, search },
    });
    return res.data;
  },
  getPolicyDetail: async (id: number): Promise<PolicyDetail> => {
    const res = await api.get<PolicyDetail>(`/policies/${id}`);
    return res.data;
  },
};

export const monitoringApi = {
  evaluatePolicy: async (policyId: number, triggerType = 'MANUAL_REASSESSMENT'): Promise<MonitoringEvaluation> => {
    const res = await api.post<MonitoringEvaluation>(`/monitoring/evaluate/${policyId}`, null, {
      params: { triggerType },
    });
    return res.data;
  },
  runBatchScan: async (triggerType = 'MANUAL_BATCH_TRIGGER') => {
    const res = await api.post('/monitoring/batch-scan', null, {
      params: { triggerType },
    });
    return res.data;
  },
  getEvaluationsForPolicy: async (policyId: number): Promise<MonitoringEvaluation[]> => {
    const res = await api.get<MonitoringEvaluation[]>(`/monitoring/evaluations/${policyId}`);
    return res.data;
  },
};

export const evidenceApi = {
  getConfidenceBreakdown: async (policyId: number): Promise<ConfidenceBreakdown> => {
    const res = await api.get<ConfidenceBreakdown>(`/evidence/confidence/${policyId}`);
    return res.data;
  },
  getEvidenceForProperty: async (propertyId: number) => {
    const res = await api.get(`/evidence/property/${propertyId}`);
    return res.data;
  },
};

export const scenarioApi = {
  simulateScenarios: async (policyId: number, customCoverageLimit?: number): Promise<ScenarioProjection> => {
    const res = await api.post<ScenarioProjection>('/scenarios/simulate', {
      policyId,
      customCoverageLimit,
    });
    return res.data;
  },
};

export const workflowApi = {
  getCases: async (status?: string): Promise<ReviewCase[]> => {
    const res = await api.get<ReviewCase[]>('/workflows/cases', {
      params: { status },
    });
    return res.data;
  },
  getCaseById: async (id: number): Promise<ReviewCase> => {
    const res = await api.get<ReviewCase>(`/workflows/cases/${id}`);
    return res.data;
  },
  recordDecision: async (request: UnderwriterDecisionRequest): Promise<ReviewCase> => {
    const res = await api.post<ReviewCase>('/workflows/cases/decision', request);
    return res.data;
  },
  assignCase: async (caseId: number, underwriterId: number): Promise<ReviewCase> => {
    const res = await api.post<ReviewCase>(`/workflows/cases/${caseId}/assign`, null, {
      params: { underwriterId },
    });
    return res.data;
  },
};

export const analyticsApi = {
  getPortfolioAnalytics: async (): Promise<PortfolioAnalytics> => {
    const res = await api.get<PortfolioAnalytics>('/analytics/portfolio');
    return res.data;
  },
};

export const integrationApi = {
  getAllIntegrations: async (): Promise<IntegrationConfig[]> => {
    const res = await api.get<IntegrationConfig[]>('/integrations');
    return res.data;
  },
  syncIntegration: async (sourceId: string): Promise<IntegrationConfig> => {
    const res = await api.post<IntegrationConfig>(`/integrations/sync/${sourceId}`);
    return res.data;
  },
  importSyntheticCsv: async (): Promise<ImportResult> => {
    const res = await api.post<ImportResult>('/integrations/import/synthetic-csv');
    return res.data;
  },
  importPwdRates: async (): Promise<ImportResult> => {
    const res = await api.post<ImportResult>('/integrations/import/pwd-rates');
    return res.data;
  },
  importWpiSeries: async (): Promise<ImportResult> => {
    const res = await api.post<ImportResult>('/integrations/import/wpi-series');
    return res.data;
  },
  importBuildingFootprints: async (): Promise<ImportResult> => {
    const res = await api.post<ImportResult>('/integrations/import/building-footprints');
    return res.data;
  },
};

export const auditApi = {
  getRecentLogs: async (): Promise<AuditLog[]> => {
    const res = await api.get<AuditLog[]>('/audit/recent');
    return res.data;
  },
};

export default api;

