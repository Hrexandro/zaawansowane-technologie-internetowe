import './App.css'
import { Link } from 'react-router'

function HomePage({ events }) {
  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Lista wydarzeń</h1>

        <Link to="/add" className="button">
          Dodaj nowe wydarzenie
        </Link>

        {events.length === 0 ? (
          <p className="info-text">Brak wydarzeń</p>
        ) : (
          <ul className="event-list">
            {events.map(event => (
              <li key={event.id} className="event-item">
                <h2 className="event-name">{event.name}</h2>
                <p className="event-date">{event.date}</p>
                <Link to={`/event/${event.id}`} className="button-secondary">
                  Szczegóły
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default HomePage