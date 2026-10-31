import { useState } from 'react'
import { CalendarCheck, CirclePlus, LayoutDashboard, ListChecks, Wallet } from 'lucide-react'
import { allAmenities, areas, kes, properties } from '../data'
import { useStore } from '../store'

type Tab = 'overview' | 'listings' | 'bookings' | 'earnings' | 'new'

const requests = [
  { id: 'KS7H2QX', guest: 'Achieng O.', prop: properties[0], dates: '12 – 15 Nov', total: 12800, status: 'Pending' },
  { id: 'KS3M9LD', guest: 'Daniel K.', prop: properties[3], dates: '20 – 22 Nov', total: 14300, status: 'Confirmed' },
  { id: 'KS8T1ZP', guest: 'Salma H.', prop: properties[0], dates: '28 Nov – 1 Dec', total: 12800, status: 'Confirmed' },
]
const months = [['Jun', 42], ['Jul', 58], ['Aug', 71], ['Sep', 64], ['Oct', 88], ['Nov', 52]] as const

export default function HostDashboard() {
  const { user, notify } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  const [reqs, setReqs] = useState(requests)
  const [am, setAm] = useState<string[]>([])
  const mine = properties.slice(0, 3)
  const max = Math.max(...months.map(m => m[1]))

  const nav: [Tab, string, typeof Wallet][] = [
    ['overview', 'Overview', LayoutDashboard], ['listings', 'Listings', ListChecks], ['bookings', 'Bookings', CalendarCheck],
    ['earnings', 'Earnings', Wallet], ['new', 'Add property', CirclePlus],
  ]

  return (
    <div className="container dash">
      <nav className="side" aria-label="Host">
        {nav.map(([k, l, I]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><I size={18} />{l}</button>)}
      </nav>
      <div style={{ minWidth: 0 }}>
        <h1>Welcome back, {user!.name.split(' ')[0]}</h1>
        <p className="muted">Manage your listings, requests and payouts.</p>

        {tab === 'overview' && (
          <>
            <div className="stats">
              <div className="stat"><small>Earnings this month</small><b>{kes(52000)}</b><em>+12% vs last month</em></div>
              <div className="stat"><small>Upcoming bookings</small><b>4</b><em>2 this week</em></div>
              <div className="stat"><small>Occupancy rate</small><b>68%</b><em>+5%</em></div>
              <div className="stat"><small>Average rating</small><b>4.91</b><em>128 reviews</em></div>
            </div>
            <div className="panel"><h3>Earnings (KES thousands)</h3>
              <div className="bars">{months.map(([m, v]) => <div key={m}><i style={{ height: `${(v / max) * 100}%` }} /><span>{m}</span></div>)}</div>
            </div>
            <div className="panel"><h3>Booking requests</h3><RequestTable reqs={reqs} setReqs={setReqs} notify={notify} /></div>
          </>
        )}

        {tab === 'listings' && (
          <div className="panel" style={{ marginTop: 24 }}><h3>Your listings</h3>
            <div className="table-wrap"><table>
              <thead><tr><th>Property</th><th>Price</th><th>Status</th><th>Rating</th></tr></thead>
              <tbody>{mine.map((p, i) => (
                <tr key={p.id}>
                  <td><div className="thumb"><img src={p.images[0].replace('w=1200', 'w=200')} alt="" /><div><b>{p.title}</b><div className="muted">{p.area}</div></div></div></td>
                  <td>{kes(p.price)}</td>
                  <td><span className={`tag ${i === 2 ? 'wait' : 'ok'}`}>{i === 2 ? 'Pending approval' : 'Live'}</span></td>
                  <td>★ {p.rating}</td>
                </tr>))}</tbody>
            </table></div>
          </div>
        )}

        {tab === 'bookings' && <div className="panel" style={{ marginTop: 24 }}><h3>All bookings</h3><RequestTable reqs={reqs} setReqs={setReqs} notify={notify} /></div>}

        {tab === 'earnings' && (
          <>
            <div className="stats">
              <div className="stat"><small>Total earned</small><b>{kes(375000)}</b></div>
              <div className="stat"><small>Platform commission (10%)</small><b>{kes(37500)}</b></div>
              <div className="stat"><small>Next payout</small><b>{kes(46800)}</b><em>Due 2 days after check-in</em></div>
            </div>
            <div className="panel"><h3>Recent payouts</h3><div className="table-wrap"><table>
              <thead><tr><th>Date</th><th>Reference</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>28 Oct</td><td>PO-2041</td><td>{kes(23400)}</td><td><span className="tag ok">Paid via M-Pesa</span></td></tr>
                <tr><td>14 Oct</td><td>PO-2036</td><td>{kes(34200)}</td><td><span className="tag ok">Paid via M-Pesa</span></td></tr>
                <tr><td>02 Oct</td><td>PO-2029</td><td>{kes(11700)}</td><td><span className="tag ok">Paid via M-Pesa</span></td></tr>
              </tbody></table></div></div>
          </>
        )}

        {tab === 'new' && (
          <form className="panel" style={{ marginTop: 24 }} onSubmit={e => { e.preventDefault(); notify('Property submitted for admin review'); setTab('listings') }}>
            <h3>Submit a new property</h3>
            <p className="muted" style={{ marginBottom: 20 }}>Listings go live after our team verifies the details, photos and ownership documents.</p>
            <label className="field"><span>Listing title</span><input className="input" required placeholder="e.g. Sunny studio near Kikuyu campus" /></label>
            <div className="form-grid">
              <label className="field"><span>Neighbourhood</span><select className="select" required>{areas.map(a => <option key={a}>{a}</option>)}</select></label>
              <label className="field"><span>Property type</span><select className="select"><option>Studio</option><option>Bedsitter</option><option>1 bedroom</option><option>2 bedroom</option><option>Guest house</option><option>Holiday home</option></select></label>
              <label className="field"><span>Price per night (KES)</span><input className="input" required inputMode="numeric" placeholder="3000" /></label>
              <label className="field"><span>Price per month (KES, optional)</span><input className="input" inputMode="numeric" placeholder="60000" /></label>
              <label className="field"><span>Bedrooms</span><input className="input" type="number" min={0} defaultValue={1} /></label>
              <label className="field"><span>Max guests</span><input className="input" type="number" min={1} defaultValue={2} /></label>
            </div>
            <label className="field"><span>Description</span><textarea className="input" required placeholder="Describe your space, neighbourhood and what guests will love…" /></label>
            <h3 style={{ marginTop: 16 }}>Amenities</h3>
            <div className="chips" style={{ marginBottom: 20 }}>{allAmenities.map(a => <button type="button" key={a} className={`chip ${am.includes(a) ? 'on' : ''}`} onClick={() => setAm(am.includes(a) ? am.filter(x => x !== a) : [...am, a])}>{a}</button>)}</div>
            <h3>Photos</h3>
            <label className="drop" style={{ display: 'block', cursor: 'pointer' }}>Drag photos here or click to upload (min. 5)<input type="file" accept="image/*" multiple hidden /></label>
            <label className="check"><input type="checkbox" required /><span className="muted" style={{ fontSize: 14 }}>I own or have written authority to manage this property.</span></label>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 12 }}>Submit for approval</button>
          </form>
        )}
      </div>
    </div>
  )
}

