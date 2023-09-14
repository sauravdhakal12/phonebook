const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

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
  res.json(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  const len = persons.length;

  res.send(`<p>Phonebook has info for ${len} people</p> <p>${date}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).send();
  }
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
  const newId = getId();
  const body = req.body;

  if (!body.name) {
    res.status(400).json({ error: "Missing name" });
  } else if (!body.number) {
    res.status(400).json({ error: "Missing number" });
  } else if (alreadyExists(body.name)) {
    res.status(400).json({ error: "Person with the name already exists" });
  } else {
    const newPerson = {
      id: newId,
      name: body.name,
      number: body.number,
    };

    persons = persons.concat(newPerson);
    res.json(newPerson);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Listening on port 3001");
});
