import React from 'react';
import { X, Copy, Check, Trash2 } from 'lucide-react';
import { Birthday } from '../../types/birthday';

interface DuplicateVerificationModalProps {
  birthday: Birthday;
  onClose: () => void;
  onVerify: () => void;
  onDelete: () => void;
}

export function DuplicateVerificationModal({
  birthday,
  onClose,
  onVerify,
  onDelete
}: DuplicateVerificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Duplicate Entry Detected</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-purple-600">
            <Copy className="h-5 w-5" />
            <p className="font-medium">Possible duplicate entry found</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-md">
            <p className="text-gray-700">
              A person with the same name and birth date already exists in the system:
            </p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>Name: {birthday.firstName} {birthday.lastName}</li>
              <li>Birth Date: {birthday.birthDate}</li>
              <li>Hebrew Date: {birthday.hebrewDate}</li>
            </ul>
          </div>

          <p className="text-gray-600">
            If this is a different person with the same details (e.g., relatives with the same name),
            click "Verify as Unique" to confirm this is a valid entry. Otherwise, you can delete this duplicate entry.
          </p>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Duplicate
            </button>
            <button
              onClick={onVerify}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              <Check className="h-5 w-5 mr-2" />
              Verify as Unique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}