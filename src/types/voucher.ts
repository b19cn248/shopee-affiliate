export type Platform = 'SHOPEE' | 'LAZADA' | 'TIKTOK' | 'TIKI' | 'OTHER';
export type DiscountType = 'PERCENT' | 'FIXED';
export type VoucherStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export interface VoucherResponse {
  id: number;
  code: string;
  title: string;
  description?: string;
  platform: Platform;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  start_at: string;
  end_at: string;
  usage_limit?: number;
  used_count: number;
  status: VoucherStatus;
  tags?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  is_active: boolean;
  is_expired: boolean;
}

export interface VoucherCreateRequest {
  code: string;
  title: string;
  description?: string;
  platform: Platform;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  start_at: string;
  end_at: string;
  usage_limit?: number;
  tags?: string[];
}

export interface VoucherUpdateRequest {
  title?: string;
  description?: string;
  platform?: Platform;
  discount_type?: DiscountType;
  discount_value?: number;
  min_order_amount?: number;
  start_at?: string;
  end_at?: string;
  usage_limit?: number;
  tags?: string[];
  status?: VoucherStatus;
}

export interface VoucherQueryParams {
  status?: VoucherStatus;
  platform?: Platform;
  q?: string;
  active_now?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PageResponse<T> {
  content: T[];
  page_number: number;
  page_size: number;
  total_elements: number;
  total_pages: number;
  last: boolean;
  first: boolean;
}

export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string>;
  timestamp: string;
  path: string;
  trace_id: string;
}