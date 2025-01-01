import React from 'react';
import { X, UserCircle2, Users } from 'lucide-react';
import { Birthday } from '../../types/birthday';

interface GenderVerificationModalProps {
  birthday: Birthday;
  onClose: () => void;
  onUpdate: (gender: 'male' | 'female') => void;
}

export function GenderVerificationModal({
  birthday,
  onClose,
  onUpdate
}: GenderVerificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Verify Gender</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Please verify the gender for {birthday.firstName} {birthday.lastName}:
          </p>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onUpdate('male')}
              className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <UserCircle2 className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <p className="font-medium">Male</p>
            </button>

            <button
              onClick={() => onUpdate('female')}
              className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Users className="h-8 w-8 mx-auto text-pink-500 mb-2" />
              <p className="font-medium">Female</p>
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Select the appropriate gender for this person.
              This will update the birthday information accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}