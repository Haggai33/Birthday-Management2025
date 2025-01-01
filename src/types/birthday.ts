export interface Birthday {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  afterSunset?: boolean;
  needsSunsetVerification?: boolean;
  needsGenderVerification?: boolean;
  gender: 'male' | 'female' | 'unknown';
  hebrewDate?: string;
  nextBirthday?: string;
  nextBirthdays?: string[];
  age: number;
  archived: boolean;
  isDuplicate?: boolean;
  duplicateVerified?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BirthdayFilters {
  searchTerm: string;
  gender?: 'male' | 'female' | 'unknown';
  timeframe?: 'all' | 'thisMonth' | 'nextMonth';
  sortBy: 'name' | 'date' | 'age' | 'nextBirthday';
  sortOrder: 'asc' | 'desc';
}

export type NewBirthday = Pick<
  Birthday,
  'firstName' | 'lastName' | 'birthDate' | 'afterSunset' | 'gender'
>;