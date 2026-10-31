import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { CatIcon, Counter, Modal, PropertyCard } from '../components/ui'
import { allAmenities, categories, properties } from '../data'

interface Filters { min: string; max: string; beds: number; amenities: string[]; instant: boolean }
const none: Filters = { min: '', max: '', beds: 0, amenities: [], instant: false }

export default function Explore() {
  const [sp, setSp] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [f, setF] = useState<Filters>(none)
  const [draft, setDraft] = useState<Filters>(none)
  const [sort, setSort] = useState('recommended')

  const area = sp.get('area') ?? ''
  const cat = sp.get('cat') ?? ''
  const guests = Number(sp.get('guests') ?? 0)

  const list = useMemo(() => {
    let r = properties.filter(p =>
      (!area || p.area === area) && (!cat || p.category === cat) && p.guests >= guests &&
      (!f.min || p.price >= +f.min) && (!f.max || p.price <= +f.max) && p.bedrooms >= f.beds &&
      (!f.instant || p.instant) && f.amenities.every(a => p.amenities.includes(a)))
    if (sort === 'low') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'high') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'rating') r = [...r].sort((a, b) => b.rating - a.rating)
    return r
  }, [area, cat, guests, f, sort])

  const setCat = (c: string) => {
    const n = new URLSearchParams(sp)
    if (!c || c === cat) n.delete('cat'); else n.set('cat', c)
    setSp(n)
  }
  const count = (f.min ? 1 : 0) + (f.max ? 1 : 0) + (f.beds ? 1 : 0) + f.amenities.length + (f.instant ? 1 : 0)
  const toggleAm = (a: string) => setDraft({ ...draft, amenities: draft.amenities.includes(a) ? draft.amenities.filter(x => x !== a) : [...draft.amenities, a] })

  return (
    <>
      <div className="cats-bar">
        <div className="container cats">
          {categories.map(c => (
            <button key={c.name} className={`cat ${cat === c.name ? 'on' : ''}`} onClick={() => setCat(c.name)}>
              <CatIcon name={c.icon} /><span>{c.name}</span>
            </button>
          ))}
          <div className="cats-filter">
            <button className="chip-btn" onClick={() => { setDraft(f); setOpen(true) }}>
              <SlidersHorizontal size={16} /> Filters{count > 0 && ` · ${count}`}
            </button>
          </div>
        </div>
      </div>

      <div className="container page-top">
        <div className="row between" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1>{area ? `Stays in ${area}` : cat || 'Stays in Kikuyu'}</h1>
            <p className="result-count">{list.length} stay{list.length !== 1 && 's'}{guests ? ` for ${guests}+ guests` : ''}</p>
          </div>
          <div className="row gap8">
            <button className="chip-btn" style={{ display: 'flex' }} onClick={() => { setDraft(f); setOpen(true) }}>
              <SlidersHorizontal size={16} /> Filters{count > 0 && ` · ${count}`}
            </button>
            <select className="select" style={{ width: 'auto', padding: '11px 14px' }} value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
              <option value="recommended">Recommended</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
        </div>

        {list.length ? (
          <div className="grid">{list.map(p => <PropertyCard key={p.id} p={p} />)}</div>
        ) : (
          <div className="empty">
            <h3>No exact matches</h3>
            <p className="muted" style={{ marginBottom: 20 }}>Try changing or removing some of your filters.</p>
            <button className="btn btn-outline" onClick={() => { setF(none); setSp({}) }}>Clear all filters</button>
          </div>
        )}
      </div>

      {open && (
        <Modal
          title="Filters" onClose={() => setOpen(false)}
          footer={
            <div className="modal-foot">
              <button className="link" onClick={() => setDraft(none)}>Clear all</button>
              <button className="btn btn-dark" onClick={() => { setF(draft); setOpen(false) }}>Show stays</button>
            </div>
          }
        >
          <div className="modal-body" style={{ paddingTop: 0 }}>
            <div className="filter-sec">
              <h3>Price range (per night)</h3>
              <div className="range">
                <label className="field" style={{ flex: 1 }}><span>Minimum (KES)</span><input className="input" inputMode="numeric" value={draft.min} onChange={e => setDraft({ ...draft, min: e.target.value.replace(/\D/g, '') })} placeholder="1,000" /></label>
                <label className="field" style={{ flex: 1 }}><span>Maximum (KES)</span><input className="input" inputMode="numeric" value={draft.max} onChange={e => setDraft({ ...draft, max: e.target.value.replace(/\D/g, '') })} placeholder="10,000" /></label>
              </div>
            </div>
            <div className="filter-sec">
              <h3>Bedrooms</h3>
              <div className="row between"><span>Minimum bedrooms</span><Counter value={draft.beds} set={n => setDraft({ ...draft, beds: n })} max={5} /></div>
            </div>
            <div className="filter-sec">
              <h3>Amenities</h3>
              <div className="chips">
                {allAmenities.map(a => <button key={a} className={`chip ${draft.amenities.includes(a) ? 'on' : ''}`} onClick={() => toggleAm(a)}>{a}</button>)}
              </div>
            </div>
            <div className="filter-sec" style={{ borderBottom: 0 }}>
              <label className="check">
                <input type="checkbox" checked={draft.instant} onChange={e => setDraft({ ...draft, instant: e.target.checked })} />
                <div><b>Instant Book</b><div className="muted" style={{ fontSize: 13 }}>Stays you can book without waiting for host approval</div></div>
              </label>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
