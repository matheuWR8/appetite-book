const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  // O header chega no formato "Bearer eyJhbG..."
  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({ erro: 'Token em formato inválido.' });
  }

  const token = partes[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Disponibiliza os dados do usuário para os controllers
    req.usuarioId   = decoded.id;
    req.usuarioNome = decoded.nome;

    next();
  } catch (err) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
};