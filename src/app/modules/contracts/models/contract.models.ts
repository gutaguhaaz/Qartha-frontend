export interface ContractGenerateRequest {
  tipo_contrato: string;
  campos: { [key: string]: string };
  clausula_extra?: string;
}

export interface Template {
  name: string;
  displayName: string;
  fields: string[];
}

export interface GPTClauseRequest {
  prompt: string;
}

export interface GPTClauseResponse {
  clause: string;
  source: string; // "gpt" o "simulado"
}

export interface TemplateField {
  name: string;
  type: string;
  required: boolean;
  placeholder?: string;
}