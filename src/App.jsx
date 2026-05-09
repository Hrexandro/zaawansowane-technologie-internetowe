import './App.css'
import { Routes, Route } from 'react-router'
import HomePage from './HomePage.jsx'
import EventDetailsPage from './EventDetailsPage.jsx'
import AddEventPage from './AddEventPage.jsx'
import { useEffect, useState } from 'react'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/items')

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

  async function addEvent(newEvent) {
    const response = await fetch('/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      method: 'DELETE'
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
      <Route path="/" element={<HomePage events={events} />} />
      <Route
        path="/event/:id"
        element={<EventDetailsPage events={events} deleteEvent={deleteEvent} />}
      />
      <Route path="/add" element={<AddEventPage addEvent={addEvent} />} />
    </Routes>
  )
}

export default App