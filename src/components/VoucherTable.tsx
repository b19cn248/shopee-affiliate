import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { VoucherResponse } from '../types/voucher';

interface VoucherTableProps {
  vouchers: VoucherResponse[];
  onDelete: (voucher: VoucherResponse) => void;
}

const VoucherTable: React.FC<VoucherTableProps> = ({ vouchers, onDelete }) => {
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'SHOPEE': return 'bg-orange-100 text-orange-800';
      case 'LAZADA': return 'bg-blue-100 text-blue-800';
      case 'TIKTOK': return 'bg-pink-100 text-pink-800';
      case 'TIKI': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'INACTIVE': return 'bg-yellow-100 text-yellow-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDiscountValue = (type: string, value: number) => {
    return type === 'PERCENT' ? `${value}%` : `${value.toLocaleString('vi-VN')}đ`;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã / Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nền tảng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giảm giá
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thời gian
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sử dụng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vouchers.map((voucher) => (
            <tr key={voucher.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{voucher.code}</div>
                  <div className="text-sm text-gray-500">{voucher.title}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPlatformColor(voucher.platform)}`}>
                  {voucher.platform}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDiscountValue(voucher.discount_type, voucher.discount_value)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(voucher.start_at), 'dd/MM/yyyy')}
                </div>
                <div className="text-sm text-gray-500">
                  đến {format(new Date(voucher.end_at), 'dd/MM/yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {voucher.used_count} / {voucher.usage_limit || '∞'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(voucher.status)}`}>
                  {voucher.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  to={`/vouchers/${voucher.id}/edit`}
                  className="text-primary-600 hover:text-primary-900 mr-3"
                >
                  <PencilIcon className="h-5 w-5 inline" />
                </Link>
                <button
                  onClick={() => onDelete(voucher)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5 inline" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VoucherTable;