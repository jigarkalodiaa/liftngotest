/**
 * User profile — external API (`NEXT_PUBLIC_API_URL`).
 */

import apiClient from '@/api/client';
import { USER_API } from '@/api/endpoints';

export type UserMe = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
};

export async function getCurrentUser(): Promise<UserMe> {
  return apiClient.get<UserMe>(USER_API.me);
}
