const LOG_PREFIX = '[Birthday Service]';

export const logOperation = (operation: string, details?: any) => {
  console.log(`${LOG_PREFIX} ${operation}`, details || '');
};

export const logError = (operation: string, error: any) => {
  console.error(`${LOG_PREFIX} Error in ${operation}:`, error);
};

export const logWarning = (operation: string, message: string) => {
  console.warn(`${LOG_PREFIX} Warning in ${operation}:`, message);
};

export const createOperationLogger = (operation: string) => ({
  start: (details?: any) => logOperation(`Starting ${operation}`, details),
  success: (details?: any) => logOperation(`Successfully completed ${operation}`, details),
  error: (error: any) => logError(operation, error),
  warning: (message: string) => logWarning(operation, message)
});