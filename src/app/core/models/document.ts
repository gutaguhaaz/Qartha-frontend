
export interface RiskClause {
  clause: string;
  risk_level: 'low' | 'medium' | 'high';
  category: string;
  confidence?: number;
}

export interface Document {
  _id: string;
  filename: string;
  type: string;
  pages: number;
  risk_clauses: RiskClause[];
  created_at: string;
  user_id?: string;
}

export interface DocumentUploadResponse {
  message: string;
  document_id: string;
  filename: string;
  type: string;
  pages: number;
  risk_clauses: RiskClause[];
  created_at: string;
}

export interface ClausePrediction {
  clause_text: string;
  prediction: string;
  confidence: number;
  risk_level: 'low' | 'medium' | 'high';
}

export interface Clause {
  _id: string;
  clause_text: string;
  category: string;
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface ContractTemplate {
  name: string;
  display_name: string;
  description: string;
  required_fields: string[];
}

export interface GeneratedContract {
  message: string;
  contract_id: string;
  filename: string;
  download_url: string;
  generated_at: string;
}

export interface GeneratedClause {
  generated_clause: string;
  clause_type: string;
  tokens_used: number;
  processing_time: number;
}

export interface LegalAgentResponse {
  query: string;
  response: string;
  context_used: boolean;
  processing_time: number;
  gpt_model: string;
}
