import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import voucherApi from '../api/voucher';
import { VoucherResponse, VoucherQueryParams, Platform, VoucherStatus } from '../types/voucher';
import VoucherFilters from '../components/VoucherFilters';
import VoucherTable from '../components/VoucherTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

const VoucherListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<VoucherQueryParams>({
    page: 0,
    size: 20,
    sort: 'created_at,desc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; voucher?: VoucherResponse }>({
    show: false,
  });

  const queryClient = useQueryClient();

  // Fetch vouchers query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vouchers', filters],
    queryFn: () => voucherApi.getVouchers(filters),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => voucherApi.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      setDeleteConfirm({ show: false });
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, q: searchQuery, page: 0 });
  };

  const handleFilterChange = (newFilters: Partial<VoucherQueryParams>) => {
    setFilters({ ...filters, ...newFilters, page: 0 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleDelete = (voucher: VoucherResponse) => {
    setDeleteConfirm({ show: true, voucher });
  };

  const confirmDelete = () => {
    if (deleteConfirm.voucher) {
      deleteMutation.mutate(deleteConfirm.voucher.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Voucher</h1>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Làm mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo mã hoặc tiêu đề..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Bộ lọc
          </button>
        </form>

        {showFilters && (
          <VoucherFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        )}
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message="Không thể tải danh sách voucher" />
      ) : data ? (
        <>
          <VoucherTable
            vouchers={data.content}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={data.page_number}
            totalPages={data.total_pages}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false })}
        onConfirm={confirmDelete}
        title="Xóa Voucher"
        message={`Bạn có chắc chắn muốn xóa voucher "${deleteConfirm.voucher?.title}"?`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default VoucherListPage;