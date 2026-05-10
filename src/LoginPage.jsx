import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './App.css'

function LoginPage({ login }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError('')
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Nieprawidłowy email lub hasło')
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Logowanie</h1>

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

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button className="button" type="submit">
              Zaloguj
            </button>

            <Link to="/register" className="button">
              Rejestracja
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage