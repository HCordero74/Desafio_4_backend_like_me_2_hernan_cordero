const express = require('express');
const cors = require('cors');
const { obtenerPosts, agregarPost } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/posts', async (req, res) => {
  try {
    const posts = await obtenerPosts();
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

app.post('/posts', async (req, res) => {
  try {
    const { titulo, url, img, descripcion } = req.body;
    const imagenUrl = img || url;

    if (!titulo || !imagenUrl || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevoPost = await agregarPost(titulo, imagenUrl, descripcion);
    res.status(201).json(nuevoPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al guardar el post' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});