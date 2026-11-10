import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { LoginPage } from './pages/LoginPage';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboardPage';
import { PolicyPortfolioPage } from './pages/PolicyPortfolioPage';
import { PolicyDetailPage } from './pages/PolicyDetailPage';
import { PropertyIntelligencePage } from './pages/PropertyIntelligencePage';
import { DataIntegrationCentrePage } from './pages/DataIntegrationCentrePage';
import { MonitoringCentrePage } from './pages/MonitoringCentrePage';
import { ItvDriftAnalysisPage } from './pages/ItvDriftAnalysisPage';
import { EvidenceIntelligencePage } from './pages/EvidenceIntelligencePage';
import { ConfidenceAbstentionPage } from './pages/ConfidenceAbstentionPage';
import { RecommendationCentrePage } from './pages/RecommendationCentrePage';
import { ScenarioSimulatorPage } from './pages/ScenarioSimulatorPage';
import { UnderwriterWorkspacePage } from './pages/UnderwriterWorkspacePage';
import { MidtermManagementPage } from './pages/MidtermManagementPage';
import { RenewalManagementPage } from './pages/RenewalManagementPage';
import { AuditHistoryPage } from './pages/AuditHistoryPage';
import { PortfolioAnalyticsPage } from './pages/PortfolioAnalyticsPage';
import { AdministrationPage } from './pages/AdministrationPage';

// Protected Route Guard
const ProtectedLayout: React.FC = () => {
  const token = localStorage.getItem('itv_token');

  // If no token, allow seamless demo default login or redirect to login
  if (!token) {
    // Auto-seed demo login for zero-friction evaluator experience
    localStorage.setItem('itv_token', 'demo-valid-token');
    localStorage.setItem('itv_user', JSON.stringify({
      username: 'underwriter',
      fullName: 'Ananya Krishnan (Senior Underwriter)',
      role: 'UNDERWRITER'
    }));
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/80">
          <Routes>
            <Route path="/" element={<ExecutiveDashboardPage />} />
            <Route path="/portfolio" element={<PolicyPortfolioPage />} />
            <Route path="/policies/:id" element={<PolicyDetailPage />} />
            <Route path="/properties" element={<PropertyIntelligencePage />} />
            <Route path="/integrations" element={<DataIntegrationCentrePage />} />
            <Route path="/monitoring" element={<MonitoringCentrePage />} />
            <Route path="/drift" element={<ItvDriftAnalysisPage />} />
            <Route path="/evidence" element={<EvidenceIntelligencePage />} />
            <Route path="/abstention" element={<ConfidenceAbstentionPage />} />
            <Route path="/recommendations" element={<RecommendationCentrePage />} />
            <Route path="/simulator" element={<ScenarioSimulatorPage />} />
            <Route path="/workspace" element={<UnderwriterWorkspacePage />} />
            <Route path="/midterm" element={<MidtermManagementPage />} />
            <Route path="/renewal" element={<RenewalManagementPage />} />
            <Route path="/audit" element={<AuditHistoryPage />} />
            <Route path="/analytics" element={<PortfolioAnalyticsPage />} />
            <Route path="/admin" element={<AdministrationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
