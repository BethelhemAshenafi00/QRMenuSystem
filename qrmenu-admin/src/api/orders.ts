import api from './axios';
import type { Order } from '../types';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get('/order');
  return response.data;
};

export const updateOrder = async (
  id: number,
  order: Order
): Promise<Order> => {
  const payload = {
    orderType:
      order.orderType === 'DineIn'
        ? 0
        : 1,

    status: order.status,

    totalAmount: order.totalAmount,

    tableId: order.tableId,
  };

  console.log('Updating order:', id);
  console.log('Update payload:', payload);

  const response = await api.put(
    `/order/${id}`,
    payload
  );

  return response.data;
};

export const deleteOrder = async (
  id: number
): Promise<void> => {
  await api.delete(`/order/${id}`);
};

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
}

export const getDailySales = async (
  date?: string
): Promise<DailySalesReport> => {
  const response = await api.get('/reports/daily-sales', {
    params: date ? { date } : undefined,
  });

  return response.data;
};