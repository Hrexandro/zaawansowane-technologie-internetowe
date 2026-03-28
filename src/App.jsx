import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router'
import HomePage from './HomePage.jsx'
import EventDetailsPage from './EventDetailsPage.jsx'
import AddEventPage from './AddEventPage.jsx'

function App() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Koncert Quest Master',
      description: 'Koncert Quest Master + Fief | Poznań \n Klub Pod Minogą, ul. Nowowiejskiego 8',
      date: '2026-04-27',
    },
  ])

  function addEvent(newEvent) {
    setEvents(prevEvents => [...prevEvents, newEvent])
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
