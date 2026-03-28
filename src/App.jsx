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
    async function loadEvents() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/events.json')

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

    loadEvents()
  }, [])

  function addEvent(newEvent) {
    setEvents(prevEvents => [...prevEvents, newEvent])
  }

  if (loading) {
    return <p>Ładowanie danych...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    

    <Routes>
      <Route path="/" element={<HomePage events={events}/>} />
      <Route path="/event/:id" element={<EventDetailsPage addEvent={addEvent} events={events}/>} />
      <Route path="/add" element={<AddEventPage addEvent={addEvent} events={events}/>} />
    </Routes>

  )
}

export default App
