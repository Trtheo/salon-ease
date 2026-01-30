import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SalonEase API',
      version: '1.0.0',
      description: 'Backend API for SalonEase - Online Booking Platform for Barbershops and Beauty Salons',
      contact: {
        name: 'SalonEase Team',
        email: 'support@salonease.com'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3002',
        description: 'Development server'
      }
    ],
    tags: [
      // Customer Workflow
      { name: '1. Customer - Authentication', description: 'Customer registration, login, profile management' },
      { name: '2. Customer - Salon Discovery', description: 'Browse and search salons, location services' },
      { name: '3. Customer - Services & Availability', description: 'View services and check availability' },
      { name: '4. Customer - Bookings', description: 'Create, manage, and track bookings' },
      { name: '5. Customer - Advanced Booking', description: 'Recurring, group bookings, and waitlist' },
      { name: '6. Customer - Payments', description: 'Process payments and view history' },
      { name: '7. Customer - Reviews & Social', description: 'Submit reviews, favorites, referrals, sharing' },
      { name: '8. Customer - Communication', description: 'Messages, video calls, notifications' },
      { name: '9. Customer - File Upload', description: 'Upload profile pictures and files' },
      
      // Salon Owner Workflow
      { name: '10. Salon Owner - Authentication', description: 'Salon owner registration and login' },
      { name: '11. Salon Owner - Salon Setup', description: 'Create and manage salon information' },
      { name: '12. Salon Owner - Services Management', description: 'Add and manage salon services' },
      { name: '13. Salon Owner - Staff & Portfolio', description: 'Manage staff and showcase portfolio' },
      { name: '14. Salon Owner - Booking Management', description: 'View and manage customer bookings' },
      { name: '15. Salon Owner - Reviews Management', description: 'View and respond to customer reviews' },
      { name: '16. Salon Owner - Analytics', description: 'View business analytics and statistics' },
      { name: '17. Salon Owner - File Upload', description: 'Upload salon images and media' },
      
      // Admin Workflow
      { name: '18. Admin - Authentication', description: 'Admin login and access' },
      { name: '19. Admin - User Management', description: 'Manage all users in the system' },
      { name: '20. Admin - Salon Management', description: 'Verify and manage all salons' },
      { name: '21. Admin - System Analytics', description: 'View system-wide analytics and reports' },
      
      // Shared/Utility
      { name: '22. OTP Services', description: 'OTP sending and verification' },
      { name: '23. Search & Filters', description: 'Advanced search and filtering capabilities' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };