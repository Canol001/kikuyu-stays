import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Award, BadgeCheck, CalendarCheck, ChevronLeft, ChevronRight, Grid2x2, Heart, KeyRound, Share, Star, X } from 'lucide-react'
import { AmenIcon, Img, Stars } from '../components/ui'
import { find, kes, nightsBetween, reviewsFor } from '../data'
import { useStore } from '../store'

const iso = (d: Date) => d.toISOString().slice(0, 10)
const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function Calendar({ inD, outD, onPick, id }: { inD: string; outD: string; onPick: (d: string) => void; id: string }) {
  const [offset, setOffset] = useState(0)
  const today = iso(new Date())
  // deterministic "booked" days so the demo shows blocked dates
  const seed = id.length
  const booked = (d: Date) => (d.getDate() * 7 + d.getMonth() * 3 + seed) % 11 === 0
  const months = [0, 1].map(k => {
    const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + offset + k)
    return base
  })
  return (
    <div style={{ position: 'relative' }}>
      <div className="row between" style={{ position: 'absolute', left: 0, right: 0, top: -4, pointerEvents: 'none' }}>
        <button disabled={offset === 0} style={{ pointerEvents: 'auto', opacity: offset === 0 ? 0.25 : 1 }} onClick={() => setOffset(offset - 1)} aria-label="Previous month"><ChevronLeft /></button>
        <button style={{ pointerEvents: 'auto' }} onClick={() => setOffset(offset + 1)} aria-label="Next month"><ChevronRight /></button>
      </div>
      <div className="cal">
        {months.map(m => {
          const first = m.getDay()
          const total = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate()
          return (
            <div className="month" key={m.toISOString()}>
              <h4>{m.toLocaleString('en', { month: 'long', year: 'numeric' })}</h4>
              <div className="days">
                {DOW.map((d, i) => <div className="dow" key={i}>{d}</div>)}
                {Array.from({ length: first }).map((_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: total }, (_, i) => {
                  const date = new Date(m.getFullYear(), m.getMonth(), i + 1)
                  const s = iso(new Date(date.getTime() - date.getTimezoneOffset() * 60000))
                  const past = s < today
                  const sel = s === inD || s === outD
                  const rng = inD && outD && s > inD && s < outD
                  return (
                    <button key={s} disabled={past || booked(date)} className={`${sel ? 'sel' : ''} ${rng ? 'rng' : ''}`} onClick={() => onPick(s)}>{i + 1}</button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PropertyPage() {
  const { id } = useParams()
  const p = find(id)
  const nav = useNavigate()
  const { wishlist, toggleWish, notify, user, openAuth } = useStore()
  const [inD, setIn] = useState('')
  const [outD, setOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [lb, setLb] = useState<number | null>(null)

  if (!p) return <div className="center-card"><h1>Stay not found</h1><Link className="btn btn-dark" style={{ marginTop: 20 }} to="/explore">Browse stays</Link></div>

  const nights = nightsBetween(inD, outD)
  const sub = nights * p.price
  const service = Math.round(sub * 0.1)
  const cleaning = nights ? 500 : 0
  const total = sub + service + cleaning
  const today = iso(new Date())
  const on = wishlist.includes(p.id)
  const reviews = reviewsFor(p)

  const pick = (d: string) => {
    if (!inD || (inD && outD) || d <= inD) { setIn(d); setOut('') } else setOut(d)
  }
  const reserve = () => {
    if (!nights) { notify('Select your check-in and check-out dates'); document.getElementById('book')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return }
    if (!user) { openAuth('login'); return }
    nav(`/checkout/${p.id}?in=${inD}&out=${outD}&guests=${guests}`)
  }
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); notify('Link copied to clipboard') } catch { notify('Copy the link from your address bar') }
  }

  const BookCard = ({ cls }: { cls: string }) => (
    <div className={`book-card ${cls}`} id={cls === 'desk' ? 'book' : undefined}>
      <div className="book-price">
        {nights ? <><span className="ul">{kes(sub)}</span> <small>for {nights} night{nights > 1 && 's'}</small></> : <><span>{kes(p.price)}</span> <small>night</small></>}
      </div>
      <div className="book-box">
        <div className="two">
          <div className="cell"><label htmlFor={`in-${cls}`}>Check-in</label><input id={`in-${cls}`} type="date" min={today} value={inD} onChange={e => { setIn(e.target.value); if (outD && e.target.value >= outD) setOut('') }} /></div>
          <div className="cell"><label htmlFor={`out-${cls}`}>Checkout</label><input id={`out-${cls}`} type="date" min={inD || today} value={outD} onChange={e => setOut(e.target.value)} /></div>
        </div>
        <div className="cell full"><label htmlFor={`g-${cls}`}>Guests</label>
          <select id={`g-${cls}`} value={guests} onChange={e => setGuests(+e.target.value)}>
            {Array.from({ length: p.guests }, (_, i) => <option key={i} value={i + 1}>{i + 1} guest{i ? 's' : ''}</option>)}
          </select>
        </div>
      </div>
      <button className="btn btn-primary btn-block btn-lg" onClick={reserve}>{nights ? (p.instant ? 'Reserve' : 'Request to book') : 'Check availability'}</button>
      {nights > 0 && (
        <>
          <p className="note">You won’t be charged yet</p>
          <div className="price-lines">
            <div className="row"><span className="link" style={{ fontWeight: 400 }}>{kes(p.price)} × {nights} night{nights > 1 && 's'}</span><span>{kes(sub)}</span></div>
            <div className="row"><span className="link" style={{ fontWeight: 400 }}>Cleaning fee</span><span>{kes(cleaning)}</span></div>
            <div className="row"><span className="link" style={{ fontWeight: 400 }}>Service fee</span><span>{kes(service)}</span></div>
            <div className="row total"><span>Total</span><span>{kes(total)}</span></div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="detail">
      <div className="detail-meta">
        <h1>{p.title}</h1>
        <div className="row gap8 share-save">
          <button onClick={share}><Share size={16} /> Share</button>
          <button onClick={() => toggleWish(p.id)}><Heart size={16} fill={on ? '#ff385c' : 'none'} stroke={on ? '#ff385c' : '#222'} /> {on ? 'Saved' : 'Save'}</button>
        </div>
      </div>

      <div className="gallery">
        {p.images.slice(0, 5).map((src, i) => (
          <div className="g" key={i} onClick={() => setLb(i)}><Img src={src} alt={`${p.title} photo ${i + 1}`} /></div>
        ))}
        <button className="show-all" onClick={() => setLb(0)}><Grid2x2 size={16} strokeWidth={2.2} /> Show all photos</button>
      </div>
      <div className="gallery-mobile">
        <div className="gm-track">{p.images.map((src, i) => <Img key={i} src={src} alt={`${p.title} photo ${i + 1}`} />)}</div>
      </div>

      <div className="detail-cols">
        <div>
          <div className="overview">
            <h2>{p.type} in {p.area}, Kikuyu</h2>
            <div>{p.guests} guests · {p.bedrooms === 0 ? 'Studio' : `${p.bedrooms} bedroom${p.bedrooms > 1 ? 's' : ''}`} · {p.beds} bed{p.beds > 1 && 's'} · {p.baths} bath{p.baths > 1 && 's'}</div>
          </div>
          {p.rating >= 4.8 ? (
            <a href="#reviews" className="fav-box">
              <div className="fav-badge"><Award size={30} strokeWidth={1.4} /><span>Guest<br />favourite</span></div>
              <p>One of the most loved homes on Kikuyu Stays, according to guests</p>
              <div className="fav-stat"><b>{p.rating.toFixed(2)}</b><Stars n={5} /></div>
              <div className="fav-stat"><b>{p.reviews}</b><small>Reviews</small></div>
            </a>
          ) : (
            <a href="#reviews" className="row gap8" style={{ marginTop: 16 }}><Star size={14} fill="#222" /><b>{p.rating.toFixed(2)}</b> · <span className="link">{p.reviews} reviews</span></a>
          )}
          <hr className="divider" />
          {p.host.superhost && <div className="feature"><Award size={26} strokeWidth={1.5} /><div><b>{p.host.name} is a Superhost</b><span>Experienced, highly rated hosts committed to great stays.</span></div></div>}
          <div className="feature"><KeyRound size={26} strokeWidth={1.5} /><div><b>Self check-in</b><span>Check yourself in with the secure key box or the caretaker on site.</span></div></div>
          <div className="feature"><BadgeCheck size={26} strokeWidth={1.5} /><div><b>Verified by Kikuyu Stays</b><span>Property inspected and host identity confirmed.</span></div></div>
          <div className="feature"><CalendarCheck size={26} strokeWidth={1.5} /><div><b>Free cancellation for 48 hours</b><span>Cancel within 48 hours of booking for a full refund.</span></div></div>
          <hr className="divider" />
          <p style={{ lineHeight: 1.65, fontSize: 16 }}>{p.description}</p>
          <hr className="divider" />

          <h2>What this place offers</h2>
          <div className="amen-grid">{p.amenities.map(a => <div key={a}><AmenIcon name={a} />{a}</div>)}</div>
          <hr className="divider" />

          <h2>{nights ? `${nights} night${nights > 1 ? 's' : ''} in ${p.area}` : 'Select check-in date'}</h2>
          <p className="muted" style={{ marginBottom: 22, marginTop: -10 }}>{inD && outD ? `${inD} → ${outD}` : 'Add your travel dates for exact pricing'}</p>
          <Calendar inD={inD} outD={outD} onPick={pick} id={p.id} />
          {(inD || outD) && <div style={{ textAlign: 'right', marginTop: 8 }}><button className="link" onClick={() => { setIn(''); setOut('') }}>Clear dates</button></div>}
          <hr className="divider" />

          <h2 id="reviews" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Star size={22} fill="#222" /> {p.rating.toFixed(2)} · {p.reviews} reviews</h2>
          <div className="reviews">
            {reviews.map(r => (
              <div className="review" key={r.name}>
                <div className="row"><span className="avatar lg" style={{ width: 44, height: 44, fontSize: 18 }}>{r.name[0]}</span><div><b>{r.name}</b><small>{r.date}</small></div></div>
                <Stars n={r.rating} /><p>{r.text}</p>
              </div>
            ))}
          </div>
          <hr className="divider" />

          <h2>Where you’ll be</h2>
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--line)', height: 320, position: 'relative' }}>
            <iframe title="Map" style={{ border: 0, width: '100%', height: '100%' }} loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.62%2C-1.30%2C36.72%2C-1.22&layer=mapnik" />
          </div>
          <p style={{ marginTop: 14 }}><b>{p.area}, Kikuyu, Kiambu County</b></p>
          <p className="muted">Exact address is shared after your booking is confirmed.</p>
          <hr className="divider" />

          <div className="host-row">
            <img src={p.host.avatar} alt={p.host.name} />
            <div><h3>Hosted by {p.host.name}</h3><span className="muted">{p.host.years} years hosting{p.host.superhost ? ' · Superhost' : ''}</span></div>
          </div>
          <hr className="divider" />
          <h2>House rules</h2>
          <div className="amen-grid muted">
            <div>Check-in after 2:00 PM</div><div>Checkout before 11:00 AM</div>
            <div>No parties or events</div><div>No smoking indoors</div>
          </div>
        </div>
        <aside><BookCard cls="desk" /></aside>
      </div>

      <div className="mobile-bar">
        <div><b>{kes(p.price)}</b> <span className="muted">night</span>{nights > 0 && <div className="muted" style={{ fontSize: 13 }}>{kes(total)} total</div>}</div>
        <button className="btn btn-primary" onClick={() => {
          if (!nights) document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })
          reserve()
        }}>{nights ? 'Reserve' : 'Check availability'}</button>
      </div>

      {lb !== null && (
        <div className="lightbox">
          <div className="lb-top"><button onClick={() => setLb(null)} aria-label="Close"><X /></button><span>{lb + 1} / {p.images.length}</span><span style={{ width: 40 }} /></div>
          <div className="lb-main">
            <button className="lb-nav l" onClick={() => setLb((lb - 1 + p.images.length) % p.images.length)} aria-label="Previous"><ChevronLeft /></button>
            <img src={p.images[lb]} alt={`${p.title} photo ${lb + 1}`} />
            <button className="lb-nav r" onClick={() => setLb((lb + 1) % p.images.length)} aria-label="Next"><ChevronRight /></button>
          </div>
        </div>
      )}
    </div>
  )
}
