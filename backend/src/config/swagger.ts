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