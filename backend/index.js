const express = require('express');
const cors = require('cors');
const { obtenerPosts, agregarPost, modificarPost, eliminarPost } = require('./db');
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

// Ruta PUT para incrementar like
app.put('/posts/like/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const postModificado = await modificarPost(id);
        
        if (!postModificado) {
            return res.status(404).json({ error: 'No se encontró el post' });
        }
        res.json(postModificado);
    } catch (error) {
        console.error('Error al modificar el post:', error.message);
        res.status(500).json({ error: 'Error al modificar el post' });
    }
});

// Ruta DELETE para eliminar un post
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postEliminado = await eliminarPost(id);
    
    if (!postEliminado) {
      return res.status(404).json({ error: 'No se encontró el post con ese ID' });
    }
    
    res.json({ mensaje: 'Post eliminado con éxito', post: postEliminado });
  } catch (error) {
    console.error('Error al eliminar el post:', error.message);
    res.status(500).json({ error: 'Ocurrió un error al eliminar el post' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});