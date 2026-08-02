import api from './axios';
import type { User } from '../types';

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (fullName: string, email: string, password: string): Promise<User> => {
  const { data } = await api.post('/auth/register', { fullName, email, password });
  return data;
};