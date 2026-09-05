import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/layout/AppLayout';
import { CommandCenter } from './pages/CommandCenter';
import { AssetIntelligence } from './pages/AssetIntelligence';
import { ScenarioLab } from './pages/ScenarioLab';
import { DemandMatching } from './pages/DemandMatching';
import { ApprovalCenter } from './pages/ApprovalCenter';
import { CircularPassport } from './pages/CircularPassport';
import { ImpactCenter } from './pages/ImpactCenter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<CommandCenter />} />
            <Route path="assets" element={<AssetIntelligence />} />
            <Route path="assets/:id" element={<AssetIntelligence />} />
            <Route path="scenarios" element={<ScenarioLab />} />
            <Route path="demand" element={<DemandMatching />} />
            <Route path="approvals" element={<ApprovalCenter />} />
            <Route path="passport" element={<CircularPassport />} />
            <Route path="passport/:id" element={<CircularPassport />} />
            <Route path="impact" element={<ImpactCenter />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
