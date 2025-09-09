
export interface Device {
  id: string;
  name: string;
  category?: string;
  brand?: string;
  model?: string;
  serial?: string;
  mac?: string;
  site?: string;
  room?: string;
  rack?: string;
  lat?: number;
  lng?: number;
  notes?: string;
  description?: string;
  specifications?: Record<string, any>;
  maintenance_notes?: string;
  tags?: string[];
  qr_url?: string;           // URL del collector
  qr_image_url?: string;     // PNG del QR (300x300)
  files?: string[];
  created_at: string;
  updated_at: string;
}

export interface DeviceFilters {
  skip?: number;
  limit?: number;
  category?: string;
}

export interface Scan {
  id: string;
  device_id: string;
  lat?: number;
  lng?: number;
  timestamp: string;
}
