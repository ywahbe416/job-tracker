import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import JobCard from '../components/JobCard.jsx'
import AddJobForm from '../components/AddJobForm.jsx'

const STATUSES = ['All', 'Not Applied', 'Applied', 'Phone Screen', 'Technical', 'Onsite', 'Offer', 'Rejected']

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  async function fetchJobs() {
    try {
      const { data } = await api.get('/jobs')
      setJobs(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  async function handleAdd(form) {
    await api.post('/jobs', form)
    await fetchJobs()
    setShowForm(false)
  }

  async function handleEdit(form) {
    await api.put(`/jobs/${editingJob.id}`, form)
    await fetchJobs()
    setEditingJob(null)
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this job?')) return
    await api.delete(`/jobs/${id}`)
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const visible = jobs.filter((j) => {
    const matchStatus = filterStatus === 'All' || j.status === filterStatus
    const matchSearch =
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.role_title.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div style={styles.page}>
      {/* Nav */}
      <header style={styles.nav}>
        <span style={styles.logo}>Job Tracker</span>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add Job</button>
          <button className="btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          style={{ maxWidth: 260 }}
          placeholder="Search company or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div style={styles.statusFilters}>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                ...styles.filterBtn,
                background: filterStatus === s ? '#4f46e5' : '#fff',
                color: filterStatus === s ? '#fff' : '#374151',
                border: '1px solid #d1d5db',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={styles.stats}>
        <span style={styles.stat}><b>{jobs.length}</b> total</span>
        <span style={styles.stat}><b>{jobs.filter(j => j.status === 'Applied').length}</b> applied</span>
        <span style={styles.stat}><b>{jobs.filter(j => j.status === 'Offer').length}</b> offers</span>
        <span style={styles.stat}><b>{jobs.filter(j => j.status === 'Rejected').length}</b> rejected</span>
      </div>

      {/* Job Grid */}
      {loading ? (
        <p style={styles.empty}>Loading…</p>
      ) : visible.length === 0 ? (
        <p style={styles.empty}>No jobs found. Add one!</p>
      ) : (
        <div style={styles.grid}>
          {visible.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={setEditingJob}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <AddJobForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
      )}
      {editingJob && (
        <AddJobForm
          initial={editingJob}
          onSubmit={handleEdit}
          onCancel={() => setEditingJob(null)}
        />
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '0 20px 40px' },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 0', borderBottom: '1px solid #e5e7eb', marginBottom: 24,
  },
  logo: { fontSize: 22, fontWeight: 700, color: '#4f46e5' },
  filters: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 },
  statusFilters: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  filterBtn: { padding: '5px 12px', fontSize: 13, borderRadius: 20, cursor: 'pointer' },
  stats: { display: 'flex', gap: 24, marginBottom: 24, fontSize: 14, color: '#6b7280' },
  stat: {},
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 15 },
}
