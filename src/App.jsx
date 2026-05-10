import './App.css'
import { Routes, Route, Navigate } from 'react-router'
import HomePage from './HomePage.jsx'
import EventDetailsPage from './EventDetailsPage.jsx'
import AddEventPage from './AddEventPage.jsx'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import { useEffect, useState } from 'react'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    if (token) {
      loadEvents()
    }
  }, [token])

  async function loadEvents() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/items', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Błąd pobierania danych')
      }

      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError('Pobieranie danych zakończone niepowodzeniem')
    } finally {
      setLoading(false)
    }
  }

async function registerUser(email, password, role) {
  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, role })
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(data?.message || 'Błąd rejestracji')
    error.details = data?.errors
    throw error
  }

  return data
}

  async function login(email, password) {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    if (!response.ok) {
      throw new Error('Błąd logowania')
    }

    const data = await response.json()

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    setToken(data.token)
    setUser(data.user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken('')
    setUser(null)
    setEvents([])
  }

  async function addEvent(newEvent) {
    const response = await fetch('/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newEvent)
    })

    if (!response.ok) {
      throw new Error('Nie udało się zapisać wydarzenia')
    }

    const savedEvent = await response.json()
    setEvents(prevEvents => [...prevEvents, savedEvent])
  }

  async function deleteEvent(id) {
    const response = await fetch(`/items/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Nie udało się usunąć wydarzenia')
    }

    setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
  }

  if (loading) {
    return <p>Ładowanie danych...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <HomePage events={events} user={user} logout={logout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/login" element={<LoginPage login={login} />} />

      <Route
        path="/register"
        element={<RegisterPage registerUser={registerUser} />}
      />

      <Route
        path="/event/:id"
        element={
          token ? (
            <EventDetailsPage
              events={events}
              deleteEvent={deleteEvent}
              user={user}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/add"
        element={
          token && isAdmin ? (
            <AddEventPage addEvent={addEvent} />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  )
}

export default App