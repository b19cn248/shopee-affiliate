import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import voucherApi from '../api/voucher';
import { VoucherCreateRequest, VoucherUpdateRequest, Platform, DiscountType, VoucherStatus } from '../types/voucher';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const voucherSchema = z.object({
  code: z.string().min(1, 'Mã voucher là bắt buộc').max(64, 'Mã voucher tối đa 64 ký tự'),
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề tối đa 200 ký tự'),
  description: z.string().optional(),
  platform: z.nativeEnum({
    SHOPEE: 'SHOPEE',
    LAZADA: 'LAZADA',
    TIKTOK: 'TIKTOK',
    TIKI: 'TIKI',
    OTHER: 'OTHER'
  }),
  discount_type: z.nativeEnum({
    PERCENT: 'PERCENT',
    FIXED: 'FIXED'
  }),
  discount_value: z.number().min(0, 'Giá trị giảm giá phải >= 0'),
  min_order_amount: z.number().min(0, 'Giá trị đơn hàng tối thiểu phải >= 0'),
  start_at: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  end_at: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  usage_limit: z.number().optional(),
  tags: z.array(z.string()).optional(),
  status: z.nativeEnum({
    DRAFT: 'DRAFT',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    EXPIRED: 'EXPIRED'
  }).optional(),
});

type VoucherFormData = z.infer<typeof voucherSchema>;

const VoucherFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      platform: 'SHOPEE',
      discount_type: 'PERCENT',
      discount_value: 0,
      min_order_amount: 0,
      tags: [],
    },
  });

  // Fetch voucher if editing
  const { data: voucher, isLoading } = useQuery({
    queryKey: ['voucher', id],
    queryFn: () => voucherApi.getVoucherById(Number(id)),
    enabled: isEdit,
  });

  // Create/Update mutations
  const createMutation = useMutation({
    mutationFn: (data: VoucherCreateRequest) => voucherApi.createVoucher(data),
    onSuccess: () => {
      navigate('/vouchers');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: VoucherUpdateRequest) => voucherApi.updateVoucher(Number(id), data),
    onSuccess: () => {
      navigate('/vouchers');
    },
  });

  useEffect(() => {
    if (voucher) {
      reset({
        ...voucher,
        start_at: voucher.start_at.slice(0, 16),
        end_at: voucher.end_at.slice(0, 16),
      });
    }
  }, [voucher, reset]);

  const onSubmit = (data: VoucherFormData) => {
    if (isEdit) {
      const { code, ...updateData } = data;
      updateMutation.mutate(updateData as VoucherUpdateRequest);
    } else {
      createMutation.mutate(data as VoucherCreateRequest);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Chỉnh sửa Voucher' : 'Tạo Voucher mới'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã Voucher <span className="text-red-500">*</span>
            </label>
            <input
              {...register('code')}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Platform and Discount Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nền tảng <span className="text-red-500">*</span>
              </label>
              <select
                {...register('platform')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="SHOPEE">Shopee</option>
                <option value="LAZADA">Lazada</option>
                <option value="TIKTOK">TikTok</option>
                <option value="TIKI">Tiki</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại giảm giá <span className="text-red-500">*</span>
              </label>
              <select
                {...register('discount_type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="PERCENT">Phần trăm (%)</option>
                <option value="FIXED">Số tiền cố định</option>
              </select>
            </div>
          </div>

          {/* Discount Value and Min Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá trị giảm giá <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('discount_value', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.discount_value && (
                <p className="mt-1 text-sm text-red-600">{errors.discount_value.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn hàng tối thiểu <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('min_order_amount', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.min_order_amount && (
                <p className="mt-1 text-sm text-red-600">{errors.min_order_amount.message}</p>
              )}
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register('start_at')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.start_at && (
                <p className="mt-1 text-sm text-red-600">{errors.start_at.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                {...register('end_at')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              {errors.end_at && (
                <p className="mt-1 text-sm text-red-600">{errors.end_at.message}</p>
              )}
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới hạn sử dụng
            </label>
            <input
              type="number"
              {...register('usage_limit', { valueAsNumber: true })}
              placeholder="Để trống nếu không giới hạn"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Status (only for edit) */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="DRAFT">Nháp</option>
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
                <option value="EXPIRED">Hết hạn</option>
              </select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/vouchers')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherFormPage;