// routes/openings.js
import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Connexion PostgreSQL avec variable d'environnement
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Route GET /api/openings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM openings');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des openings', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
