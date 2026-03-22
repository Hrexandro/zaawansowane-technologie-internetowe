import { useState } from 'react'
import './App.css'
import { Link } from 'react-router'

function HomePage({ events }) {


  return (

        <div>
          <Link to="/add">Dodaj nowe wydarzenie</Link>
          <br />
          {events.length === 0 ? (
        <p>Brak wydarzeń</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <strong>{event.name}</strong> — {event.date}
            </li>
          ))}
        </ul>
      )}
        </div>

  )
}

export default HomePage
