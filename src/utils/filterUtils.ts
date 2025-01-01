import type { Birthday, BirthdayFilters } from '../types/birthday';

export const filterBirthdays = (birthdays: Birthday[], filters: BirthdayFilters): Birthday[] => {
  return birthdays
    .filter(birthday => {
      const searchLower = filters.searchTerm.toLowerCase();
      const nameLower = `${birthday.firstName} ${birthday.lastName}`.toLowerCase();
      
      const matchesSearch = !filters.searchTerm || nameLower.includes(searchLower);
      const matchesGender = !filters.gender || birthday.gender === filters.gender;
      
      let matchesTimeframe = true;
      if (filters.timeframe && filters.timeframe !== 'all' && birthday.nextBirthday) {
        const nextBirthday = new Date(birthday.nextBirthday);
        const today = new Date();
        const currentMonth = today.getMonth();
        const nextMonth = (currentMonth + 1) % 12;
        const birthdayMonth = nextBirthday.getMonth();

        if (filters.timeframe === 'thisMonth') {
          matchesTimeframe = birthdayMonth === currentMonth;
        } else if (filters.timeframe === 'nextMonth') {
          matchesTimeframe = birthdayMonth === nextMonth;
        }
      }
      
      return matchesSearch && matchesGender && matchesTimeframe;
    })
    .sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'name':
          return order * (`${a.firstName} ${a.lastName}`).localeCompare(`${b.firstName} ${b.lastName}`);
        case 'date':
          return order * (new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime());
        case 'nextBirthday':
          if (!a.nextBirthday) return 1;
          if (!b.nextBirthday) return -1;
          return order * (new Date(a.nextBirthday).getTime() - new Date(b.nextBirthday).getTime());
        case 'age':
          return order * ((a.age || 0) - (b.age || 0));
        default:
          return 0;
      }
    });
};