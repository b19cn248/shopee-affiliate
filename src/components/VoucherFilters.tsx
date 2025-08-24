import React from 'react';
import { VoucherQueryParams, Platform, VoucherStatus } from '../types/voucher';

interface VoucherFiltersProps {
  filters: VoucherQueryParams;
  onFilterChange: (filters: Partial<VoucherQueryParams>) => void;
}

const VoucherFilters: React.FC<VoucherFiltersProps> = ({ filters, onFilterChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nền tảng
        </label>
        <select
          value={filters.platform || ''}
          onChange={(e) => onFilterChange({ platform: e.target.value as Platform || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tất cả</option>
          <option value="SHOPEE">Shopee</option>
          <option value="LAZADA">Lazada</option>
          <option value="TIKTOK">TikTok</option>
          <option value="TIKI">Tiki</option>
          <option value="OTHER">Khác</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trạng thái
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value as VoucherStatus || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Tất cả</option>
          <option value="DRAFT">Nháp</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
          <option value="EXPIRED">Hết hạn</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chỉ hiển thị đang hoạt động
        </label>
        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={filters.active_now || false}
              onChange={(e) => onFilterChange({ active_now: e.target.checked || undefined })}
              className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Chỉ voucher đang hoạt động</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VoucherFilters;