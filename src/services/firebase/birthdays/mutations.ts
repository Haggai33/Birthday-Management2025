import { auth } from '../../../config/firebase';
import { verifyBirthdayDocuments, performBatchDelete } from './operations';
import { validateBatchOperation } from './validation';
import { createBirthdayError } from './errors';
import { createOperationLogger } from './logging';

export const deleteBirthdays = async (ids: string[]): Promise<void> => {
  const logger = createOperationLogger('deleteBirthdays');
  logger.start({ ids });
  
  if (!auth.currentUser) {
    throw createBirthdayError('UNAUTHORIZED', 'User must be authenticated to delete birthdays');
  }

  const validationErrors = validateBatchOperation(ids);
  if (validationErrors.length > 0) {
    throw createBirthdayError('VALIDATION_FAILED', validationErrors.join(', '));
  }

  try {
    await verifyBirthdayDocuments(ids);
    await performBatchDelete(ids);
    logger.success();
  } catch (error) {
    logger.error(error);
    throw error instanceof Error 
      ? createBirthdayError('OPERATION_FAILED', error.message)
      : createBirthdayError('OPERATION_FAILED', 'Failed to delete birthdays');
  }
};