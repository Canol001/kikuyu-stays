import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Img } from '../components/ui'
import { kes } from '../data'
import { useStore } from '../store'

export function HostWithUs() {
  const { openAuth, user } = useStore()
  const nav = useNavigate()
  const [nights, setNights] = useState(10)
  const [rate, setRate] = useState(3500)
  const earn = Math.round(nights * rate * 0.9)
  return (
    <>
      <div className="page-hero"><div className="container">
        <h1>Turn your Kikuyu space into income.</h1>
        <p>Join a growing community of local hosts. List for free — we take a small commission only when you get a booking.</p>
        <div className="row gap12" style={{ marginTop: 28 }}>
          <button className="btn btn-primary btn-lg" onClick={() => user ? nav('/host') : openAuth('signup')}>Get started</button>
        </div>
      </div></div>
      <div className="container">
        <div className="two-col">
          <div className="earn">
            <span className="muted">Estimate your monthly earnings</span>
            <h3>{kes(earn)}</h3>
            <label><b>{nights} nights</b> per month</label>
            <input type="range" min={1} max={28} value={nights} onChange={e => setNights(+e.target.value)} />
            <label><b>{kes(rate)}</b> per night</label>
            <input type="range" min={1000} max={12000} step={100} value={rate} onChange={e => setRate(+e.target.value)} />
            <p className="muted" style={{ fontSize: 13 }}>After a 10% platform commission. Illustrative estimate only.</p>
          </div>
          <div>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>You host. We handle the rest.</h2>
            <p className="muted" style={{ fontSize: 17 }}>Manage bookings from your phone, get paid by M-Pesa and rely on our team to verify every guest and listing.</p>
          </div>
        </div>
        <h2 style={{ fontSize: 28, marginBottom: 24 }}>Start hosting in 3 steps</h2>
        <div className="steps3">
          <div><div className="n">1</div><h3>Tell us about your place</h3><p className="muted">Share the basics: location, rooms, amenities and photos.</p></div>
          <div><div className="n">2</div><h3>Get verified</h3><p className="muted">We confirm your ID and inspect the property before it goes live.</p></div>
          <div><div className="n">3</div><h3>Welcome your first guest</h3><p className="muted">Accept requests, host and get paid directly to M-Pesa.</p></div>
        </div>
        <div className="two-col"><Img alt="Hosting" src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80" />
          <div><h2 style={{ fontSize: 28, marginBottom: 12 }}>Questions? Answers.</h2>
            {[['How much does it cost?', 'Nothing to list. We take 8–10% commission on completed bookings.'],
              ['What documents do I need?', 'A national ID and proof of ownership or written authority to manage the property.'],
              ['When do I get paid?', 'Payouts are sent via M-Pesa shortly after guest check-in.']].map(([q, a]) =>
              <details className="faq" key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}
          </div>
        </div>
      </div>
    </>
  )
}

export function About() {
  return (
    <>
      <div className="page-hero"><div className="container"><h1>Kikuyu’s own place to find a stay.</h1><p>We are a locally managed marketplace connecting guests with verified homes across Kikuyu and its neighbourhoods.</p></div></div>
      <div className="container">
        <div className="two-col">
          <Img alt="Kikuyu" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80" />
          <div><h2 style={{ fontSize: 30, marginBottom: 12 }}>Local knowledge, verified properties</h2>
            <p className="muted" style={{ fontSize: 17, marginBottom: 14 }}>Whether you’re here for a wedding, a business trip, university or a fresh start, we help you find comfortable, trustworthy accommodation without the guesswork.</p>
            <p className="muted" style={{ fontSize: 17 }}>Every host is ID-verified and every property inspected, so you book with confidence.</p>
            <p style={{ marginTop: 20, display: 'flex', gap: 8, alignItems: 'center' }}><BadgeCheck color="#ff385c" /> <b>Verified hosts. Real photos. Fair prices.</b></p>
          </div>
        </div>
      </div>
    </>
  )
}

export function Contact() {
  const { notify } = useStore()
  return (
    <div className="container">
      <div className="contact-grid">
        <div>
          <h1 style={{ fontSize: 40, marginBottom: 14 }}>We’re here to help</h1>
          <p className="muted" style={{ marginBottom: 32, fontSize: 17 }}>Questions about a booking, hosting or a concern? Reach our Kikuyu-based support team.</p>
          <div className="info-line"><Phone /><div><b>+254 700 000 000</b><div className="muted">Mon–Sun, 7am – 9pm</div></div></div>
          <div className="info-line"><MessageCircle /><div><b>WhatsApp</b><div className="muted">Chat with us for quick answers</div></div></div>
          <div className="info-line"><Mail /><div><b>support@kikuyustays.co.ke</b></div></div>
          <div className="info-line"><MapPin /><div><b>Kikuyu Town</b><div className="muted">Kiambu County, Kenya</div></div></div>
        </div>
        <form className="panel" onSubmit={e => { e.preventDefault(); (e.target as HTMLFormElement).reset(); notify('Message sent — we’ll reply shortly') }}>
          <h3>Send us a message</h3>
          <label className="field"><span>Name</span><input className="input" required /></label>
          <label className="field"><span>Email</span><input className="input" type="email" required /></label>
          <label className="field"><span>Topic</span><select className="select"><option>Booking help</option><option>Hosting</option><option>Payments / refunds</option><option>Report a concern</option></select></label>
          <label className="field"><span>Message</span><textarea className="input" required /></label>
          <button className="btn btn-primary btn-block btn-lg">Send message</button>
        </form>
      </div>
    </div>
  )
}

const docs: Record<string, { title: string; body: [string, string][] }> = {
  terms: { title: 'Terms & conditions', body: [
    ['Using Kikuyu Stays', 'Kikuyu Stays is a marketplace connecting guests with independent hosts. By booking or listing you agree to these terms.'],
    ['Bookings and payments', 'Bookings are confirmed once the host accepts (or instantly where enabled) and payment is received via M-Pesa or card.'],
    ['Host responsibilities', 'Hosts must provide accurate listings, hold the required licences and permits, and maintain safe, clean accommodation.'],
    ['Guest responsibilities', 'Guests must follow house rules, treat the property with care and provide accurate booking information.'],
  ] },
  privacy: { title: 'Privacy policy', body: [
    ['What we collect', 'Name, contact details, ID information for verification, booking history and payment references.'],
    ['How we use it', 'To process bookings, verify identities, prevent fraud and improve our service, in line with the Kenya Data Protection Act.'],
    ['Your rights', 'You may request access, correction or deletion of your personal data by contacting support.'],
  ] },
  cancellation: { title: 'Cancellation & refund policy', body: [
    ['Free cancellation', 'Cancel within 48 hours of booking for a full refund, provided check-in is more than 7 days away.'],
    ['Flexible', 'Cancel at least 5 days before check-in for a full refund minus service fees.'],
    ['Late cancellations', 'Cancellations within 5 days of check-in are refunded 50% of the nightly rate.'],
    ['Refunds', 'Approved refunds are returned to your M-Pesa number or card within 3–5 working days.'],
  ] },
}

export function Legal() {
  const { doc = 'terms' } = useParams()
  const d = docs[doc] ?? docs.terms
  return (
    <div className="container"><div className="prose">
      <div className="legal-tabs" style={{ marginBottom: 24 }}>
        {Object.entries(docs).map(([k, v]) => <Link key={k} to={`/legal/${k}`} className={`chip ${doc === k ? 'on' : ''}`}>{v.title}</Link>)}
      </div>
      <h1>{d.title}</h1>
      {d.body.map(([h, t]) => <div key={h}><h2>{h}</h2><p>{t}</p></div>)}
      <p className="muted" style={{ marginTop: 32, fontSize: 13 }}>Template text for demonstration. Have your legal adviser review before launch.</p>
    </div></div>
  )
}
