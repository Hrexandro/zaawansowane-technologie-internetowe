import './App.css'
import { useParams, Link, useNavigate } from 'react-router'

function EventDetailsPage({ events, deleteEvent, user }) {
  const { id } = useParams()
  const navigate = useNavigate()

  const event = events.find(e => e.id === Number(id))

  async function handleDelete() {
    try {
      await deleteEvent(event.id)
      navigate('/')
    } catch (err) {
      alert('Nie udało się usunąć wydarzenia')
    }
  }

  if (!event) {
    return (
      <div className="page">
        <div className="card">
          <h1>Nie znaleziono wydarzenia</h1>
          <Link to="/" className="button">
            Powrót
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="card">
        <h1>{event.name}</h1>
        <p>{event.description}</p>
        <p>{event.date}</p>

        <div className="actions">
          <Link to="/" className="button">
            Powrót
          </Link>

          {user.role === 'ADMIN' && (
            <button onClick={handleDelete} className="button">
              Usuń wydarzenie
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage