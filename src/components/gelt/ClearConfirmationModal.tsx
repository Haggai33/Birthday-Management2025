import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useGelt } from '../../context/GeltContext';

interface ClearConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClearConfirmationModal({
  isOpen,
  onClose,
}: ClearConfirmationModalProps) {
  const { resetToDefaults, calculation, customGroupSettings } = useGelt();

  if (!isOpen) return null;

  const handleClear = () => {
    resetToDefaults();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Clear All Data
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          {/* Warning message */}
          <p className="text-gray-600 mb-4">
            This will reset all settings and data to their default values. This
            action cannot be undone.
          </p>

          {/* Current state */}
          {(calculation.totalBudget > 0 || customGroupSettings) && (
            <div className="bg-yellow-50 rounded-md p-3 mb-4">
              <p className="text-sm font-medium text-yellow-800">
                Current State:
              </p>
              <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                {calculation.totalBudget > 0 && (
                  <li>
                    • Active budget: ₪{calculation.totalBudget.toLocaleString()}
                  </li>
                )}
                {customGroupSettings && (
                  <li>• Custom age group settings configured</li>
                )}
              </ul>
            </div>
          )}

          {/* What will be reset */}
          <div className="bg-gray-50 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              The following will be reset:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>All imported children data</li>
              <li>
                Budget configuration:
                <ul className="list-inside ml-4 mt-1">
                  <li>• Number of participants</li>
                  <li>• Amount per participant</li>
                  <li>• Allowed overflow percentage</li>
                </ul>
              </li>
              <li>
                Age group settings:
                <ul className="list-inside ml-4 mt-1">
                  <li>• Ages 18-21: ₪40 per child</li>
                  <li>• Ages 13-17: ₪30 per child</li>
                  <li>• Ages 10-12: ₪20 per child</li>
                  <li>• Ages 7-9: ₪10 per child</li>
                  <li>• Ages 3-6: ₪5 per child</li>
                  <li>• Ages 0-2: ₪0 per child</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
