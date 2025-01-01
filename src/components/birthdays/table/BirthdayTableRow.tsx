```typescript
import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';
import { Birthday } from '../../../types/birthday';
import { CalendarButton } from '../CalendarButton';

interface BirthdayTableRowProps {
  birthday: Birthday;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onNextBirthdayClick: () => void;
}

export function BirthdayTableRow({
  birthday,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onNextBirthdayClick
}: BirthdayTableRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
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
            onClick={onNextBirthdayClick}
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
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900"
            title="Edit"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
```