import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Building2, ChevronLeft, ChevronRight, Home, Landmark, MapPin, Minus, Navigation, Plus, Search, Trees, type LucideIcon } from 'lucide-react'

export type Field = 'where' | 'when' | 'who'

const places: { name: string; sub: string; icon: LucideIcon; tone: string }[] = [
  { name: 'Kikuyu Town', sub: 'Shops, market and the matatu stage', icon: Building2, tone: 'red' },
  { name: 'Kinoo', sub: 'Modern apartments on the Southern Bypass', icon: Landmark, tone: 'pink' },
  { name: 'Regen', sub: 'Quiet and close to everything', icon: Home, tone: 'blue' },
  { name: 'Thogoto', sub: 'Leafy cottages near the forest', icon: Trees, tone: 'green' },
  { name: 'Gitaru', sub: 'Family homes with space to spare', icon: Home, tone: 'orange' },
  { name: 'Lusigetti', sub: 'Near Kikuyu campus', icon: Building2, tone: 'blue' },
  { name: 'Ondiri', sub: 'Next to the Ondiri wetland', icon: Trees, tone: 'green' },
  { name: 'Nachu', sub: 'Great value for longer stays', icon: Home, tone: 'grey' },
]

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const short = (s: string) => new Date(s + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

function DateRange({ inD, outD, onPick }: { inD: string; outD: string; onPick: (d: string) => void }) {
  const [offset, setOffset] = useState(0)
  const today = ymd(new Date())
  const months = [0, 1].map(k => { const b = new Date(); b.setDate(1); b.setMonth(b.getMonth() + offset + k); return b })
  return (
    <div className="sx-cal">
      <button type="button" className="sx-nav l" disabled={offset === 0} onClick={() => setOffset(offset - 1)} aria-label="Previous month"><ChevronLeft size={18} /></button>
      <button type="button" className="sx-nav r" onClick={() => setOffset(offset + 1)} aria-label="Next month"><ChevronRight size={18} /></button>
      <div className="cal">
        {months.map(m => {
          const total = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate()
          return (
            <div className="month" key={ymd(m)}>
              <h4>{m.toLocaleString('en', { month: 'long', year: 'numeric' })}</h4>
              <div className="days">
                {DOW.map((d, i) => <div className="dow" key={i}>{d}</div>)}
                {Array.from({ length: m.getDay() }).map((_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: total }, (_, i) => {
                  const s = ymd(new Date(m.getFullYear(), m.getMonth(), i + 1))
                  const sel = s === inD || s === outD
                  const rng = inD && outD && s > inD && s < outD
                  return <button type="button" key={s} disabled={s < today} className={`${sel ? 'sel' : ''} ${rng ? 'rng' : ''}`} onClick={() => onPick(s)}>{i + 1}</button>
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Row({ title, sub, value, set, min = 0, max = 16, disabledPlus }: { title: string; sub: string; value: number; set: (n: number) => void; min?: number; max?: number; disabledPlus?: boolean }) {
  return (
    <div className="sx-row">
      <div><b>{title}</b><span>{sub}</span></div>
      <div className="counter">
        <button type="button" disabled={value <= min} onClick={() => set(value - 1)} aria-label={`Fewer ${title}`}><Minus size={14} /></button>
        <b>{value}</b>
        <button type="button" disabled={value >= max || disabledPlus} onClick={() => set(value + 1)} aria-label={`More ${title}`}><Plus size={14} /></button>
      </div>
    </div>
  )
}

export default function SearchPanel({ start, onClose, inline }: { start: Field | null; onClose?: () => void; inline?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const [active, setActive] = useState<Field | null>(start)
  useEffect(() => {
    if (!inline) return
    const h = (e: MouseEvent) => { if (root.current && !root.current.contains(e.target as Node)) setActive(null) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [inline])
  const [area, setArea] = useState(sp.get('area') ?? '')
  const [q, setQ] = useState('')
  const [inD, setIn] = useState(sp.get('in') ?? '')
  const [outD, setOut] = useState(sp.get('out') ?? '')
  const [mode, setMode] = useState<'dates' | 'flex'>('dates')
  const [flex, setFlex] = useState(0)
  const [adults, setAdults] = useState(Number(sp.get('guests') ?? 0))
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [pets, setPets] = useState(0)

  const guests = adults + children
  const pick = (d: string) => {
    if (!inD || (inD && outD) || d <= inD) { setIn(d); setOut('') } else { setOut(d); setTimeout(() => setActive('who'), 250) }
  }
  const choose = (a: string) => { setArea(a); setQ(''); setActive('when') }
  const submit = () => {
    const p = new URLSearchParams()
    if (area) p.set('area', area)
    if (inD) p.set('in', inD)
    if (outD) p.set('out', outD)
    if (guests) p.set('guests', String(guests))
    nav(`/explore?${p.toString()}`)
    onClose?.()
    setActive(null)
  }
  const list = places.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))
  const toggle = (f: Field) => setActive(active === f ? null : f)
  const whenText = inD && outD ? `${short(inD)} – ${short(outD)}` : inD ? `${short(inD)} – …` : 'Add dates'
  const whoText = guests || infants || pets
    ? [guests ? `${guests} guest${guests > 1 ? 's' : ''}` : '', infants ? `${infants} infant${infants > 1 ? 's' : ''}` : '', pets ? `${pets} pet${pets > 1 ? 's' : ''}` : ''].filter(Boolean).join(', ')
    : 'Add guests'

  return (
    <div ref={root} className={`sx-bar ${active ? 'has-active' : ''}`} role="search">
      <div className={`sx-seg ${active === 'where' ? 'on' : ''}`} onClick={() => toggle('where')} role="button" tabIndex={0}>
        <label htmlFor="sx-q">Where</label>
        <input id="sx-q" autoComplete="off" placeholder="Search destinations" value={active === 'where' ? q || area : area}
          onFocus={() => setActive('where')} onClick={e => e.stopPropagation()}
          onChange={e => { setQ(e.target.value); setArea('') }} />
      </div>
      {active === 'where' && (
        <div className="sx-panel sx-where">
          <h5>{q ? 'Matching destinations' : 'Suggested destinations'}</h5>
          {!q && (
            <button type="button" className="sx-place" onClick={() => choose('')}>
              <span className="tile grey"><Navigation size={26} strokeWidth={1.4} /></span>
              <span><b>Anywhere in Kikuyu</b><small>Find what’s around you</small></span>
            </button>
          )}
          {list.map(p => (
            <button type="button" className="sx-place" key={p.name} onClick={() => choose(p.name)}>
              <span className={`tile ${p.tone}`}><p.icon size={26} strokeWidth={1.4} /></span>
              <span><b>{p.name}, Kikuyu</b><small>{p.sub}</small></span>
            </button>
          ))}
          {!list.length && <p className="muted" style={{ padding: 16 }}>No matching neighbourhoods. Try “Kikuyu Town”.</p>}
        </div>
      )}

      <div className={`sx-seg ${active === 'when' ? 'on' : ''}`} onClick={() => toggle('when')} role="button" tabIndex={0}>
        <label>When</label>
        <span className={inD ? 'val' : ''}>{whenText}</span>
      </div>
      {active === 'when' && (
        <div className="sx-panel sx-when">
          <div className="sx-switch">
            <button type="button" className={mode === 'dates' ? 'on' : ''} onClick={() => setMode('dates')}>Dates</button>
            <button type="button" className={mode === 'flex' ? 'on' : ''} onClick={() => setMode('flex')}>Flexible</button>
          </div>
          {mode === 'dates' ? (
            <>
              <DateRange inD={inD} outD={outD} onPick={pick} />
              <div className="sx-chips">
                {['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days', '± 14 days'].map((c, i) => (
                  <button type="button" key={c} className={`sx-chip ${flex === i ? 'on' : ''}`} onClick={() => setFlex(i)}>{c}</button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ padding: '24px 8px 8px' }}>
              <h5 style={{ marginBottom: 14 }}>Stay for a</h5>
              <div className="sx-chips" style={{ padding: 0 }}>
                {['Weekend', 'Week', 'Month'].map(c => <button type="button" key={c} className="sx-chip" onClick={() => setMode('dates')}>{c}</button>)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={`sx-seg sx-who ${active === 'who' ? 'on' : ''}`} onClick={() => toggle('who')} role="button" tabIndex={0}>
        <div style={{ minWidth: 0 }}>
          <label>Who</label>
          <span className={guests ? 'val' : ''}>{whoText}</span>
        </div>
        <button type="button" className="sx-go" onClick={e => { e.stopPropagation(); submit() }}>
          <Search size={18} strokeWidth={2.6} /><span>Search</span>
        </button>
      </div>
      {active === 'who' && (
        <div className="sx-panel sx-whop">
          <Row title="Adults" sub="Ages 13 or above" value={adults} set={setAdults} disabledPlus={guests >= 16} />
          <Row title="Children" sub="Ages 2 – 12" value={children} set={setChildren} disabledPlus={guests >= 16} />
          <Row title="Infants" sub="Under 2" value={infants} set={setInfants} max={5} />
          <Row title="Pets" sub="Bringing a service animal?" value={pets} set={setPets} max={3} />
          <p className="sx-note"><MapPin size={14} /> Pets are only accepted at some stays — check the amenities.</p>
        </div>
      )}
    </div>
  )
}
