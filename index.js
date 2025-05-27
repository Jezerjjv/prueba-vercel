require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para verificar la conexión
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Conexión a la base de datos MySQL establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos MySQL:', error.message);
    return false;
  }
}

// Endpoint de salud
app.get('/salud', async (req, res) => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (isConnected) {
      res.json({ status: 'ok', database: 'conectada' });
    } else {
      res.status(500).json({ status: 'error', database: 'no conectada' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'no conectada', error: error.message });
  }
});

// Endpoint para obtener todas las notas
app.get('/notas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, content, isPublic, attachments, createdAt, updatedAt, ProjectId, UserId FROM Notes ORDER BY createdAt DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las notas:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener las notas', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
}); 