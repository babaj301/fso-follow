require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const Note = require('./models/note');

app.use(cors());
app.use(express.static('dist'));

app.use(express.json());

let notes = [
  { id: '1', content: 'HTML is easy', important: true },
  { id: '2', content: 'Browser can execute only JavaScript', important: false },
  {
    id: '3',
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);

app.get('/', (request, response) => {
  response.send('<h1>Hello World</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: 'malformatted id' });
    });
});

app.delete('/api/notes/:id', (req, res) => {
  Note.findById(req.params.id).then((note) => {
    res.json(note);
  });
});

// const generateId = () => {
//   const maxId =
//     notes.length > 1 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

//   return String(maxId + 1);
// };

app.post('/api/notes', (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
const PORT = process.env.PORT;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
