import React from 'react';
import { Calendar } from 'lucide-react';
import { Birthday } from '../../types/birthday';
import { format } from 'date-fns';

interface CalendarButtonProps {
  birthday: Birthday;
  type: 'hebrew' | 'gregorian';
}

export function CalendarButton({ birthday, type }: CalendarButtonProps) {
  const createGoogleCalendarLink = () => {
    const date = type === 'hebrew' 
      ? new Date(birthday.nextBirthday || '') 
      : new Date(birthday.birthDate);

    const title = `${birthday.firstName} ${birthday.lastName} | ${birthday.age} | ${
      type === 'hebrew' ? 'יום הולדת עברי' : 'יום הולדת לועזי'
    }`;

    const startDate = format(date, 'yyyyMMdd');
    const endDate = format(date, 'yyyyMMdd');

    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startDate}/${endDate}`,
      details: `${type === 'hebrew' ? birthday.hebrewDate : format(date, 'dd/MM/yyyy')}`,
    });

    window.open(`${baseUrl}?${params.toString()}`, '_blank');
  };

  return (
    <button
      onClick={createGoogleCalendarLink}
      className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
      title={`Add to Calendar (${type})`}
    >
      <Calendar className="h-4 w-4" />
    </button>
  );
}