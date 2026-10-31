import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Sofa, BedSingle, BedDouble, House, Trees, ConciergeBell, CalendarDays, DoorOpen, Star, Heart, ChevronLeft, ChevronRight,
  Search, Minus, Plus, Wifi, Car, Droplets, CookingPot, Tv, WashingMachine, Zap, Laptop, Flower2, Building, ShieldCheck,
  Video, Coffee, PawPrint, Waves, type LucideIcon,
} from 'lucide-react'
import { kes, type Property } from '../data'
import { useStore } from '../store'

const catIcons: Record<string, LucideIcon> = { Sofa, BedSingle, BedDouble, House, Trees, ConciergeBell, CalendarDays, DoorOpen }
export const CatIcon = ({ name, size = 24 }: { name: string; size?: number }) => {
  const I = catIcons[name] ?? House
  return <I size={size} strokeWidth={1.6} />
}

const amenIcons: Record<string, LucideIcon> = {
  'Wi-Fi': Wifi, 'Free parking': Car, 'Hot water': Droplets, Kitchen: CookingPot, TV: Tv, 'Washing machine': WashingMachine,
  'Backup water tank': Droplets, Generator: Zap, Workspace: Laptop, Garden: Flower2, Balcony: Building, 'Secure compound': ShieldCheck,
  CCTV: Video, 'Breakfast included': Coffee, 'Pets allowed': PawPrint, 'Swimming pool': Waves,
}
export const AmenIcon = ({ name }: { name: string }) => {
  const I = amenIcons[name] ?? ShieldCheck
  return <I size={24} strokeWidth={1.5} />
}

export const Logo = () => (
  <Link to="/" className="logo" aria-label="Kikuyu Stays home">
    <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="9" fill="#ff385c" />
      <path d="M7 23V13l9-6 9 6v10h-5.5v-6.5h-7V23z" fill="#fff" />
    </svg>
    <span>kikuyustays</span>
  </Link>
)

export function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [bad, setBad] = useState(false)
  if (bad) return <div className={className} style={{ background: 'linear-gradient(135deg,#ffd9e0,#ffe9c9)', width: '100%', height: '100%' }} role="img" aria-label={alt} />
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setBad(true)} />
}

export const Stars = ({ n }: { n: number }) => (
  <div className="stars" aria-label={`${n} stars`}>
    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={13} fill={i <= n ? '#222' : 'none'} stroke="#222" />)}
  </div>
)

export function Counter({ value, set, min = 0, max = 16 }: { value: number; set: (n: number) => void; min?: number; max?: number }) {
  return (
    <div className="counter">
      <button type="button" disabled={value <= min} onClick={() => set(value - 1)} aria-label="decrease"><Minus size={14} /></button>
      <b>{value}{value === max ? '+' : ''}</b>
      <button type="button" disabled={value >= max} onClick={() => set(value + 1)} aria-label="increase"><Plus size={14} /></button>
    </div>
  )
}

export function PropertyCard({ p }: { p: Property }) {
  const { wishlist, toggleWish } = useStore()
  const [i, setI] = useState(0)
  const on = wishlist.includes(p.id)
  const go = (e: React.MouseEvent, d: number) => {
    e.preventDefault(); e.stopPropagation()
    setI((i + d + p.images.length) % p.images.length)
  }
  return (
    <Link to={`/property/${p.id}`} className="card">
      <div className="card-img">
        {p.featured && <span className="badge-top">Guest favourite</span>}
        <button
          className={`heart ${on ? 'on' : ''}`} aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={e => { e.preventDefault(); e.stopPropagation(); toggleWish(p.id) }}
        ><Heart size={26} /></button>
        <div className="slides" style={{ transform: `translateX(-${i * 100}%)` }}>
          {p.images.map((src, k) => <Img key={k} src={src.replace('w=1200', 'w=700')} alt={`${p.title} photo ${k + 1}`} />)}
        </div>
        <button className="card-arrow l" onClick={e => go(e, -1)} aria-label="Previous photo"><ChevronLeft size={16} /></button>
        <button className="card-arrow r" onClick={e => go(e, 1)} aria-label="Next photo"><ChevronRight size={16} /></button>
        <div className="dots">{p.images.slice(0, 5).map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
      </div>
      <div className="card-body">
        <div className="card-title">
          <span>{p.area}, Kikuyu</span>
          <span className="r"><Star size={13} fill="#222" />{p.rating.toFixed(2)}</span>
        </div>
        <div className="card-sub">{p.title}</div>
        <div className="card-sub">{p.type} · {p.guests} guests</div>
        <div className="card-price"><b>{kes(p.price)}</b> night</div>
      </div>
    </Link>
  )
}

export function SearchPill({ className = '', initial }: { className?: string; initial?: Record<string, string> }) {
  const nav = useNavigate()
  const [q, setQ] = useState(initial?.area ?? '')
  const [inD, setIn] = useState(initial?.in ?? '')
  const [outD, setOut] = useState(initial?.out ?? '')
  const [guests, setGuests] = useState(initial?.guests ?? '')
  const today = new Date().toISOString().slice(0, 10)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const sp = new URLSearchParams()
    if (q) sp.set('area', q)
    if (inD) sp.set('in', inD)
    if (outD) sp.set('out', outD)
    if (guests) sp.set('guests', guests)
    nav(`/explore?${sp.toString()}`)
  }
  return (
    <form className={`search-pill ${className}`} onSubmit={submit} role="search">
      <div className="sp-field">
        <label htmlFor="sp-where">Where</label>
        <select id="sp-where" value={q} onChange={e => setQ(e.target.value)}>
          <option value="">All of Kikuyu</option>
          {['Kikuyu Town', 'Gitaru', 'Regen', 'Thogoto', 'Lusigetti', 'Nachu', 'Ondiri', 'Kinoo'].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>
      <div className="sp-field">
        <label htmlFor="sp-in">Check in</label>
        <input id="sp-in" type="date" min={today} value={inD} onChange={e => { setIn(e.target.value); if (outD && e.target.value >= outD) setOut('') }} />
      </div>
      <div className="sp-field">
        <label htmlFor="sp-out">Check out</label>
        <input id="sp-out" type="date" min={inD || today} value={outD} onChange={e => setOut(e.target.value)} />
      </div>
      <div className="sp-field sp-last">
        <div style={{ flex: 1, minWidth: 0 }}>
          <label htmlFor="sp-g">Who</label>
          <select id="sp-g" value={guests} onChange={e => setGuests(e.target.value)}>
            <option value="">Add guests</option>
            {[1, 2, 3, 4, 5, 6, 8].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}{n === 8 ? '+' : ''}</option>)}
          </select>
        </div>
        <button className="sp-go" type="submit"><Search size={18} strokeWidth={2.5} /> Search</button>
      </div>
    </form>
  )
}

export function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" role="dialog" aria-modal aria-label={title}>
        <div className="modal-head">
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
          {title}
        </div>
        {children}
        {footer}
      </div>
    </div>
  )
}
