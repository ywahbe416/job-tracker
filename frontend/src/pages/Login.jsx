import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/signup'
      const { data } = await api.post(endpoint, { email, password })
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Job Tracker</h1>
        <p style={styles.subtitle}>{mode === 'login' ? 'Sign in to your account' : 'Create a new account'}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          <label style={{ ...styles.label, marginTop: 16 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button className="btn-primary" type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Loading…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p style={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            style={styles.toggleBtn}
          >
            {mode === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: { fontSize: 28, fontWeight: 700, color: '#4f46e5', textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginTop: 6, marginBottom: 28, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column' },
  label: { fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 },
  error: { color: '#ef4444', fontSize: 13, marginTop: 10 },
  submitBtn: { marginTop: 20, padding: '12px 0', fontSize: 15 },
  toggle: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6b7280' },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    fontSize: 13,
  },
}
