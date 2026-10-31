import { Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Smartphone, ShieldCheck } from 'lucide-react'
import { Img, PropertyCard, CatIcon } from '../components/ui'
import SearchPanel from '../components/SearchPanel'
import { areas, categories, kes, properties } from '../data'

const areaImg: Record<string, string> = {
  'Kikuyu Town': '1522708323590-d24dbb6b0267', Gitaru: '1512917774080-9991f1c4c750', Regen: '1502672260266-1c1ef2d93688',
  Thogoto: '1518780664697-55e3ad937233', Lusigetti: '1560448204-e02f11c3d0e2', Nachu: '1595526114035-0d45ed16cfbf',
  Ondiri: '1564013799919-ab600027ffc6', Kinoo: '1600585154340-be6161a56a0c',
}

export default function Home() {
  const popular = properties.filter(p => p.featured)
  const budget = [...properties].sort((a, b) => a.price - b.price).slice(0, 6)
  return (
    <>
      <section className="hero">
        <Img className="hero-bg" alt="Cosy stay in Kikuyu" src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80" />
        <div className="hero-inner">
          <h1>Find your perfect stay in Kikuyu.</h1>
          <p>Verified apartments, studios, guest houses and holiday homes — hosted by locals who know the area best.</p>
          <SearchPanel start={null} inline />
        </div>
      </section>

      <div className="container">
        <div className="cats-bar" style={{ border: 0, marginTop: 24 }}>
          <div className="cats">
            {categories.map(c => (
              <Link key={c.name} className="cat" to={`/explore?cat=${encodeURIComponent(c.name)}`}>
                <CatIcon name={c.icon} /><span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <section className="section">
          <div className="section-head">
            <div><h2>Popular stays in Kikuyu</h2><p>Guest favourites, loved for comfort and value</p></div>
            <Link to="/explore" className="link">Show all</Link>
          </div>
          <div className="h-scroll">{popular.map(p => <PropertyCard key={p.id} p={p} />)}</div>
        </section>

        <section className="section">
          <div className="section-head">
            <div><h2>Great value from {kes(budget[0].price)}</h2><p>Comfortable stays that go easy on your budget</p></div>
            <Link to="/explore" className="link">Show all</Link>
          </div>
          <div className="h-scroll">{budget.map(p => <PropertyCard key={p.id} p={p} />)}</div>
        </section>

        <section className="section">
          <div className="section-head"><div><h2>Explore by neighbourhood</h2><p>From the town centre to quiet leafy corners</p></div></div>
          <div className="areas">
            {areas.map(a => (
              <Link key={a} to={`/explore?area=${encodeURIComponent(a)}`} className="area-tile">
                <Img alt={a} src={`https://images.unsplash.com/photo-${areaImg[a]}?auto=format&fit=crop&w=600&q=70`} />
                <div><b>{a}</b><span>{properties.filter(p => p.area === a).length} stays</span></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section" style={{ paddingTop: 72 }}>
          <div className="section-head"><div><h2>Why stay with Kikuyu Stays</h2></div></div>
          <div className="trust">
            <div className="trust-item"><div className="ico"><BadgeCheck /></div><h3>Verified properties</h3><p>Every home is inspected and every host is ID-verified before going live.</p></div>
            <div className="trust-item"><div className="ico"><Smartphone /></div><h3>Pay with M-Pesa</h3><p>Confirm your booking with a simple STK push straight to your phone.</p></div>
            <div className="trust-item"><div className="ico"><MapPin /></div><h3>Local knowledge</h3><p>Hosts who live in Kikuyu and share the best spots, shortcuts and eats.</p></div>
            <div className="trust-item"><div className="ico"><ShieldCheck /></div><h3>Safe &amp; secure</h3><p>Secure compounds, clear house rules and a support team when you need it.</p></div>
          </div>
        </section>
      </div>

      <section className="cta-band">
        <div className="txt">
          <h2>Have a space in Kikuyu? Start earning.</h2>
          <p>List your apartment, guest house or holiday home. Zero subscription at launch — we only earn when you do.</p>
          <div><Link to="/host-with-us" className="btn btn-primary btn-lg">Become a host</Link></div>
        </div>
        <Img alt="Host your home" src="https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1000&q=80" />
      </section>
    </>
  )
}
