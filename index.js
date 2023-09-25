// DOTENV loads environment variable from .env file to process.env (User Environment)
require("dotenv").config()

const express = require("express");
const app = express();

// For better logs
const morgan = require("morgan");
const cors = require("cors");
const Phonebook = require("./models/phonebook");

app.use(express.json());
app.use(cors());

// Look-up build folder for matching route
app.use(express.static("build"));

// Custom Token
morgan.token("post-data", function getData(req) {
  return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :response-time :post-data"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Phonebook.find({}).then(result => {
    res.json(result);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();
  Phonebook.collection.countDocuments().then((count) => {
    res.send(`<p>Phonebook has info for ${count} people</p> <p>${date}</p>`);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  Phonebook.findById(id).then(person => {
    res.json(person);
  })
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).send();
});

const getId = () => {
  const id = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;
  return id + 1;
};

const alreadyExists = (name) => {
  const ans = persons.find((person) => person.name === name);
  return ans;
};
app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name) {
    res.status(400).json({ error: "Missing name" });
  } else if (!body.number) {
    res.status(400).json({ error: "Missing number" });
  } else if (alreadyExists(body.name)) {
    res.status(400).json({ error: "Person with the name already exists" });
  } else {
    const newPerson = new Phonebook({
      name: body.name,
      number: body.number,
    });

    newPerson.save().then((person) => {
      res.json(person);
    })
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Listening on port 3001");
});
