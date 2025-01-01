import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface NextBirthdaysPopupProps {
  birthdays: Date[];
  onClose: () => void;
  name: string;
}

export function NextBirthdaysPopup({ birthdays, onClose, name }: NextBirthdaysPopupProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Next 5 Birthdays for {name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {birthdays.map((date, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <span className="font-medium">
                {format(date, 'dd/MM/yyyy')}
              </span>
              <span className="text-gray-500">
                {index === 0 ? 'Next' : `+${index + 1} year${index > 0 ? 's' : ''}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}