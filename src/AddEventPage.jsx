import { useState } from 'react'
import { useNavigate } from 'react-router'
import './App.css'

function AddEventPage({ addEvent }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')

  const navigate = useNavigate()

  async function handleSubmit(e) {
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
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.date = 'Data musi przypadać dzisiaj lub w przyszłości'
      }
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    try {
      setSubmitError('')

      await addEvent({
        name: name.trim(),
        description: description.trim(),
        date
      })

      navigate('/')
    } catch (err) {
      setSubmitError('Nie udało się zapisać wydarzenia w bazie danych')
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Dodaj wydarzenie</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nazwa</label>
            <input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Opis</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            {errors.description && <p className="error">{errors.description}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="date">Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            {errors.date && <p className="error">{errors.date}</p>}
          </div>

          {submitError && <p className="error">{submitError}</p>}

          <div className="actions">
            <button type="submit" className="button">
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEventPage