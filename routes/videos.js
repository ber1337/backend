import express from 'express';
import pool from '../db.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rota para cadastrar novo vídeo
router.post('/', authMiddleware, async (req, res) => {
  const { influencer, video_link, platform, published_date } = req.body;

  try {
    await pool.query(
      'INSERT INTO videos (influencer, video_link, platform, published_date) VALUES ($1, $2, $3, $4)',
      [influencer, video_link, platform, published_date]
    );
    res.status(201).json({ message: 'Vídeo cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao cadastrar vídeo' });
  }
});

// Rota para buscar vídeos com filtros
router.get('/', authMiddleware, async (req, res) => {
  const { influencer, startDate, endDate } = req.query;

  let query = 'SELECT * FROM videos WHERE 1=1';
  const params = [];

  if (influencer) {
    params.push(influencer);
    query += ` AND influencer = $${params.length}`;
  }
  if (startDate) {
    params.push(startDate);
    query += ` AND published_date >= $${params.length}`;
  }
  if (endDate) {
    params.push(endDate);
    query += ` AND published_date <= $${params.length}`;
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar vídeos' });
  }
});

export default router;
