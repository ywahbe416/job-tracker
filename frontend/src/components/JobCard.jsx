const STATUS_COLORS = {
  'Not Applied': '#6b7280',
  'Applied':     '#3b82f6',
  'Phone Screen':'#8b5cf6',
  'Technical':   '#f59e0b',
  'Onsite':      '#f97316',
  'Offer':       '#10b981',
  'Rejected':    '#ef4444',
}

export default function JobCard({ job, onEdit, onDelete }) {
  const color = STATUS_COLORS[job.status] || '#6b7280'

  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <p style={styles.company}>{job.company}</p>
          <p style={styles.role}>{job.role_title}</p>
        </div>
        <span style={{ ...styles.badge, background: color }}>{job.status}</span>
      </div>

      {job.careers_url && (
        <a href={job.careers_url} target="_blank" rel="noreferrer" style={styles.link}>
          View posting →
        </a>
      )}

      {job.notes && <p style={styles.notes}>{job.notes}</p>}

      <div style={styles.footer}>
        <span style={styles.date}>{new Date(job.created_at).toLocaleDateString()}</span>
        <div style={styles.actions}>
          <button className="btn-ghost" style={styles.smallBtn} onClick={() => onEdit(job)}>Edit</button>
          <button className="btn-danger" style={styles.smallBtn} onClick={() => onDelete(job.id)}>Delete</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#fff', borderRadius: 10, padding: '18px 20px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
    display: 'flex', flexDirection: 'column', gap: 10,
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  company: { fontWeight: 700, fontSize: 16, color: '#111827' },
  role: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  badge: {
    color: '#fff', fontSize: 12, fontWeight: 600,
    padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
  },
  link: { fontSize: 13, color: '#4f46e5', textDecoration: 'none' },
  notes: { fontSize: 13, color: '#6b7280', borderLeft: '3px solid #e5e7eb', paddingLeft: 10 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  date: { fontSize: 12, color: '#9ca3af' },
  actions: { display: 'flex', gap: 8 },
  smallBtn: { padding: '5px 12px', fontSize: 12 },
}
