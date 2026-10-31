import { Link } from 'react-router-dom'
import { PropertyCard } from '../components/ui'
import { find, kes, properties } from '../data'
import { useStore } from '../store'

export function GuestDashboard() {
  const { user, trips } = useStore()
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <div className="container" style={{ padding: '40px var(--pad)' }}>
      <div className="row gap16" style={{ marginBottom: 32 }}>
        <span className="avatar lg">{user!.name[0].toUpperCase()}</span>
        <div><h1 style={{ fontSize: 30, fontWeight: 600 }}>Hi, {user!.name.split(' ')[0]}</h1><span className="muted">{user!.email}</span></div>
      </div>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Your trips</h2>
      {trips.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: 48 }}>
          <h3>No trips booked… yet!</h3>
          <p className="muted" style={{ margin: '8px 0 20px' }}>Time to dust off your bags and start planning your next stay.</p>
          <Link to="/explore" className="btn btn-dark">Start searching</Link>
        </div>
      ) : (
        <div>
          {trips.map(t => {
            const p = find(t.propertyId)!
            return (
              <div className="trip" key={t.ref}>
                <img src={p.images[0].replace('w=1200', 'w=400')} alt={p.title} />
                <div>
                  <b style={{ fontSize: 18 }}>{p.title}</b>
                  <div className="muted">{p.area}, Kikuyu · Hosted by {p.host.name}</div>
                  <div style={{ margin: '6px 0' }}>{fmt(t.checkIn)} – {fmt(t.checkOut)} · {t.guests} guest{t.guests > 1 && 's'}</div>
                  <span className={`tag ${t.status === 'Confirmed' ? 'ok' : 'wait'}`}>{t.status}</span> <span className="muted" style={{ fontSize: 13 }}>Ref {t.ref}</span>
                </div>
                <div style={{ textAlign: 'right' }}><b>{kes(t.total)}</b><div><Link className="link" to={`/property/${p.id}`}>View stay</Link></div></div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Wishlist() {
  const { wishlist } = useStore()
  const list = properties.filter(p => wishlist.includes(p.id))
  return (
    <div className="container" style={{ padding: '40px var(--pad)' }}>
      <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 24 }}>Wishlist</h1>
      {list.length ? <div className="grid">{list.map(p => <PropertyCard key={p.id} p={p} />)}</div> : (
        <div className="panel" style={{ textAlign: 'center', padding: 48 }}>
          <h3>Create your first wishlist</h3>
          <p className="muted" style={{ margin: '8px 0 20px' }}>Tap the heart on any stay to save it here.</p>
          <Link to="/explore" className="btn btn-dark">Explore stays</Link>
        </div>
      )}
    </div>
  )
}
