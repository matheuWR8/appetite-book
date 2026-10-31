const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const ReceitaController = require('../controllers/ReceitaController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `receita_${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Receitas
 *   description: Gerenciamento de receitas culinárias
 */

/**
 * @swagger
 * /receitas:
 *   get:
 *     summary: Lista todas as receitas
 *     tags: [Receitas]
 *     responses:
 *       200:
 *         description: Lista de receitas retornada com sucesso
 */
router.get('/', ReceitaController.listar);

/**
 * @swagger
 * /receitas/{id}:
 *   get:
 *     summary: Busca uma receita pelo ID
 *     tags: [Receitas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da receita
 *     responses:
 *       200:
 *         description: Receita encontrada
 *       404:
 *         description: Receita não encontrada
 */
router.get('/:id', ReceitaController.buscarPorId);

/**
 * @swagger
 * /receitas:
 *   post:
 *     summary: Cria uma nova receita
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [titulo, categoria, ingredientes, preparo, tempo]
 *             properties:
 *               titulo:
 *                 type: string
 *               categoria:
 *                 type: string
 *               ingredientes:
 *                 type: string
 *               preparo:
 *                 type: string
 *               tempo:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Receita criada com sucesso
 *       401:
 *         description: Token não fornecido ou inválido
 */
router.post('/', auth, upload.single('imagem'), ReceitaController.criar);

/**
 * @swagger
 * /receitas/{id}:
 *   put:
 *     summary: Atualiza uma receita existente
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               categoria:
 *                 type: string
 *               ingredientes:
 *                 type: string
 *               preparo:
 *                 type: string
 *               tempo:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Receita atualizada com sucesso
 *       403:
 *         description: Sem permissão para editar esta receita
 *       404:
 *         description: Receita não encontrada
 */
router.put('/:id', auth, upload.single('imagem'), ReceitaController.atualizar);

/**
 * @swagger
 * /receitas/{id}:
 *   delete:
 *     summary: Exclui uma receita
 *     tags: [Receitas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Receita excluída com sucesso
 *       403:
 *         description: Sem permissão para excluir esta receita
 *       404:
 *         description: Receita não encontrada
 */
router.delete('/:id', auth, ReceitaController.excluir);

module.exports = router;