// ReLife API Client — Connects to FastAPI Backend via /api/v1

import type {
  Asset,
  AssetDemandMatchesResponse,
  AssetPassportResponse,
  ApprovalDecisionRequest,
  ApprovalDecisionResponse,
  DemandItem,
  DemandCandidatesResponse,
  EvaluationResponse,
  ImpactSummaryResponse,
  RecommendationItem,
  DecisionObjective,
} from '../types/api';

const API_BASE = '/api/v1';

class APIError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    let data;
    try {
      data = await response.json();
      if (data && data.detail) {
        errorDetail = data.detail;
      }
    } catch {
      // Non-JSON response
    }
    throw new APIError(errorDetail, response.status, data);
  }

  return response.json();
}

export const api = {
  // Assets
  async getAssets(params?: { status?: string; department?: string; skip?: number; limit?: number }): Promise<Asset[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.department) query.append('department', params.department);
    if (params?.skip) query.append('skip', String(params.skip));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<Asset[]>(`/assets${qs}`);
  },

  async getAsset(assetId: string): Promise<Asset> {
    return request<Asset>(`/assets/${assetId}`);
  },

  async seedSimulatedData(): Promise<{ message: string; seeded_count: number }> {
    return request<{ message: string; seeded_count: number }>('/assets/seed-simulated', {
      method: 'POST',
    });
  },

  // Decision & Scenario Intelligence
  async evaluateAsset(assetId: string, decisionObjective: DecisionObjective = 'BALANCED'): Promise<EvaluationResponse> {
    return request<EvaluationResponse>('/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        asset_id: assetId,
        decision_objective: decisionObjective,
      }),
    });
  },

  // Demand Matching
  async getDemands(params?: { department?: string; priority?: string }): Promise<DemandItem[]> {
    const query = new URLSearchParams();
    if (params?.department) query.append('department', params.department);
    if (params?.priority) query.append('priority', params.priority);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<DemandItem[]>(`/demand${qs}`);
  },

  async getDemandMatches(assetId: string): Promise<AssetDemandMatchesResponse> {
    return request<AssetDemandMatchesResponse>(`/demand/matches/${assetId}`);
  },

  async getDemandCandidates(demandId: string): Promise<DemandCandidatesResponse> {
    return request<DemandCandidatesResponse>(`/demand/${demandId}/candidates`);
  },


  // Approvals & Human in the Loop
  async getApprovals(status?: string): Promise<RecommendationItem[]> {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<RecommendationItem[]>(`/approvals${qs}`);
  },

  async decideApproval(recommendationId: string, payload: ApprovalDecisionRequest): Promise<ApprovalDecisionResponse> {
    return request<ApprovalDecisionResponse>(`/approvals/${recommendationId}/decide`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Circular Passport (Audit Trail)
  async getPassport(assetId: string): Promise<AssetPassportResponse> {
    return request<AssetPassportResponse>(`/passport/${assetId}`);
  },

  // Portfolio Impact Center
  async getImpactSummary(): Promise<ImpactSummaryResponse> {
    return request<ImpactSummaryResponse>('/impact/summary');
  },
};
