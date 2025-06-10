import express from 'express';
import cors from 'cors';
import {Pool} from 'pg'

const app = express();
app.use(cors())
const port = 3001;


app.use(express.json());

// Connexion PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'openings',
    password: 'monmotdepasse',
    port: 5432,
  });

  app.get('/api/openings', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM openings');
      res.json(result.rows); // On renvoie les résultats directement au client
        } catch (error) {
      console.error('Erreur lors de la récupération des openings', error);
      res.status(500).json({ message: 'Erreur serveur' });
     }
        });
  
app.listen(port,()=>{
    console.log(`🚀 Serveur bd prêt sur le port ${port}`);
});