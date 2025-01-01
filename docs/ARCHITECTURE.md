## Application Architecture

### Directory Structure

```
src/
├── components/
│   ├── birthdays/       # Birthday-related components
│   ├── forms/           # Reusable form components
│   ├── layout/          # Layout components
│   └── shared/          # Shared UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── pages/               # Route components
├── services/           # API and utility services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Components

1. Data Management
   - AuthContext: User authentication state
   - BirthdayContext: Birthday data management
   - QueryClient: API request caching

2. Routing
   - Protected routes
   - Role-based access
   - Navigation guards

3. Form Handling
   - React Hook Form
   - Zod validation
   - Custom form components

4. State Management
   - React Query for server state
   - Context for global state
   - Local state for UI

### Data Flow

1. Component Hierarchy
   - App
     - AuthProvider
       - BirthdayProvider
         - QueryClientProvider
           - Router
             - Layout
               - Pages

2. Data Updates
   - Context updates
   - API calls
   - Local storage sync
   - UI updates

### Performance Considerations

1. Optimization
   - Memoization
   - Lazy loading
   - Code splitting
   - Virtual scrolling

2. Caching
   - API response caching
   - Local storage
   - Memory management