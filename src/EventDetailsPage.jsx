import { useState } from 'react'
import './App.css'
import { useParams } from 'react-router'
import { Link } from 'react-router'

function EventDetailsPage({ events }) {
  const { id } = useParams()
  const event = events.find(e => e.id === Number(id))

  if (!event) return (
    <>
      <p>Nie znaleziono wydarzenia</p>
      <Link to="/">Powrót</Link>
    </>
  )
  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      <p>{event.date}</p>
      <Link to="/">Powrót</Link>
    </div>
  )
}
export default EventDetailsPage







