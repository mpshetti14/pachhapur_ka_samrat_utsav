export type FestivalEvent = { id: string; name: string; date: string; time: string; location: string; description: string };
export type Announcement = { id: string; title: string; content: string; important: boolean; createdAt: string };
export type GalleryImage = { id: string; title: string; imageUrl: string; altText: string };
export type Donation = { id: string; donorName: string; mobile: string; amount: string; purpose: string; paymentMethod: string; status: 'PENDING' | 'VERIFIED' | 'REJECTED'; createdAt: string };

const image = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

export const fallbackEvents: FestivalEvent[] = [
  { id: 'e1', name: 'Shri Ganesh Sthapana', date: '2026-09-14T00:00:00.000Z', time: '9:00 AM', location: 'Pachhapur Samrat Mandap', description: 'Traditional pran pratishtha, aarti, and community welcome.' },
  { id: 'e2', name: 'Maha Aarti & Bhajan Sandhya', date: '2026-09-18T00:00:00.000Z', time: '7:30 PM', location: 'Main Festival Stage', description: 'An evening of devotional music and collective maha aarti.' },
  { id: 'e3', name: 'Visarjan Procession', date: '2026-09-24T00:00:00.000Z', time: '4:00 PM', location: 'Pachhapur Naduvin Pete Bazar Road', description: 'Join the community procession and farewell celebrations.' },
];
export const fallbackAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Volunteer registrations are open', content: 'Join the seva team for mandap operations, prasad distribution, and event coordination.', important: true, createdAt: '2026-08-20' },
  { id: 'a2', title: 'Eco-friendly celebration', content: 'This year we continue our commitment to natural decorations and responsible visarjan.', important: false, createdAt: '2026-08-18' },
];
export const fallbackGallery: GalleryImage[] = [
  { id: 'g1', title: 'Chhappan Bhog Seva', imageUrl: image('ganesh-1.jpg'), altText: 'Ganesh shrine surrounded by an offering of traditional dishes' },
  { id: 'g2', title: 'Golden Bappa Darshan', imageUrl: image('ganesh-3.jpg'), altText: 'Golden Ganesh idol illuminated against a dark backdrop' },
  { id: 'g3', title: 'Floral Mandap', imageUrl: image('ganesh-4.jpg'), altText: 'Ganesh shrine decorated with bright flower garlands' },
  { id: 'g4', title: 'Murti Shala', imageUrl: image('ganesh-5.jpg'), altText: 'Artisans preparing Ganesh idols for the festival' },
  { id: 'g5', title: 'Eco-friendly Puja', imageUrl: image('ganesh-6.jpg'), altText: 'Ganesh puja decorated with leaves, flowers, lamps, and fruit' },
  { id: 'g6', title: 'Community Darshan', imageUrl: image('ganesh-1.jpg'), altText: 'Traditional home Ganesh celebration and prasad offering' },
];