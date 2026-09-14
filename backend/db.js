const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  allowExitOnIdle: true
});

const obtenerPosts = async () => {
  const { rows } = await pool.query('SELECT * FROM posts');
  return rows;
};

const agregarPost = async (titulo, img, descripcion) => {
  const query = 'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [titulo, img, descripcion, 0];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Función para modificar/incrementar likes (Parte II)
const modificarPost = async (id) => {
  const consulta = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(consulta, [id]);
  return rows[0];
};

// Función para eliminar post (Parte II)
const eliminarPost = async (id) => {
  const consulta = 'DELETE FROM posts WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(consulta, [id]);
  return rows[0];
};

module.exports = { obtenerPosts, agregarPost, modificarPost, eliminarPost };