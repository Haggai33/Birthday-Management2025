import { Birthday } from '../../../types/birthday';

export interface BirthdayDocument extends Omit<Birthday, 'nextBirthday' | 'nextBirthdays' | 'hebrewDate'> {
  createdAt: Date;
  updatedAt: Date;
  archived: boolean;
  createdBy: string;
}

export interface BirthdayOperation {
  success: boolean;
  error?: string;
}

export interface BatchOperationResult {
  success: boolean;
  successCount: number;
  failedIds: string[];
  errors: string[];
}