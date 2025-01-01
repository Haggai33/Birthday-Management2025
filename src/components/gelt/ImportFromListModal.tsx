import React from 'react';
import { X } from 'lucide-react';
import { useBirthdays } from '../../context/BirthdayContext';
import { useGelt } from '../../context/GeltContext';
import type { Child } from '../../types/gelt';

interface ImportFromListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImportFromListModal({ isOpen, onClose }: ImportFromListModalProps) {
  const { birthdays } = useBirthdays();
  const { setChildren } = useGelt();

  if (!isOpen) return null;

  const handleImport = () => {
    const children: Child[] = birthdays.map(birthday => {
      const age = new Date().getFullYear() - new Date(birthday.birthDate).getFullYear();
      return {
        id: birthday.id,
        firstName: birthday.firstName,
        lastName: birthday.lastName,
        age
      };
    });

    setChildren(children);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Import from Birthday List</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This will import {birthdays.length} people from your birthday list.
            Their ages will be calculated based on their birth dates.
          </p>

          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">Preview:</h3>
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {birthdays.map(birthday => {
                    const age = new Date().getFullYear() - new Date(birthday.birthDate).getFullYear();
                    return (
                      <tr key={birthday.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {birthday.firstName} {birthday.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {age}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Import List
          </button>
        </div>
      </div>
    </div>
  );
}