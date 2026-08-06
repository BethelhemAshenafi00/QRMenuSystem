import api from "./axios";

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  completedOrders: number;
  cancelledOrders: number;
}

export const getDailySales = async (
  date?: string,
): Promise<DailySalesReport> => {
  const response = await api.get("/reports/daily-sales", {
    params: date ? { date } : undefined,
  });

  return response.data;
};
