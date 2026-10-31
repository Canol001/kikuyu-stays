import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check, ChevronLeft, CreditCard, ShieldCheck, Smartphone } from 'lucide-react'
import { Img } from '../components/ui'
import { find, kes, nightsBetween } from '../data'
import { useStore } from '../store'

type Phase = 'form' | 'stk' | 'done'

export default function Checkout() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const { user, addTrip } = useStore()
  const p = find(id)
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'mpesa' | 'card'>('mpesa')
  const [msg, setMsg] = useState('')
  const [agree, setAgree] = useState(false)
  const [phase, setPhase] = useState<Phase>('form')
  const [ref] = useState(() => 'KS' + Math.random().toString(36).slice(2, 8).toUpperCase())

  const inD = sp.get('in') ?? ''
  const outD = sp.get('out') ?? ''
  const guests = Number(sp.get('guests') ?? 1)
  const nights = nightsBetween(inD, outD)

  useEffect(() => {
    if (phase !== 'stk' || !p) return
    const t = setTimeout(() => {
      const sub = nights * p.price
      addTrip({ ref, propertyId: p.id, checkIn: inD, checkOut: outD, guests, total: sub + Math.round(sub * 0.1) + 500, status: p.instant ? 'Confirmed' : 'Pending' })
      setPhase('done')
    }, 3500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  if (!p || !nights) return <div className="center-card"><h1>Nothing to check out</h1><Link className="btn btn-dark" style={{ marginTop: 20 }} to="/explore">Browse stays</Link></div>

  const sub = nights * p.price
  const service = Math.round(sub * 0.1)
  const total = sub + service + 500
  const validPhone = /^(?:\+?254|0)?[71]\d{8}$/.test(phone.replace(/\s/g, ''))
  const canPay = agree && (method === 'card' || validPhone)
  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

  if (phase === 'done') {
    return (
      <div className="container"><div className="center-card">
        <div className="success-ico"><Check size={40} /></div>
        <h1 style={{ fontSize: 32 }}>{p.instant ? 'Booking confirmed!' : 'Request sent!'}</h1>
        <p className="muted" style={{ margin: '12px 0 8px' }}>
          {p.instant ? `Your stay at ${p.title} is confirmed.` : `${p.host.name} will respond within 24 hours. Your payment is held securely until they accept.`}
        </p>
        <p>Booking reference <b>{ref}</b></p>
        <p className="muted" style={{ fontSize: 14, marginTop: 6 }}>{fmt(inD)} → {fmt(outD)} · {guests} guest{guests > 1 && 's'} · {kes(total)}</p>
        <div className="row gap12" style={{ justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => nav('/guest')}>View my trips</button>
          <Link className="btn btn-outline" to="/explore">Keep exploring</Link>
        </div>
      </div></div>
    )
  }

  return (
    <div className="container">
      <div className="checkout">
        <div>
          <div className="back-title"><Link to={`/property/${p.id}`} aria-label="Back"><ChevronLeft /></Link><h1>Confirm and pay</h1></div>

          <div className="step">
            <h2>Your trip</h2>
            <div className="row between"><div><b>Dates</b><div className="muted">{fmt(inD)} – {fmt(outD)}</div></div><Link className="link" to={`/property/${p.id}`}>Edit</Link></div>
            <div className="row between" style={{ marginTop: 16 }}><div><b>Guests</b><div className="muted">{guests} guest{guests > 1 && 's'}</div></div></div>
          </div>

          <div className="step">
            <h2>Pay with</h2>
            <label className={`pay-opt ${method === 'mpesa' ? 'on' : ''}`}>
              <div className="mpesa">M-PESA</div>
              <div><b>M-Pesa</b><span>Pay with an STK push to your phone</span></div>
              <input type="radio" name="m" checked={method === 'mpesa'} onChange={() => setMethod('mpesa')} />
            </label>
            <label className={`pay-opt ${method === 'card' ? 'on' : ''}`}>
              <div className="card-i"><CreditCard size={22} /></div>
              <div><b>Credit or debit card</b><span>Visa, Mastercard</span></div>
              <input type="radio" name="m" checked={method === 'card'} onChange={() => setMethod('card')} />
            </label>
            {method === 'mpesa' ? (
              <label className="field" style={{ marginTop: 16 }}><span>M-Pesa phone number</span>
                <input className="input" inputMode="tel" placeholder="07XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
                {phone && !validPhone && <small style={{ color: '#c1253c' }}>Enter a valid Safaricom number, e.g. 0712 345 678</small>}
              </label>
            ) : (
              <div style={{ marginTop: 16 }}>
                <label className="field"><span>Card number</span><input className="input" inputMode="numeric" placeholder="1234 5678 9012 3456" /></label>
                <div className="form-grid"><label className="field"><span>Expiry</span><input className="input" placeholder="MM / YY" /></label><label className="field"><span>CVV</span><input className="input" placeholder="123" /></label></div>
              </div>
            )}
          </div>

          <div className="step">
            <h2>Message the host</h2>
            <textarea className="input" placeholder={`Tell ${p.host.name} about your trip and expected arrival time…`} value={msg} onChange={e => setMsg(e.target.value)} />
          </div>

          <div className="step" style={{ border: 0 }}>
            <label className="check" style={{ alignItems: 'flex-start' }}>
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ marginTop: 2, flex: 'none' }} />
              <span className="muted" style={{ fontSize: 14 }}>I agree to the <Link className="link" to="/legal/terms">terms</Link>, the <Link className="link" to="/legal/cancellation">cancellation policy</Link> and the house rules.</span>
            </label>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 20, minWidth: 220 }} disabled={!canPay} onClick={() => setPhase('stk')}>
              {method === 'mpesa' ? `Pay ${kes(total)} with M-Pesa` : `Pay ${kes(total)}`}
            </button>
          </div>
        </div>

        <aside className="summary">
          <div className="box">
            <div className="sum-prop">
              <Img src={p.images[0].replace('w=1200', 'w=400')} alt={p.title} />
              <div><small>{p.type}</small><b>{p.title}</b><small>★ {p.rating.toFixed(2)} ({p.reviews})</small></div>
            </div>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Price details</h2>
            <div className="price-lines" style={{ marginTop: 0 }}>
              <div className="row"><span>{kes(p.price)} × {nights} night{nights > 1 && 's'}</span><span>{kes(sub)}</span></div>
              <div className="row"><span>Cleaning fee</span><span>{kes(500)}</span></div>
              <div className="row"><span>Service fee</span><span>{kes(service)}</span></div>
              <div className="row total"><span>Total (KES)</span><span>{kes(total)}</span></div>
            </div>
            <p className="note" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}><ShieldCheck size={16} /> Payments are secure and protected</p>
          </div>
        </aside>
      </div>

      {phase === 'stk' && (
        <div className="overlay"><div className="modal"><div className="stk">
          {method === 'mpesa' ? (
            <>
              <div className="phone"><Smartphone size={34} /></div>
              <h2 style={{ marginBottom: 8 }}>Check your phone</h2>
              <p className="muted">We sent an M-Pesa prompt to <b>{phone}</b>. Enter your PIN to pay {kes(total)}.</p>
            </>
          ) : (
            <><div className="ring" /><h2 style={{ marginBottom: 8 }}>Processing payment…</h2></>
          )}
          <div className="ring" style={{ marginTop: 28, width: 36, height: 36, borderWidth: 4 }} />
          <p className="muted" style={{ fontSize: 13 }}>Waiting for confirmation. Please don’t close this page.</p>
          <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>Demo mode — no real payment is made.</p>
        </div></div></div>
      )}
      <span className="sr">{user?.email}</span>
    </div>
  )
}
