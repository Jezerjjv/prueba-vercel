require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000
});

// Función para verificar la conexión
async function checkDatabaseConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    console.log('Configuración:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME
    });
    
    const client = await pool.connect();
    console.log('Conexión a la base de datos establecida correctamente');
    client.release();
    return true;
  } catch (error) {
    console.error('Error detallado de conexión:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return false;
  }
}

app.get('/', async (req, res) => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (isConnected) {
      res.json({ 
        message: 'API corriendo correctamente',
        database: 'Conectada correctamente'
      });
    } else {
      res.status(500).json({ 
        message: 'API corriendo correctamente',
        database: 'Error de conexión',
        error: 'No se pudo establecer conexión con la base de datos'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'API corriendo correctamente',
      database: 'Error de conexión',
      error: error.message
    });
  }
});

app.get('/notas', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, content, "isPublic", attachments, "createdAt", "updatedAt", "ProjectId", "UserId"
      FROM Notes
      ORDER BY "createdAt" DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las notas:', error.message);
    res.status(500).json({ error: 'Error al obtener las notas', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
}); 