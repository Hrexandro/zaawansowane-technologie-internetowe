import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
const PORT = 3000
const JWT_SECRET = 'tajny_klucz_do_laboratorium_3'

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

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('USER', 'ADMIN'))
  )
`).run()

const eventCount = db.prepare('SELECT COUNT(*) AS count FROM events').get().count

if (eventCount === 0) {
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

function validateUser(data) {
  const errors = {}

  if (typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.email = 'Email jest wymagany i musi mieć poprawny format'
  }

  if (typeof data.password !== 'string' || data.password.length < 6) {
    errors.password = 'Hasło musi mieć co najmniej 6 znaków'
  }

  if (data.role !== 'USER' && data.role !== 'ADMIN') {
    errors.role = 'Rola musi mieć wartość USER albo ADMIN'
  }

  return errors
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Brak tokenu autoryzacyjnego' })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Nieprawidłowy format tokenu' })
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token jest nieprawidłowy lub wygasł' })
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Brak uprawnień administratora' })
  }

  next()
}

app.post('/register', async (req, res) => {
  const errors = validateUser(req.body)

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Nieprawidłowe dane rejestracji',
      errors
    })
  }

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(req.body.email)

  if (existingUser) {
    return res.status(409).json({ message: 'Użytkownik o takim adresie email już istnieje' })
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10)

  const result = db.prepare(`
    INSERT INTO users (email, password_hash, role)
    VALUES (?, ?, ?)
  `).run(req.body.email, passwordHash, req.body.role)

  res.status(201).json({
    id: result.lastInsertRowid,
    email: req.body.email,
    role: req.body.role
  })
})

app.post('/login', async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email)

  if (!user) {
    return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' })
  }

  const passwordIsValid = await bcrypt.compare(req.body.password, user.password_hash)

  if (!passwordIsValid) {
    return res.status(401).json({ message: 'Nieprawidłowy email lub hasło' })
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  })
})

app.get('/items', authenticateToken, (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY id').all()
  res.json(events)
})

app.get('/items/:id', authenticateToken, (req, res) => {
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

app.post('/items', authenticateToken, requireAdmin, (req, res) => {
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

app.delete('/items/:id', authenticateToken, requireAdmin, (req, res) => {
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