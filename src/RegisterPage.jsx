import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './App.css'

function RegisterPage({ registerUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
    setErrors([])
    await registerUser(email, password, role)
    navigate('/login')
    } catch (err) {
    if (err.details) {
        setErrors(Object.values(err.details))
    } else {
        setErrors([err.message || 'Nie udało się zarejestrować użytkownika'])
    }
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Rejestracja</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label>Hasło</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Rola</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

            {errors.length > 0 && (
            <div className="error">
                {errors.map((error, index) => (
                <p key={index}>{error}</p>
                ))}
            </div>
            )}

          <div className="actions">
            <button className="button" type="submit">
              Zarejestruj
            </button>

            <Link to="/login" className="button">
              Logowanie
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage