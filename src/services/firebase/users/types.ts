import type { User } from '../../../types/auth';

export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface UserProfile extends User {
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}