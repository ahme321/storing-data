const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()); 

const express = require('express');
const { Pool } = require('pg');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');



const pool = new Pool({
  user: '',
  host: '',
  database: '',
  password: '',
  port:,
});


mongoose.connect('mongodb://:/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: Number,
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', postSchema);

app.use(bodyParser.json());




app.post('/authors', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO authors (name, email) VALUES ($1, $2) RETURNING id',
      [name, email]
    );
    res.json({ id: result.rows[0].id, message: 'Author created' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating author');
  }
});


app.get('/authors/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM authors WHERE id = $1', [
      req.params.id,
    ]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Author not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching author');
  }
});


app.put('/authors/:id', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE authors SET name = $1, email = $2 WHERE id = $3',
      [name, email, req.params.id]
    );
    res.send('Author updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating author');
  }
});


app.delete('/authors/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM authors WHERE id = $1', [req.params.id]);
    res.send('Author deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting author');
  }
});


app.post('/posts', async (req, res) => {
  const post = new Post(req.body);
  try {
    await post.save();
    res.json({ message: 'Post created' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating post');
  }
});


app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).send('Post not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching post');
  }
});


app.put('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.send('Post updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
  }
});


app.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.send('Post deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting post');
  }
});

app.listen(port, () => {
  console.log(Server listening at http://localhost:${port}');});
  
