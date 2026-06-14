export type ReasoningChunkKind = 'thought' | 'tool_call' | 'result' | 'conclusion';

export interface ReasoningChunk {
  text_human: string;
  text_debug: string;
  kind: ReasoningChunkKind;
  timestamp_ms: number;
}

export interface AgentCall {
  agent: string;
  phase: 'T1' | 'T2' | 'T3';
  status: 'success' | 'fail' | 'timeout' | 'error' | 'in_progress' | 'awaiting_human';
  latency_ms: number;
  span_id?: string;
  reasoning?: ReasoningChunk[];
}

export interface AgentTrajectory {
  request_id: string;
  trace_id: string;
  phases: AgentCall[];
  finops: {
    estimated_cost_brl: number;
    tokens_used?: number;
  };
}
