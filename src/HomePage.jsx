import './App.css'
import { Link } from 'react-router'

function HomePage({ events, user, logout }) {
  return (
    <div className="page">
      <div className="card">
        <h1>Lista wydarzeń</h1>

        <p>Zalogowano jako: {user.email}</p>
        <p>Rola: {user.role}</p>

        <div className="actions">
          {user.role === 'ADMIN' && (
            <Link to="/add" className="button">
              Dodaj nowe wydarzenie
            </Link>
          )}

          <button onClick={logout} className="button">
            Wyloguj
          </button>
        </div>

        {events.length === 0 ? (
          <p>Brak wydarzeń</p>
        ) : (
          <div className="event-list">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <h2>{event.name}</h2>
                <p>{event.date}</p>
                <Link to={`/event/${event.id}`} className="button">
                  Szczegóły
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage