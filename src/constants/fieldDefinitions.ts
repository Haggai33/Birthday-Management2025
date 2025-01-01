export const BIRTHDAY_FIELDS = {
  FIRST_NAME: {
    id: 'firstName',
    label: 'First Name',
    required: true,
    type: 'text',
    validation: {
      required: 'First name is required',
      minLength: {
        value: 2,
        message: 'First name must be at least 2 characters'
      }
    }
  },
  LAST_NAME: {
    id: 'lastName',
    label: 'Last Name',
    required: true,
    type: 'text',
    validation: {
      required: 'Last name is required',
      minLength: {
        value: 2,
        message: 'Last name must be at least 2 characters'
      }
    }
  },
  BIRTH_DATE: {
    id: 'birthDate',
    label: 'Birth Date',
    required: true,
    type: 'date',
    validation: {
      required: 'Birth date is required'
    }
  },
  AFTER_SUNSET: {
    id: 'afterSunset',
    label: 'Born after sunset',
    type: 'checkbox',
    description: 'Check if the person was born after sunset'
  },
  GENDER: {
    id: 'gender',
    label: 'Gender',
    required: true,
    type: 'radio',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    validation: {
      required: 'Gender is required'
    }
  }
};

export const CSV_REQUIRED_HEADERS = [
  'First Name',
  'Last Name',
  'Birthday',
  'After Sunset',
  'Gender'
];

export const FILTER_OPTIONS = {
  TIMEFRAME: [
    { value: 'all', label: 'All Time' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'nextMonth', label: 'Next Month' }
  ],
  GENDER: [
    { value: '', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ],
  SORT: [
    { value: 'nextBirthday-asc', label: 'Next Birthday (Soonest)' },
    { value: 'nextBirthday-desc', label: 'Next Birthday (Latest)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'date-asc', label: 'Birthday (Oldest)' },
    { value: 'date-desc', label: 'Birthday (Newest)' },
    { value: 'age-asc', label: 'Age (Youngest)' },
    { value: 'age-desc', label: 'Age (Oldest)' }
  ]
};