export interface ContractGenerateRequest {
  tipo_contrato: string;
  campos: { [key: string]: string };
  clausula_extra?: string;
}

export interface Template {
  name: string;
  displayName: string;
  fields?: string[];
}

export interface GPTClauseRequest {
  prompt: string;
}

export interface GPTClauseResponse {
  clause: string;
  source: string; // "gpt" o "simulado"
}

export interface TemplateField {
  field: string;
  label: string;
  type: 'text' | 'date' | 'email' | 'tel' | 'textarea' | 'signature';
  required: boolean;
  placeholder?: string;
  signatureType?: 'canvas' | 'upload' | 'text'; // Para campos de firma
}

export interface TemplateResponse {
  template: string;
  fields_found: string[];
  total_fields: number;
  template_fields: TemplateField[];
}