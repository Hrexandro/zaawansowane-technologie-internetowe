import { useState } from 'react'
import { useNavigate } from "react-router";

function AddEventPage({ addEvent, events }) {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    if (!name.trim()) {
      newErrors.name = 'Nazwa jest wymagana'
    } else if (name.trim().length < 3) {
      newErrors.name = 'Nazwa musi mieć co najmniej 3 znaki'
    }

    if (!description.trim()) {
      newErrors.description = 'Opis jest wymagany'
    } else if (description.trim().length < 5) {
      newErrors.description = 'Opis musi mieć co najmniej 5 znaków'
    }

    if (!date) {
      newErrors.date = 'Data jest wymagana'
    } else {
      const selectedDate = new Date(date)
      const today = new Date()
    
      if (selectedDate < today) {
        newErrors.date = 'Data nie może być przeszła'
      }
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      const newEvent = {
        id: Date.now(),
        name: name.trim(),
        description: description.trim(),
        date,
      }

      addEvent(newEvent)
      navigate('/')

    }

    
  }

  return <div>
    <h1>Dodaj wydarzenie</h1>
    
  
    <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nazwa</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="description">Opis</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <p>{errors.description}</p>}
        </div>

        <label htmlFor="date">Data</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p>{errors.date}</p>}
        <button type="submit">Zapisz</button>
    </form>
  
  </div>
}

export default AddEventPage

