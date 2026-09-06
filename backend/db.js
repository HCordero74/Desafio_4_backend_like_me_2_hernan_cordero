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

module.exports = { obtenerPosts, agregarPost };