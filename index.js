require('dotenv').config();

const express = require('express');

const app = express();

// For better logs
const morgan = require('morgan');
const cors = require('cors');
const Phonebook = require('./models/phonebook');

app.use(express.json());
app.use(cors());

// Look-up build folder for matching route
app.use(express.static('build'));

// Custom Token
morgan.token('post-data', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :response-time :post-data'));

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') return res.status(400).send({ error: 'malformed key' });
  if (err.name === 'ValidationError') {
    if (err.errors.name !== undefined) {
      res.status(400).json({ error: err.errors.name.message });
    } else {
      res.status(400).json({ error: err.errors.number.message });
    }
  }

  next(err);
};

// let persons = [];

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then((result) => {
    res.json(result);
  });
});

app.get('/info', (req, res) => {
  const date = new Date();
  Phonebook.collection.countDocuments().then((count) => {
    res.send(`<p>Phonebook has info for ${count} people</p> <p>${date}</p>`);
  });
});

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Phonebook.findById(id).then((person) => {
    res.json(person);
  }).catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;

  Phonebook.findByIdAndRemove(id)
    .then((data) => {
      if (data == null) res.status(404).end();
      res.status(204).end();
    })
    .catch((err) => { next(err); });
});

app.post('/api/persons', (req, res, next) => {
  const { body } = req;

  if (!body.name) {
    res.status(400).json({ error: 'Missing name' });
  } else if (!body.number) {
    res.status(400).json({ error: 'Missing number' });
  } else {
    const newPerson = new Phonebook({
      name: body.name,
      number: body.number,
    });

    newPerson.save().then((person) => {
      res.json(person);
    }).catch((error) => {
      next(error);
    });
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const newBook = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(id, newBook, { new: true, runValidators: true }).then((person) => {
    res.json(person);
  })
    .catch((err) => {
      next(err);
    });
});

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => {
  console.log('Listening on port 3001');
});
