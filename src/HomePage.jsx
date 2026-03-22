import { useState } from 'react'
import './App.css'
import { Link } from 'react-router'

function HomePage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: 'Koncert Quest Master',
      description: 'Koncert Quest Master + Fief | Poznań \n Klub Pod Minogą, ul. Nowowiejskiego 8',
      date: '2026-04-27',
    },
  ])

  return (

        <div>
          <Link to="/add">Dodaj nowe wydarzenie</Link>
          <br />
          <Link to="/event/1">Zobacz wydarzenie 1</Link>
          <h1>Lista wydarzeń</h1>
        </div>

  )
}

export default HomePage
