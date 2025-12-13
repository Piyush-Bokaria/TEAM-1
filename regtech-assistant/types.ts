export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface DocumentMetadata {
  id: string;
  title: string;
  regulator: string;
  jurisdiction: string;
  date: string;
  status: 'processing' | 'active' | 'archived';
  version: string;
  sector: string;
}

export interface Clause {
  id: string;
  title: string;
  content: string;
  page: number;
  riskLevel: 'high' | 'medium' | 'low';
  tags: string[];
}

export interface DiffSegment {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
  resourceId?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isMandatory: boolean;
  checked: boolean;
}

export interface VectorResult {
  clause_id: string;
  text: string;
  page: number;
  version: string;
  score: number;
  doc_url: string;
}