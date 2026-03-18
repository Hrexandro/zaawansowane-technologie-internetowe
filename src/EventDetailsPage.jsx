import { useState } from 'react'
import './App.css'
import { useParams } from 'react-router'



function EventDetailsPage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Szczegóły wydarzenia</h1>
      <p>ID wydarzenia: {id}</p>
    </div>
  )
}

export default EventDetailsPage
