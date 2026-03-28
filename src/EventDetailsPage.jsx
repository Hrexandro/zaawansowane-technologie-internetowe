import './App.css'
import { useParams, Link } from 'react-router'

function EventDetailsPage({ events }) {
  const { id } = useParams()
  const event = events.find(e => e.id === Number(id))

  if (!event) {
    return (
      <div className="page">
        <div className="card">
          <h1 className="title">Nie znaleziono wydarzenia</h1>
          <Link to="/" className="button-secondary">Powrót</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">{event.name}</h1>
        <p className="details-text">{event.description}</p>
        <p className="event-date">{event.date}</p>

        <div className="actions">
          <Link to="/" className="button-secondary">Powrót</Link>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage