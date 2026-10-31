require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./models/Usuario');
require('./models/Receita');

const usuarioRoutes = require('./routes/usuarioRoutes');
const receitaRoutes = require('./routes/receitaRoutes');
app.use('/usuarios', usuarioRoutes);
app.use('/receitas', receitaRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco de dados sincronizado.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Swagger disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar no banco:', err);
  });