function RequestTable({ reqs, setReqs, notify }: { reqs: typeof requests; setReqs: (r: typeof requests) => void; notify: (m: string) => void }) {
  const act = (id: string, status: string) => { setReqs(reqs.map(r => r.id === id ? { ...r, status } : r)); notify(`Booking ${status.toLowerCase()}`) }
  return (
    <div className="table-wrap"><table>
      <thead><tr><th>Guest</th><th>Property</th><th>Dates</th><th>Total</th><th>Status</th><th /></tr></thead>
      <tbody>{reqs.map(r => (
        <tr key={r.id}>
          <td><b>{r.guest}</b><div className="muted">{r.id}</div></td>
          <td>{r.prop.title}</td><td>{r.dates}</td><td>{kes(r.total)}</td>
          <td><span className={`tag ${r.status === 'Confirmed' ? 'ok' : r.status === 'Declined' ? 'bad' : 'wait'}`}>{r.status}</span></td>
          <td>{r.status === 'Pending' && <div className="row gap8">
            <button className="btn btn-dark btn-sm" onClick={() => act(r.id, 'Confirmed')}>Accept</button>
            <button className="btn btn-outline btn-sm" onClick={() => act(r.id, 'Declined')}>Decline</button></div>}</td>
        </tr>))}</tbody>
    </table></div>
  )
}
