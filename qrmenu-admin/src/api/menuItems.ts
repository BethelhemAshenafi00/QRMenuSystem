import api from './axios';
import type { MenuItem } from '../types';

export interface MenuItemPayload {
  name: string;
  description: string;
  price: number;
  image?: File;
  isAvailable: boolean;
  categoryId: number;
}

export const getMenuItems = async (): Promise<MenuItem[]> =>
  (await api.get('/menuitem')).data;

export const createMenuItem = async (
  p: MenuItemPayload
): Promise<MenuItem> => {
  const formData = new FormData();

  formData.append('name', p.name);
  formData.append('description', p.description);
  formData.append('price', String(p.price));
  formData.append('isAvailable', String(p.isAvailable));
  formData.append('categoryId', String(p.categoryId));

  if (p.image) {
    formData.append('image', p.image);
  }

  return (await api.post('/menuitem', formData)).data;
};

export const updateMenuItem = async (
  id: number,
  p: MenuItemPayload
): Promise<MenuItem> => {
  const formData = new FormData();

  formData.append('name', p.name);
  formData.append('description', p.description);
  formData.append('price', String(p.price));
  formData.append('isAvailable', String(p.isAvailable));
  formData.append('categoryId', String(p.categoryId));

  if (p.image) {
    formData.append('image', p.image);
  }

  return (await api.put(`/menuitem/${id}`, formData)).data;
};

export const deleteMenuItem = async (id: number): Promise<void> => {
  await api.delete(`/menuitem/${id}`);
};