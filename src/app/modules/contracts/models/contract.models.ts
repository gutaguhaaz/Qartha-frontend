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
  field: string;  // Cambiar de 'name' a 'field' para coincidir con el backend
  label: string;  // Agregar label que viene del backend
  type: string;
  required: boolean;
  placeholder?: string;
}

export interface TemplateResponse {
  template: string;
  fields_found: string[];
  total_fields: number;
  template_fields: TemplateField[];
}