import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [['/', 'Home'], ['/about', 'About'], ['/events', 'Events'], ['/gallery', 'Gallery'], ['/announcements', 'Announcements'], ['/contact', 'Contact']];

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  return <div className="min-h-screen">
    <div className="bg-kumkum px-4 py-2 text-center text-xs font-bold text-white">Ganpati Bappa Morya! Celebrating devotion, culture, and community.</div>
    <header className="sticky top-0 z-40 border-b border-kumkum/10 bg-cream/95 backdrop-blur">
      <div className="container-page flex min-h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3" onClick={close}>
          <span className="grid size-12 place-items-center rounded-full bg-kumkum font-display text-2xl text-marigold">श्री</span>
          <span><strong className="block font-display text-xl text-kumkum sm:text-2xl">Pachhapur Ka Samrat</strong><small className="block font-bold uppercase tracking-widest text-cocoa/60">Ganesh Utsav</small></span>
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {links.map(([to, label]) => <NavLink key={to} to={to} className={({ isActive }) => `text-sm font-bold transition hover:text-kumkum ${isActive ? 'text-kumkum' : 'text-cocoa/70'}`}>{label}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          {user ? <><Link className="btn-secondary !px-3" to={user.role === 'USER' ? '/dashboard' : '/admin'}><UserRound size={17} /> Dashboard</Link><button className="p-3 text-kumkum" title="Log out" onClick={() => { logout(); navigate('/'); }}><LogOut size={20} /></button></> : <Link className="btn-primary !px-4" to="/login">Sign in</Link>}
        </div>
        <button className="p-2 lg:hidden" title="Open menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && <nav className="container-page grid gap-1 border-t border-kumkum/10 py-3 lg:hidden">{links.map(([to, label]) => <NavLink key={to} to={to} onClick={close} className="rounded px-3 py-2 font-bold hover:bg-red-50">{label}</NavLink>)}<Link to={user ? (user.role === 'USER' ? '/dashboard' : '/admin') : '/login'} onClick={close} className="rounded bg-kumkum px-3 py-2 font-bold text-white">{user ? 'Dashboard' : 'Sign in'}</Link></nav>}
    </header>
    <main>{children}</main>
    <footer className="mt-20 bg-cocoa text-cream"><div className="container-page grid gap-8 py-12 md:grid-cols-3"><div><p className="font-display text-2xl text-marigold">Pachhapur Ka Samrat</p><p className="mt-2 max-w-sm text-sm text-cream/70">A community celebration rooted in devotion, seva, culture, and togetherness.</p></div><div><p className="font-bold text-marigold">Visit us</p><p className="mt-2 text-sm text-cream/70">Naduvin Pete Bazar Road, Pachhapur<br />Karnataka, India</p></div><div><p className="font-bold text-marigold">Quick links</p><div className="mt-2 flex gap-4 text-sm text-cream/70"><Link to="/events">Events</Link><Link to="/contact">Contact</Link><Link to="/login">Member login</Link></div></div></div><div className="border-t border-white/10 py-4 text-center text-xs text-cream/50">© 2026 Pachhapur Ka Samrat Utsav Mandal</div></footer>
  </div>;
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <section className="border-b border-kumkum/10 bg-gradient-to-br from-orange-50 via-cream to-yellow-50 py-14"><div className="container-page"><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 font-display text-4xl text-kumkum sm:text-5xl">{title}</h1>{children && <p className="mt-4 max-w-2xl text-cocoa/70">{children}</p>}</div></section>;
}