import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import PropertyPage from './pages/Property'
import Checkout from './pages/Checkout'
import { GuestDashboard, Wishlist } from './pages/Guest'
import HostDashboard from './pages/Host'
import AdminDashboard from './pages/Admin'
import { About, Contact, HostWithUs, Legal } from './pages/Content'
import { useStore } from './store'
import type { ReactElement } from 'react'

function Guard({ children, role }: { children: ReactElement; role?: 'host' | 'admin' }) {
  const { user, openAuth } = useStore()
  if (!user) {
    return (
      <div className="center-card">
        <h1>Log in to continue</h1>
        <p className="muted" style={{ margin: '12px 0 24px' }}>You need an account to view this page.</p>
        <button className="btn btn-primary" onClick={() => openAuth('login')}>Log in</button>
      </div>
    )
  }
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="explore" element={<Explore />} />
        <Route path="property/:id" element={<PropertyPage />} />
        <Route path="checkout/:id" element={<Guard><Checkout /></Guard>} />
        <Route path="guest" element={<Guard><GuestDashboard /></Guard>} />
        <Route path="wishlist" element={<Guard><Wishlist /></Guard>} />
        <Route path="host" element={<Guard role="host"><HostDashboard /></Guard>} />
        <Route path="admin" element={<Guard role="admin"><AdminDashboard /></Guard>} />
        <Route path="host-with-us" element={<HostWithUs />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="legal/:doc" element={<Legal />} />
        <Route path="*" element={<div className="center-card"><h1>Page not found</h1></div>} />
      </Route>
    </Routes>
  )
}
