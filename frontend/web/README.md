# SalonEase Web Dashboard

A comprehensive web dashboard for salon owners and administrators to manage their business operations.

## Features

### For Salon Owners:
- **Dashboard Overview**: Key metrics, revenue tracking, booking trends
- **Salon Management**: Create and manage multiple salon locations
- **Booking Management**: View, confirm, cancel, and complete appointments
- **Service Management**: Add, edit, and manage salon services
- **Analytics**: Detailed business insights and performance metrics
- **Settings**: Profile and business configuration

### For Administrators:
- **System Dashboard**: Platform-wide statistics and metrics
- **User Management**: Manage customers, salon owners, and admins
- **Salon Approval**: Review and approve new salon registrations
- **System Analytics**: Platform performance and usage analytics
- **Content Management**: Manage platform settings and configurations

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom SalonEase theme
- **Routing**: React Router v6
- **State Management**: React Context API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- SalonEase backend API running on port 3002

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy and update .env file
cp .env.example .env
```

Update `.env` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:3002/api
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardLayout.tsx
│   └── Sidebar.tsx
├── contexts/           # React contexts for state management
│   └── AuthContext.tsx
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── SalonsPage.tsx
│   ├── BookingsPage.tsx
│   └── LoginPage.tsx
├── services/           # API service layer
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main app component
└── index.tsx           # Entry point
```

## Authentication

The dashboard supports role-based access:

- **Salon Owners**: Can manage their own salons, bookings, and services
- **Administrators**: Have full system access and can manage all users and salons

Only users with `salon_owner` or `admin` roles can access the dashboard.

## API Integration

The dashboard integrates with the SalonEase backend API:

- Authentication endpoints for login/logout
- Salon management endpoints
- Booking management endpoints
- User management endpoints (admin only)
- Analytics and reporting endpoints

## Color Scheme

The dashboard uses the SalonEase brand colors:
- Primary: `#7c4dff` (Purple)
- Secondary: Gray scale for UI elements
- Success: Green for positive actions
- Warning: Yellow for pending states
- Error: Red for negative actions

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Code Style

- TypeScript for type safety
- Functional components with hooks
- TailwindCSS for styling
- Consistent naming conventions

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `build` folder to your web server
3. Configure your web server to serve the React app
4. Ensure the backend API is accessible from your domain

## Contributing

1. Follow the existing code structure and patterns
2. Use TypeScript for all new components
3. Follow TailwindCSS utility-first approach
4. Add proper error handling and loading states
5. Test your changes thoroughly

## Support

For issues and questions, please refer to the main SalonEase project documentation.