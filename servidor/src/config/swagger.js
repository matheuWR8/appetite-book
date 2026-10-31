const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'APPetite Book API',
      version: '1.0.0',
      description: 'API para cadastro e visualização de receitas culinárias',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // lê os comentários JSDoc das rotas
};

module.exports = swaggerJsdoc(options);