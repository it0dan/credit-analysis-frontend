export interface HITLRequest {
  type: 'HITL_REQUIRED';
  request_id: string;
  trace_id: string;
  cpf_masked: string;
  reason: string;
  resume_endpoint: string;
  expires_at: string; // ISO8601
  t1_results: Record<string, unknown>;
  t2_results: Record<string, unknown>;
}

export interface OperatorDecision {
  request_id: string;
  decision: 'approve' | 'reject' | 'escalate';
  justification: string;
  operator_id: string;
}
