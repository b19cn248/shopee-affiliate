import api from './axios';
import {
  VoucherResponse,
  VoucherCreateRequest,
  VoucherUpdateRequest,
  VoucherQueryParams,
  PageResponse,
} from '../types/voucher';

const VOUCHER_BASE_URL = '/v1/vouchers';

export const voucherApi = {
  // Get list of vouchers with pagination and filters
  getVouchers: async (params?: VoucherQueryParams): Promise<PageResponse<VoucherResponse>> => {
    const response = await api.get<PageResponse<VoucherResponse>>(VOUCHER_BASE_URL, { params });
    return response.data;
  },

  // Get single voucher by ID
  getVoucherById: async (id: number): Promise<VoucherResponse> => {
    const response = await api.get<VoucherResponse>(`${VOUCHER_BASE_URL}/${id}`);
    return response.data;
  },

  // Get voucher by code
  getVoucherByCode: async (code: string): Promise<VoucherResponse> => {
    const response = await api.get<VoucherResponse>(`${VOUCHER_BASE_URL}/code/${code}`);
    return response.data;
  },

  // Create new voucher
  createVoucher: async (data: VoucherCreateRequest): Promise<VoucherResponse> => {
    const response = await api.post<VoucherResponse>(VOUCHER_BASE_URL, data);
    return response.data;
  },

  // Update existing voucher
  updateVoucher: async (id: number, data: VoucherUpdateRequest): Promise<VoucherResponse> => {
    const response = await api.put<VoucherResponse>(`${VOUCHER_BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete voucher (soft delete)
  deleteVoucher: async (id: number): Promise<void> => {
    await api.delete(`${VOUCHER_BASE_URL}/${id}`);
  },

  // Restore deleted voucher
  restoreVoucher: async (id: number): Promise<void> => {
    await api.post(`${VOUCHER_BASE_URL}/${id}/restore`);
  },

  // Use voucher (increment used count)
  useVoucher: async (id: number): Promise<VoucherResponse> => {
    const response = await api.post<VoucherResponse>(`${VOUCHER_BASE_URL}/${id}/use`);
    return response.data;
  },
};

export default voucherApi;