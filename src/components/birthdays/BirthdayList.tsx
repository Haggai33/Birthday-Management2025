import React, { useState, useEffect } from 'react';
import { Share2, Cake, Calendar, RefreshCw, AlertCircle, Check, Clock, Copy, Trash2, Edit2, UserCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Birthday } from '../../types/birthday';
import { CalendarButton } from './CalendarButton';
import { NextBirthdaysPopup } from './NextBirthdaysPopup';
import { SunsetVerificationModal } from './SunsetVerificationModal';
import { DuplicateVerificationModal } from './DuplicateVerificationModal';
import { GenderVerificationModal } from './GenderVerificationModal';
import { useAuth } from '../../context/AuthContext';

interface BirthdayListProps {
  birthdays: Birthday[];
  onEdit: (birthday: Birthday) => void;
  onDelete: (ids: string[]) => Promise<void>;
  onArchive: (ids: string[]) => Promise<void>;
  selectedIds: Set<string>;
  onSelect: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onGenderUpdate: (birthday: Birthday, gender: 'male' | 'female') => void;
}

export function BirthdayList({
  birthdays,
  onEdit,
  onDelete,
  onArchive,
  selectedIds,
  onSelect,
  onSelectAll,
  onGenderUpdate
}: BirthdayListProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [selectedBirthday, setSelectedBirthday] = useState<Birthday | null>(null);
  const [showNextBirthdays, setShowNextBirthdays] = useState(false);

  useEffect(() => {
    console.log('BirthdayList received birthdays:', birthdays);
  }, [birthdays]);

  const handleDelete = async (ids: string[]) => {
    if (!window.confirm(`Are you sure you want to delete ${ids.length} selected birthdays?`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      console.log('BirthdayList: Initiating delete for IDs:', ids);
      await onDelete(ids);
      console.log('BirthdayList: Delete operation completed successfully');
    } catch (error) {
      console.error('BirthdayList: Delete operation failed:', error);
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete birthdays');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNextBirthdayClick = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setShowNextBirthdays(true);
  };

  return (
    <div className="overflow-x-auto">
      {deleteError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {deleteError}
        </div>
      )}

      <div className="flex justify-between items-center mb-4 px-6 py-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedIds.size === birthdays.length && birthdays.length > 0}
            onChange={(e) => onSelectAll(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          {selectedIds.size > 0 && (
            <div className="ml-4 space-x-2">
              <button
                onClick={() => handleDelete(Array.from(selectedIds))}
                className="text-red-600 hover:text-red-900"
              >
                Delete Selected ({selectedIds.size})
              </button>
              <button
                onClick={() => onArchive(Array.from(selectedIds))}
                className="text-gray-600 hover:text-gray-900"
              >
                Archive Selected ({selectedIds.size})
              </button>
            </div>
          )}
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="w-12 px-6 py-3">
              <span className="sr-only">Select</span>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Gregorian Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hebrew Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Next Birthday
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Age
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {birthdays.map((birthday) => (
            <tr key={birthday.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(birthday.id)}
                  onChange={(e) => onSelect(birthday.id, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {birthday.firstName} {birthday.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {format(new Date(birthday.birthDate), 'dd/MM/yyyy')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{birthday.hebrewDate}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNextBirthdayClick(birthday)}
                    className="text-sm text-gray-900 hover:text-indigo-600"
                  >
                    {birthday.nextBirthday 
                      ? format(new Date(birthday.nextBirthday), 'dd/MM/yyyy')
                      : 'Calculating...'}
                  </button>
                  {birthday.nextBirthday && (
                    <CalendarButton birthday={birthday} type="hebrew" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{birthday.age}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(birthday)}
                    className="text-indigo-600 hover:text-indigo-900"
                    title="Edit"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete([birthday.id])}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showNextBirthdays && selectedBirthday && (
        <NextBirthdaysPopup
          birthdays={selectedBirthday.nextBirthdays?.map(date => new Date(date)) || []}
          name={`${selectedBirthday.firstName} ${selectedBirthday.lastName}`}
          onClose={() => {
            setSelectedBirthday(null);
            setShowNextBirthdays(false);
          }}
        />
      )}

      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Deleting birthdays...</p>
          </div>
        </div>
      )}
    </div>
  );
}