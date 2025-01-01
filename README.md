# Hebrew Birthday Management System

A comprehensive web application for managing Hebrew and Gregorian birthdays, built with React, TypeScript, and Tailwind CSS.

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Installation Steps
1. Clone the repository:
```bash
git clone https://github.com/your-username/hebrew-birthday-system.git
cd hebrew-birthday-system
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

### Configuration Requirements

1. **Hebrew Calendar API**
   - The system uses the Hebcal API for Hebrew date conversions
   - No API key is required for basic usage
   - Default endpoint: `https://www.hebcal.com/converter`

2. **Local Storage**
   - The application uses browser's localStorage for data persistence
   - No additional database setup required for basic usage
   - Data will persist across sessions in the same browser

3. **Environment Variables**
   - Create a `.env` file in the root directory:
```env
VITE_APP_TITLE="Hebrew Birthday System"
VITE_APP_VERSION="1.0.0"
```

### Development Guidelines

1. **Code Structure**
   - `/src/components` - React components
   - `/src/context` - React context providers
   - `/src/services` - API and utility services
   - `/src/types` - TypeScript type definitions
   - `/src/pages` - Page components

2. **Testing**
```bash
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
```

3. **Building for Production**
```bash
npm run build
```

[Previous content remains the same...]