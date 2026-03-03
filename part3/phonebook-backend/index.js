const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// Serve React production build
app.use(express.static('build'))

// In-memory data
let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// POST new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

// React fallback (VERY IMPORTANT)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

// Use 3002 to avoid port conflict
const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})