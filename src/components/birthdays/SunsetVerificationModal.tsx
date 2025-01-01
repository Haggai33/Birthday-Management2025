import React, { useState, useEffect } from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { Birthday } from '../../types/birthday';
import { convertGregorianToHebrew } from '../../services/hebcal';

interface SunsetVerificationModalProps {
  birthday: Birthday;
  onClose: () => void;
  onUpdate: (afterSunset: boolean) => void;
}

export function SunsetVerificationModal({
  birthday,
  onClose,
  onUpdate
}: SunsetVerificationModalProps) {
  const [beforeSunsetDate, setBeforeSunsetDate] = useState<string | null>(null);
  const [afterSunsetDate, setAfterSunsetDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHebrewDates = async () => {
      try {
        const [before, after] = await Promise.all([
          convertGregorianToHebrew(new Date(birthday.birthDate), false),
          convertGregorianToHebrew(new Date(birthday.birthDate), true)
        ]);

        setBeforeSunsetDate(before.hebrew);
        setAfterSunsetDate(after.hebrew);
      } catch (error) {
        console.error('Error loading Hebrew dates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHebrewDates();
  }, [birthday.birthDate]);

  const handleUpdate = (afterSunset: boolean) => {
    onUpdate(afterSunset);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Verify Birth Time</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Please verify the Hebrew date for {birthday.firstName} {birthday.lastName}'s birthday:
          </p>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleUpdate(false)}
                className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Sun className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                <p className="font-medium">Before Sunset</p>
                <p className="text-sm text-gray-600 mt-1">{beforeSunsetDate}</p>
              </button>

              <button
                onClick={() => handleUpdate(true)}
                className="p-4 border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Moon className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <p className="font-medium">After Sunset</p>
                <p className="text-sm text-gray-600 mt-1">{afterSunsetDate}</p>
              </button>
            </div>
          )}

          <div className="mt-6 text-sm text-gray-500">
            <p>
              Select the Hebrew date that matches your records or memory.
              This will update the birthday information accordingly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}