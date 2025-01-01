export class BirthdayOperationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BirthdayOperationError';
  }
}

export const BirthdayErrors = {
  NOT_FOUND: 'BIRTHDAY_NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  OPERATION_FAILED: 'OPERATION_FAILED',
  BATCH_OPERATION_FAILED: 'BATCH_OPERATION_FAILED'
} as const;

export const createBirthdayError = (code: keyof typeof BirthdayErrors, message: string) => {
  return new BirthdayOperationError(message, BirthdayErrors[code]);
};