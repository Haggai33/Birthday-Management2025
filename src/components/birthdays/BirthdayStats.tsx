import React from 'react';
import { Birthday } from '../../types/birthday';
import { Users, Gift, Calculator, Calendar } from 'lucide-react';

interface BirthdayStatsProps {
  birthdays: Birthday[];
}

export function BirthdayStats({ birthdays }: BirthdayStatsProps) {
  const calculateStats = () => {
    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14);

    const upcomingBirthdays = birthdays.filter(birthday => {
      if (!birthday.nextBirthday) return false;
      const nextBirthday = new Date(birthday.nextBirthday);
      return nextBirthday >= today && nextBirthday <= twoWeeksFromNow;
    });

    // Filter out birthdays without age before calculating average
    const validAges = birthdays.filter(b => typeof b.age === 'number' && !isNaN(b.age));
    const averageAge = validAges.length > 0
      ? Math.round(validAges.reduce((sum, b) => sum + b.age, 0) / validAges.length)
      : 0;

    const thisMonthBirthdays = birthdays.filter(birthday => {
      if (!birthday.nextBirthday) return false;
      const nextBirthday = new Date(birthday.nextBirthday);
      return nextBirthday.getMonth() === today.getMonth();
    });

    return {
      total: birthdays.length,
      upcoming: upcomingBirthdays.length,
      average: averageAge,
      thisMonth: thisMonthBirthdays.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-indigo-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Total People</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <Gift className="h-6 w-6 text-green-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Upcoming Birthdays</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.upcoming}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <Calculator className="h-6 w-6 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">Average Age</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.average}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <Calendar className="h-6 w-6 text-purple-600" />
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.thisMonth}</p>
          </div>
        </div>
      </div>
    </div>
  );
}