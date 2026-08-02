import api from './axios';
import type { Category } from '../types';

export const getCategories  = async (): Promise<Category[]> => (await api.get('/category')).data;
export const createCategory = async (name: string): Promise<Category> => (await api.post('/category', { name })).data;
export const updateCategory = async (id: number, name: string): Promise<Category> => (await api.put(`/category/${id}`, { name })).data;
export const deleteCategory = async (id: number): Promise<void> => { await api.delete(`/category/${id}`); };
