const Receita = require('../models/Receita');

module.exports = {

  // GET /receitas — lista todas as receitas
  async listar(req, res) {
    try {
      const receitas = await Receita.findAll({
        order: [['createdAt', 'DESC']],
      });
      return res.json(receitas);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao listar receitas.', detalhe: err.message });
    }
  },

  // GET /receitas/:id — busca uma receita pelo id
  async buscarPorId(req, res) {
    try {
      const receita = await Receita.findByPk(req.params.id);
      if (!receita) {
        return res.status(404).json({ erro: 'Receita não encontrada.' });
      }
      return res.json(receita);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao buscar receita.', detalhe: err.message });
    }
  },

  // POST /receitas — cria nova receita (protegida)
  async criar(req, res) {
    try {
      const { titulo, categoria, ingredientes, preparo, tempo } = req.body;

      if (!titulo || !categoria || !ingredientes || !preparo || !tempo) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
      }

      // req.file é preenchido pelo Multer quando há upload de imagem
      const imagem = req.file ? req.file.filename : null;

      const receita = await Receita.create({
        titulo,
        categoria,
        ingredientes,
        preparo,
        tempo,
        imagem,
        usuario_id: req.usuarioId, // vem do middleware auth
      });

      return res.status(201).json(receita);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao criar receita.', detalhe: err.message });
    }
  },

  // PUT /receitas/:id — atualiza receita (protegida)
  async atualizar(req, res) {
    try {
      const receita = await Receita.findByPk(req.params.id);
      if (!receita) {
        return res.status(404).json({ erro: 'Receita não encontrada.' });
      }

      // Garante que só o dono pode editar
      if (receita.usuario_id !== req.usuarioId) {
        return res.status(403).json({ erro: 'Você não tem permissão para editar esta receita.' });
      }

      const { titulo, categoria, ingredientes, preparo, tempo } = req.body;

      // Se vier nova imagem, substitui; senão mantém a atual
      const imagem = req.file ? req.file.filename : receita.imagem;

      await receita.update({ titulo, categoria, ingredientes, preparo, tempo, imagem });

      return res.json(receita);
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar receita.', detalhe: err.message });
    }
  },

  // DELETE /receitas/:id — exclui receita (protegida)
  async excluir(req, res) {
    try {
      const receita = await Receita.findByPk(req.params.id);
      if (!receita) {
        return res.status(404).json({ erro: 'Receita não encontrada.' });
      }

      // Garante que só o dono pode excluir
      if (receita.usuario_id !== req.usuarioId) {
        return res.status(403).json({ erro: 'Você não tem permissão para excluir esta receita.' });
      }

      await receita.destroy();
      return res.json({ mensagem: 'Receita excluída com sucesso.' });
    } catch (err) {
      return res.status(500).json({ erro: 'Erro ao excluir receita.', detalhe: err.message });
    }
  },

};