import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Menu, Search, Globe, CircleUserRound, House as Home } from 'lucide-react'
import { Logo, Modal } from './ui'
import SearchPanel, { type Field } from './SearchPanel'
import { useStore } from '../store'

function AuthModal() {
  const { authOpen, openAuth, login } = useStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'guest' | 'host'>('guest')
  if (!authOpen) return null
  const signup = authOpen === 'signup'
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const isAdmin = email.toLowerCase().startsWith('admin')
    login({ name: signup ? name : email.split('@')[0] || 'Guest', email, role: isAdmin ? 'admin' : role })
  }
  return (
    <Modal title={signup ? 'Sign up' : 'Log in or sign up'} onClose={() => openAuth(null)}>
      <form className="modal-body" onSubmit={submit}>
        <h2>Welcome to Kikuyu Stays</h2>
        {signup && (
          <label className="field"><span>Full name</span>
            <input className="input" required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Wanjiku" /></label>
        )}
        <label className="field"><span>Email</span>
          <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        {signup && (
          <label className="field"><span>Phone (M-Pesa)</span>
            <input className="input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="07XX XXX XXX" inputMode="tel" /></label>
        )}
        <label className="field"><span>Password</span>
          <input className="input" type="password" required minLength={6} placeholder="••••••••" /></label>
        {signup && (
          <div className="chips" style={{ margin: '4px 0 16px' }}>
            <button type="button" className={`chip ${role === 'guest' ? 'on' : ''}`} onClick={() => setRole('guest')}>I want to book stays</button>
            <button type="button" className={`chip ${role === 'host' ? 'on' : ''}`} onClick={() => setRole('host')}>I want to host</button>
          </div>
        )}
        <button className="btn btn-primary btn-block btn-lg" type="submit">{signup ? 'Create account' : 'Continue'}</button>
        <div className="or">or</div>
        <button type="button" className="btn btn-outline btn-block" onClick={() => openAuth(signup ? 'login' : 'signup')}>
          {signup ? 'I already have an account' : 'Create a new account'}
        </button>
        <p className="note">Demo: use an email starting with “admin” to enter the admin dashboard.</p>
      </form>
    </Modal>
  )
}

function Header() {
  const { user, openAuth, logout } = useStore()
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<Field | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [sp] = useSearchParams()
  const where = pathname === '/explore' && sp.get('area') ? sp.get('area')! : 'Anywhere'
  const when = pathname === '/explore' && sp.get('in') ? 'Selected dates' : 'Anytime'
  const who = pathname === '/explore' && sp.get('guests') ? `${sp.get('guests')} guests` : 'Add guests'

  useEffect(() => { setOpen(false); setPanel(null) }, [pathname])
  useEffect(() => {
    if (!panel) return
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(null) }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [panel])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const dash = user?.role === 'admin' ? '/admin' : user?.role === 'host' ? '/host' : '/guest'
  return (
    <>
    {panel && <div className="sx-overlay" onClick={() => setPanel(null)} />}
    <header className={`header ${panel ? 'expanded' : ''}`}>
      <div className="container header-top">
        <Logo />
        {panel ? (
          <div className="sx-tabs"><span><Home size={26} strokeWidth={1.5} />Stays</span></div>
        ) : (
          <div className="mini-pill" role="search" aria-label="Search stays">
            <span className="mp-ico"><Home size={20} strokeWidth={1.6} /></span>
            <button className="mp-seg" onClick={() => setPanel('where')}>{where}</button>
            <button className="mp-seg" onClick={() => setPanel('when')}>{when}</button>
            <button className="mp-seg mp-guests" onClick={() => setPanel('who')}>{who}</button>
            <button className="mp-go" onClick={() => setPanel('where')} aria-label="Search"><Search size={15} strokeWidth={3} /></button>
          </div>
        )}
        <div className="header-right">
          <Link className="pill-link hide-sm" to="/host-with-us">Become a host</Link>
          <div className="menu-wrap" ref={ref}>
            <div className="row gap8">
              <button className="circle-btn hide-sm" aria-label="Language"><Globe size={18} /></button>
              <button className="circle-btn" onClick={() => setOpen(!open)} aria-label="Account" aria-expanded={open}>
                {user ? <b style={{ fontSize: 15 }}>{user.name[0].toUpperCase()}</b> : <CircleUserRound size={24} strokeWidth={1.5} />}
              </button>
              <button className="circle-btn" onClick={() => setOpen(!open)} aria-label="Menu"><Menu size={18} /></button>
            </div>
            {open && (
              <div className="menu">
                {user ? (
                  <>
                    <Link to={dash} className="strong">Dashboard</Link>
                    <Link to="/guest">Trips</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <hr />
                    <Link to="/host-with-us">Host your home</Link>
                    <Link to="/contact">Help centre</Link>
                    <button onClick={() => { logout(); nav('/') }}>Log out</button>
                  </>
                ) : (
                  <>
                    <button className="strong" onClick={() => { setOpen(false); openAuth('signup') }}>Sign up</button>
                    <button onClick={() => { setOpen(false); openAuth('login') }}>Log in</button>
                    <hr />
                    <Link to="/host-with-us">Host your home</Link>
                    <Link to="/contact">Help centre</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {panel && <div className="container sx-wrap"><SearchPanel start={panel} onClose={() => setPanel(null)} /></div>}
    </header>
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div>
            <h4>Support</h4>
            <ul>
              <li><Link to="/contact">Help centre</Link></li>
              <li><Link to="/legal/cancellation">Cancellation options</Link></li>
              <li><Link to="/contact">Report a concern</Link></li>
            </ul>
          </div>
          <div>
            <h4>Hosting</h4>
            <ul>
              <li><Link to="/host-with-us">List your home</Link></li>
              <li><Link to="/host-with-us">Host verification</Link></li>
              <li><Link to="/legal/terms">Hosting terms</Link></li>
            </ul>
          </div>
          <div>
            <h4>Areas</h4>
            <ul>
              {['Kikuyu Town', 'Gitaru', 'Regen', 'Thogoto'].map(a => <li key={a}><Link to={`/explore?area=${a}`}>{a}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Kikuyu Stays</h4>
            <ul>
              <li><Link to="/about">About us</Link></li>
              <li><Link to="/legal/privacy">Privacy policy</Link></li>
              <li><Link to="/legal/terms">Terms & conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Kikuyu Stays · Kikuyu, Kiambu County, Kenya</span>
          <span>English (KE) · KES</span>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  const { toast } = useStore()
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <>
      <Header />
      <main><Outlet /></main>
      <Footer />
      <AuthModal />
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
