## Hebrew Birthday Management System Requirements

### Core Features

1. Birthday Management
   - Add new birthdays
   - Edit existing birthdays
   - Delete birthdays
   - Archive/Restore birthdays
   - Verify duplicate entries
   - Handle sunset verification
   - Gender verification

2. Date Handling
   - Convert between Gregorian and Hebrew dates
   - Calculate next Hebrew birthdays
   - Handle after-sunset births
   - Calculate Hebrew age

3. Data Import/Export
   - CSV import with validation
   - CSV export with all details
   - WhatsApp message formatting
   - Google Calendar integration

4. User Interface
   - Dashboard with statistics
   - Birthday list with filters
   - Birthday cards with status indicators
   - Modal dialogs for verifications
   - Responsive design

### Data Structure

1. Birthday Fields:
   - First Name (required)
   - Last Name (required)
   - Birth Date (required)
   - After Sunset (boolean)
   - Gender (male/female)
   - Hebrew Date (calculated)
   - Next Birthday (calculated)
   - Age (calculated)
   - Archive Status
   - Verification Flags

2. Filter Options:
   - Search by name
   - Filter by gender
   - Filter by timeframe
   - Sort by multiple criteria

### Visual Elements

1. Status Indicators:
   - Upcoming birthdays (yellow background)
   - Needs sunset verification (orange background)
   - Possible duplicate (purple background)
   - Verified duplicate (checkmark)

2. UI Components:
   - Navigation bar
   - Statistics cards
   - Filter panel
   - Birthday list/grid
   - Modal dialogs
   - Form inputs
   - Action buttons

### User Roles

1. Admin Features:
   - Full CRUD operations
   - Access to verification tools
   - Import/Export capabilities
   - User management

2. Regular User Features:
   - View birthdays
   - Basic filtering
   - Export to calendar

### Integration Requirements

1. External APIs:
   - Hebcal API for date conversion
   - Google Calendar API
   - WhatsApp sharing

2. Data Storage:
   - Local storage for persistence
   - Backup/restore functionality

### Styling Guidelines

1. Color Scheme:
   - Primary: Indigo (#4F46E5)
   - Secondary: Gray (#6B7280)
   - Success: Green (#10B981)
   - Warning: Yellow (#FBBF24)
   - Error: Red (#EF4444)

2. Typography:
   - Font: System UI
   - Headings: Bold, larger sizes
   - Body: Regular weight
   - Hebrew text support

3. Layout:
   - Responsive grid system
   - Card-based design
   - Modal overlays
   - Consistent spacing
   - Mobile-first approach