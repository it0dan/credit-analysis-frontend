'use client';

import type { CreditAnalysisStatus } from '@repo/types';

const STORAGE_KEY = 'dan:analyses';
const MAX_ENTRIES = 50;

export interface StoredAnalysis {
  request_id: string;
  cpf_masked: string;
  amount_brl: number;
  created_at: string;
  final_verdict?: 'pre_approved' | 'approved' | 'rejected' | 'hitl_required' | null;
  last_status?: CreditAnalysisStatus;
  last_updated_at?: string;
}

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 11) return '***.***.***-**';
  return `***.${digits.slice(3, 6)}.${digits.slice(6, 9)}-**`;
}

function readAll(): StoredAnalysis[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is StoredAnalysis => Boolean(item?.request_id && item?.created_at));
  } catch {
    return [];
  }
}

function writeAll(items: StoredAnalysis[]) {
  if (!canUseStorage()) return;
  const sorted = [...items].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted.slice(0, MAX_ENTRIES)));
}

export function addAnalysis(entry: Omit<StoredAnalysis, 'created_at'>): void {
  const now = new Date().toISOString();
  const current = readAll().filter((item) => item.request_id !== entry.request_id);
  writeAll([
    {
      ...entry,
      cpf_masked: maskCpf(entry.cpf_masked),
      final_verdict: entry.final_verdict ?? null,
      created_at: now,
      last_updated_at: now,
    },
    ...current,
  ]);
}

export function updateAnalysis(request_id: string, patch: Partial<StoredAnalysis>): void {
  const current = readAll();
  const index = current.findIndex((item) => item.request_id === request_id);
  if (index < 0) return;
  const existing = current[index];
  if (!existing) return;
  const next = [...current];
  next[index] = {
    ...existing,
    ...patch,
    request_id: existing.request_id,
    amount_brl: patch.amount_brl ?? existing.amount_brl,
    created_at: existing.created_at,
    cpf_masked: patch.cpf_masked ? maskCpf(patch.cpf_masked) : existing.cpf_masked,
    last_updated_at: new Date().toISOString(),
  };
  writeAll(next);
}

export function listAnalyses(): StoredAnalysis[] {
  return readAll().sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
}

export function getAnalysis(request_id: string): StoredAnalysis | null {
  return readAll().find((item) => item.request_id === request_id) ?? null;
}
