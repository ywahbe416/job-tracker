import { useState } from 'react'

const STATUSES = ['Not Applied', 'Applied', 'Phone Screen', 'Technical', 'Onsite', 'Offer', 'Rejected']

export default function AddJobForm({ onSubmit, onCancel, initial = {} }) {
  const [form, setForm] = useState({
    company: initial.company || '',
    role_title: initial.role_title || '',
    status: initial.status || 'Not Applied',
    careers_url: initial.careers_url || '',
    notes: initial.notes || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>{initial.id ? 'Edit Job' : 'Add New Job'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Company *</label>
              <input value={form.company} onChange={set('company')} placeholder="Acme Corp" required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Role Title *</label>
              <input value={form.role_title} onChange={set('role_title')} placeholder="Software Engineer" required />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Status</label>
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Careers URL</label>
            <input value={form.careers_url} onChange={set('careers_url')} placeholder="https://..." />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Notes</label>
            <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Recruiter name, referral, anything…" />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : initial.id ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 100, padding: 16,
  },
  modal: {
    background: '#fff', borderRadius: 12, padding: '32px 28px',
    width: '100%', maxWidth: 560,
    boxShadow: '0 8px 40px rgba(0,0,0,0.16)',
  },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: '#374151' },
  error: { color: '#ef4444', fontSize: 13 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 },
}
