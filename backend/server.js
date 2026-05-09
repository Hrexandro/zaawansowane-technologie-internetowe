import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

const db = new Database('database.sqlite')

db.prepare(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL
  )
`).run()

const count = db.prepare('SELECT COUNT(*) AS count FROM events').get().count

if (count === 0) {
  db.prepare(`
    INSERT INTO events (name, description, date)
    VALUES (?, ?, ?)
  `).run(
    'Koncert Quest Master',
    'Koncert Quest Master + Fief | Poznań, Klub Pod Minogą, ul. Nowowiejskiego 8',
    '2026-04-27'
  )
}

function isValidDate(value) {
  if (typeof value !== 'string') {
    return false
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const date = new Date(`${value}T00:00:00Z`)

  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function validateEvent(data) {
  const errors = {}

  if (typeof data.name !== 'string' || data.name.trim() === '') {
    errors.name = 'Nazwa jest wymagana i musi być tekstem'
  }

  if (typeof data.description !== 'string' || data.description.trim() === '') {
    errors.description = 'Opis jest wymagany i musi być tekstem'
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Data musi mieć poprawny format RRRR-MM-DD'
  }

  return errors
}

app.get('/items', (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY id').all()
  res.json(events)
})

app.get('/items/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Nieprawidłowe ID' })
  }

  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id)

  if (!event) {
    return res.status(404).json({ message: 'Nie znaleziono wydarzenia' })
  }

  res.json(event)
})

app.post('/items', (req, res) => {
  const errors = validateEvent(req.body)

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Nieprawidłowe dane',
      errors
    })
  }

  const result = db.prepare(`
    INSERT INTO events (name, description, date)
    VALUES (?, ?, ?)
  `).run(
    req.body.name.trim(),
    req.body.description.trim(),
    req.body.date
  )

  const newEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(result.lastInsertRowid)

  res.status(201).json(newEvent)
})

app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Nieprawidłowe ID' })
  }

  const result = db.prepare('DELETE FROM events WHERE id = ?').run(id)

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Nie znaleziono wydarzenia' })
  }

  res.status(204).send()
})

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`)
})