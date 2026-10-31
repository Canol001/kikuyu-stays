import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

export interface User { name: string; email: string; role: 'guest' | 'host' | 'admin' }
export interface Trip {
  ref: string; propertyId: string; checkIn: string; checkOut: string
  guests: number; total: number; status: 'Pending' | 'Confirmed'
}
type AuthMode = null | 'login' | 'signup'

interface Store {
  user: User | null
  login: (u: User) => void
  logout: () => void
  wishlist: string[]
  toggleWish: (id: string) => void
  trips: Trip[]
  addTrip: (t: Trip) => void
  authOpen: AuthMode
  openAuth: (m: AuthMode) => void
  toast: string
  notify: (m: string) => void
}

const Ctx = createContext<Store>(null as unknown as Store)
export const useStore = () => useContext(Ctx)

function usePersist<T>(key: string, init: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init } catch { return init }
  })
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)) } catch { /* ignore */ } }, [key, v])
  return [v, setV]
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = usePersist<User | null>('ks.user', null)
  const [wishlist, setWishlist] = usePersist<string[]>('ks.wish', [])
  const [trips, setTrips] = usePersist<Trip[]>('ks.trips', [])
  const [authOpen, openAuth] = useState<AuthMode>(null)
  const [toast, setToast] = useState('')

  const notify = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(''), 2800) }, [])
  const toggleWish = (id: string) => {
    if (!user) { openAuth('login'); return }
    setWishlist(wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id])
  }

  return (
    <Ctx.Provider value={{
      user,
      login: u => { setUser(u); openAuth(null); notify(`Welcome, ${u.name.split(' ')[0]}!`) },
      logout: () => { setUser(null); notify('Logged out') },
      wishlist, toggleWish, trips, addTrip: t => setTrips([t, ...trips]), authOpen, openAuth, toast, notify,
    }}>{children}</Ctx.Provider>
  )
}
