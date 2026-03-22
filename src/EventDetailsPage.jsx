import { useState } from 'react'
import './App.css'
import { useParams } from 'react-router'



function EventDetailsPage() {
  const { id } = useParams()
  
  const event = events.find(e => e.id === id);

  if (!event) return <p>Nie znaleziono wydarzenia</p>;

  return <h1>{event.title}</h1>;

  return (
    <div>
      <h1>Szczegóły wydarzenia</h1>
      <p>ID wydarzenia: {id}</p>
    </div>

    
  )
}

export default EventDetailsPage
