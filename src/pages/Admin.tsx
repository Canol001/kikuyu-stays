import { useState } from 'react'
import { BadgeCheck, Banknote, CalendarCheck, Home, LayoutDashboard, Percent, Users } from 'lucide-react'
import { kes, properties } from '../data'
import { useStore } from '../store'

type Tab = 'overview' | 'properties' | 'hosts' | 'bookings' | 'payments' | 'settings'
const hosts = [
  { name: 'Wanjiru M.', phone: '0712 *** 481', listings: 2, status: 'Verified' },
  { name: 'Brian K.', phone: '0722 *** 905', listings: 2, status: 'Verified' },
  { name: 'Peter N.', phone: '0733 *** 120', listings: 1, status: 'Pending' },
  { name: 'Mercy W.', phone: '0701 *** 662', listings: 1, status: 'Verified' },
]
const pays = [
  { ref: 'QJK8H2LM1X', guest: 'Achieng O.', amount: 12800, fee: 1280, status: 'Paid' },
  { ref: 'QJK3D9PL7Z', guest: 'Daniel K.', amount: 14300, fee: 1430, status: 'Paid' },
  { ref: 'QJK1V5NC4B', guest: 'Salma H.', amount: 9500, fee: 950, status: 'Refunded' },
]

export default function AdminDashboard() {
  const { notify } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  const [queue, setQueue] = useState(properties.slice(7, 10))
  const [commission, setCommission] = useState(10)
  const [instant, setInstant] = useState(true)

  const nav: [Tab, string, typeof Home][] = [
    ['overview', 'Dashboard', LayoutDashboard], ['properties', 'Properties', Home], ['hosts', 'Hosts', Users],
    ['bookings', 'Bookings', CalendarCheck], ['payments', 'Payments', Banknote], ['settings', 'Pricing & settings', Percent],
  ]
  const decide = (id: string, ok: boolean) => { setQueue(queue.filter(p => p.id !== id)); notify(ok ? 'Property approved and published' : 'Returned to host for correction') }

  return (
    <div className="container dash">
      <nav className="side" aria-label="Admin">
        {nav.map(([k, l, I]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><I size={18} />{l}</button>)}
      </nav>
      <div style={{ minWidth: 0 }}>
        <h1>Admin console</h1>
        <p className="muted">Full control of the Kikuyu Stays marketplace.</p>

        {tab === 'overview' && (
          <>
            <div className="stats">
              <div className="stat"><small>Gross booking volume</small><b>{kes(1500000)}</b><em>+18% this month</em></div>
              <div className="stat"><small>Platform commission</small><b>{kes(150000)}</b><em>10% of volume</em></div>
              <div className="stat"><small>Active properties</small><b>{properties.length}</b><em>{queue.length} awaiting review</em></div>
              <div className="stat"><small>Verified hosts</small><b>{hosts.filter(h => h.status === 'Verified').length}</b></div>
            </div>
            <div className="panel"><h3>Approval queue</h3><Queue queue={queue} decide={decide} /></div>
          </>
        )}
        {tab === 'properties' && <div className="panel" style={{ marginTop: 24 }}><h3>Approval queue</h3><Queue queue={queue} decide={decide} /></div>}
        {tab === 'hosts' && (
          <div className="panel" style={{ marginTop: 24 }}><h3>Hosts</h3><div className="table-wrap"><table>
            <thead><tr><th>Name</th><th>Phone</th><th>Listings</th><th>Verification</th><th /></tr></thead>
            <tbody>{hosts.map(h => (
              <tr key={h.name}><td><b>{h.name}</b></td><td>{h.phone}</td><td>{h.listings}</td>
                <td><span className={`tag ${h.status === 'Verified' ? 'ok' : 'wait'}`}>{h.status}</span></td>
                <td><div className="row gap8">
                  {h.status !== 'Verified' && <button className="btn btn-dark btn-sm" onClick={() => notify(`${h.name} verified`)}><BadgeCheck size={14} /> Verify</button>}
                  <button className="btn btn-outline btn-sm" onClick={() => notify(`${h.name} suspended`)}>Suspend</button></div></td></tr>))}</tbody>
          </table></div></div>
        )}
        {tab === 'bookings' && (
          <div className="panel" style={{ marginTop: 24 }}><h3>Recent bookings</h3><div className="table-wrap"><table>
            <thead><tr><th>Ref</th><th>Property</th><th>Guest</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>{pays.map((r, i) => (
              <tr key={r.ref}><td>{r.ref.slice(0, 7)}</td><td>{properties[i].title}</td><td>{r.guest}</td><td>{kes(r.amount)}</td>
                <td><span className={`tag ${r.status === 'Paid' ? 'ok' : 'bad'}`}>{r.status === 'Paid' ? 'Confirmed' : 'Cancelled'}</span></td></tr>))}</tbody>
          </table></div></div>
        )}
        {tab === 'payments' && (
          <div className="panel" style={{ marginTop: 24 }}><h3>M-Pesa transactions</h3><div className="table-wrap"><table>
            <thead><tr><th>Receipt</th><th>Guest</th><th>Amount</th><th>Commission</th><th>Status</th></tr></thead>
            <tbody>{pays.map(r => (
              <tr key={r.ref}><td>{r.ref}</td><td>{r.guest}</td><td>{kes(r.amount)}</td><td>{kes(r.fee)}</td>
                <td><span className={`tag ${r.status === 'Paid' ? 'ok' : 'bad'}`}>{r.status}</span></td></tr>))}</tbody>
          </table></div></div>
        )}
        {tab === 'settings' && (
          <div className="panel" style={{ marginTop: 24, maxWidth: 560 }}>
            <h3>Commission &amp; booking rules</h3>
            <label className="field"><span>Platform commission: <b>{commission}%</b></span>
              <input type="range" min={5} max={20} value={commission} onChange={e => setCommission(+e.target.value)} style={{ width: '100%', accentColor: '#ff385c' }} /></label>
            <label className="check"><input type="checkbox" checked={instant} onChange={e => setInstant(e.target.checked)} /><div><b>Allow Instant Book</b><div className="muted" style={{ fontSize: 13 }}>Disable to require manual confirmation for all bookings</div></div></label>
            <button className="btn btn-dark" style={{ marginTop: 16 }} onClick={() => notify('Settings saved')}>Save changes</button>
          </div>
        )}
      </div>
    </div>
  )
}

function Queue({ queue, decide }: { queue: typeof properties; decide: (id: string, ok: boolean) => void }) {
  if (!queue.length) return <p className="muted">All caught up — nothing waiting for review.</p>
  return (
    <div className="table-wrap"><table>
      <thead><tr><th>Property</th><th>Host</th><th>Price</th><th /></tr></thead>
      <tbody>{queue.map(p => (
        <tr key={p.id}>
          <td><div className="thumb"><img src={p.images[0].replace('w=1200', 'w=200')} alt="" /><div><b>{p.title}</b><div className="muted">{p.area}</div></div></div></td>
          <td>{p.host.name}</td><td>{kes(p.price)}</td>
          <td><div className="row gap8"><button className="btn btn-dark btn-sm" onClick={() => decide(p.id, true)}>Approve</button><button className="btn btn-outline btn-sm" onClick={() => decide(p.id, false)}>Reject</button></div></td>
        </tr>))}</tbody>
    </table></div>
  )
}
