import api from './axios';
import type { Table } from '../types';

export const getTables   = async (): Promise<Table[]> => (await api.get('/table')).data;
export const createTable = async (tableNumber: string, qrCodeUrl: string): Promise<Table> => (await api.post('/table', { tableNumber, qrCodeUrl })).data;
export const updateTable = async (id: number, tableNumber: string, qrCodeUrl: string): Promise<Table> => (await api.put(`/table/${id}`, { tableNumber, qrCodeUrl })).data;
export const deleteTable = async (id: number): Promise<void> => { await api.delete(`/table/${id}`); };