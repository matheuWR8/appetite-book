const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Receita = sequelize.define('Receita', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredientes: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  preparo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tempo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagem: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id',
    },
  },
});

Receita.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'autor' });
Usuario.hasMany(Receita, { foreignKey: 'usuario_id', as: 'receitas' });

module.exports = Receita;