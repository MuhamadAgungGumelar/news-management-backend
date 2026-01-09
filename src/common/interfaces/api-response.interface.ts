export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
  error?: ErrorResponse;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  code: string;
  details?: any;
}
