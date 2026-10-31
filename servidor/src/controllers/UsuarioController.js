const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

module.exports = {

  // POST /usuarios — cadastro
  async cadastrar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
      }

      const emailExiste = await Usuario.findOne({ where: { email } });
      if (emailExiste) {
        return res.status(400).json({ erro: 'E-mail já cadastrado.' });
      }

      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const usuario = await Usuario.create({
        nome,
        email,
        senha: senhaCriptografada,
      });

      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      });

    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao cadastrar usuário.', detalhe: err.message });
    }
  },

  // POST /login — login e geração do token JWT
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
      }

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      }

      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });

    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao realizar login.', detalhe: err.message });
    }
  },

};