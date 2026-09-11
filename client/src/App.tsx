import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { About, Announcements, Contact, Events, Gallery, Home } from './pages/PublicPages';
import { Dashboard, Donate, Login, Protected } from './pages/AccountPages';
import { Admin } from './pages/AdminPage';

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/events" element={<Events />} /><Route path="/gallery" element={<Gallery />} /><Route path="/announcements" element={<Announcements />} /><Route path="/contact" element={<Contact />} /><Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} /><Route path="/donate" element={<Protected><Donate /></Protected>} /><Route path="/admin" element={<Protected admin><Admin /></Protected>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Layout>;
}