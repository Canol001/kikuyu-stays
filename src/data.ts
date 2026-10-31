export type Category =
  | 'Studios' | 'One-bedroom' | 'Two-bedroom' | 'Guest houses'
  | 'Holiday homes' | 'Serviced' | 'Monthly stays' | 'Bedsitters'

export interface Review { name: string; date: string; text: string; rating: number }
export interface Property {
  id: string; title: string; type: string; category: Category; area: string
  price: number; monthly?: number; rating: number; reviews: number
  bedrooms: number; beds: number; baths: number; guests: number
  images: string[]; amenities: string[]; description: string
  host: { name: string; years: number; superhost: boolean; avatar: string }
  featured?: boolean; instant?: boolean
}

const u = (id: string, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const categories: { name: Category; icon: string }[] = [
  { name: 'Studios', icon: 'Sofa' },
  { name: 'One-bedroom', icon: 'BedSingle' },
  { name: 'Two-bedroom', icon: 'BedDouble' },
  { name: 'Guest houses', icon: 'House' },
  { name: 'Holiday homes', icon: 'Trees' },
  { name: 'Serviced', icon: 'ConciergeBell' },
  { name: 'Monthly stays', icon: 'CalendarDays' },
  { name: 'Bedsitters', icon: 'DoorOpen' },
]

export const areas = ['Kikuyu Town', 'Gitaru', 'Regen', 'Thogoto', 'Lusigetti', 'Nachu', 'Ondiri', 'Kinoo']

export const allAmenities = [
  'Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Backup water tank',
  'Generator', 'Workspace', 'Garden', 'Balcony', 'Secure compound', 'CCTV', 'Breakfast included',
  'Pets allowed', 'Swimming pool',
]

const av = (id: string) => u(id, 200)

export const properties: Property[] = [
  {
    id: 'luxe-loft-kinoo', title: 'Luxe Loft with city views', type: 'Entire apartment', category: 'One-bedroom', area: 'Kinoo',
    price: 3800, monthly: 78000, rating: 4.92, reviews: 128, bedrooms: 1, beds: 1, baths: 1, guests: 2, featured: true, instant: true,
    images: [u('1522708323590-d24dbb6b0267'), u('1505693416388-ac5ce068fe85'), u('1484154218962-a197022b5858'), u('1560448204-e02f11c3d0e2'), u('1540518614846-7eded433c457')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Workspace', 'Balcony', 'Secure compound', 'CCTV'],
    description: 'A bright, modern one-bedroom loft on the Kinoo–Kikuyu corridor with floor-to-ceiling windows, a fully equipped kitchen and fast fibre Wi-Fi. Ten minutes from Kikuyu town and 25 minutes from Nairobi CBD via the Southern Bypass.',
    host: { name: 'Wanjiru', years: 4, superhost: true, avatar: av('1494790108377-be9c29b29330') },
  },
  {
    id: 'grandville-kikuyu', title: 'Grandville Garden Suite', type: 'Entire serviced apartment', category: 'Serviced', area: 'Kikuyu Town',
    price: 4500, monthly: 95000, rating: 4.88, reviews: 86, bedrooms: 2, beds: 3, baths: 2, guests: 4, featured: true,
    images: [u('1502672260266-1c1ef2d93688'), u('1560185007-cde436f6a4d0'), u('1556909114-f6e7ad7d3136'), u('1522771739844-6a9f6d5f14af'), u('1507089947368-19c1da9775ae')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Garden', 'Secure compound', 'Breakfast included'],
    description: 'Spacious two-bedroom serviced apartment with daily housekeeping, a private garden and 24-hour security. Perfect for families attending weddings and events, and for business travellers who want a home-like stay.',
    host: { name: 'Grandville Hosts', years: 6, superhost: true, avatar: av('1507003211169-0a1dd7228f2d') },
  },
  {
    id: 'cedar-serene-studio', title: 'Cedar Serene Studio', type: 'Entire studio', category: 'Studios', area: 'Regen',
    price: 2200, monthly: 42000, rating: 4.81, reviews: 64, bedrooms: 0, beds: 1, baths: 1, guests: 2, instant: true,
    images: [u('1493809842364-78817add7ffb'), u('1531835551805-16d864c8d311'), u('1595526114035-0d45ed16cfbf'), u('1556909114-f6e7ad7d3136')],
    amenities: ['Wi-Fi', 'Hot water', 'Kitchen', 'TV', 'Workspace', 'Secure compound', 'Backup water tank'],
    description: 'A calm, thoughtfully designed studio for solo travellers and couples. Compact but complete, with a queen bed, kitchenette and a dedicated desk for remote work.',
    host: { name: 'Brian', years: 2, superhost: false, avatar: av('1500648767791-00dcc994a43e') },
  },
  {
    id: 'thogoto-garden-cottage', title: 'Thogoto Garden Cottage', type: 'Entire cottage', category: 'Holiday homes', area: 'Thogoto',
    price: 6500, rating: 4.97, reviews: 203, bedrooms: 2, beds: 3, baths: 2, guests: 5, featured: true,
    images: [u('1518780664697-55e3ad937233'), u('1449844908441-8829872d2607'), u('1522771739844-6a9f6d5f14af'), u('1484154218962-a197022b5858'), u('1560448204-e02f11c3d0e2')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'Garden', 'Pets allowed', 'Generator', 'Secure compound', 'Breakfast included'],
    description: 'A charming stone cottage tucked in a mature garden near the Thogoto forest. Wake to birdsong, enjoy log-fire evenings and cook with produce from the local market. A favourite for weekend getaways.',
    host: { name: 'Mama Njeri', years: 7, superhost: true, avatar: av('1438761681033-6461ffad8d80') },
  },
  {
    id: 'gitaru-family-house', title: 'Gitaru Family Home', type: 'Entire home', category: 'Holiday homes', area: 'Gitaru',
    price: 8800, monthly: 180000, rating: 4.76, reviews: 41, bedrooms: 4, beds: 5, baths: 3, guests: 8,
    images: [u('1512917774080-9991f1c4c750'), u('1600596542815-ffad4c1539a9'), u('1600607687939-ce8a6c25118c'), u('1600566753190-17f0baa2a6c3'), u('1598928506311-c55ded91a20c')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Garden', 'Generator', 'CCTV', 'Swimming pool'],
    description: 'A four-bedroom home with a pool, large lawn and outdoor dining area. Ideal for funerals, weddings and family reunions when everyone needs to stay together.',
    host: { name: 'Kamau', years: 3, superhost: false, avatar: av('1472099645785-5658abf4ff4e') },
  },
  {
    id: 'ondiri-guest-house', title: 'Ondiri Swamp View Guest House', type: 'Private room in guest house', category: 'Guest houses', area: 'Ondiri',
    price: 2800, rating: 4.69, reviews: 52, bedrooms: 1, beds: 1, baths: 1, guests: 2,
    images: [u('1564013799919-ab600027ffc6'), u('1540518614846-7eded433c457'), u('1507089947368-19c1da9775ae'), u('1556909114-f6e7ad7d3136')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'TV', 'Breakfast included', 'Garden', 'Secure compound'],
    description: 'Quiet en-suite rooms in a family-run guest house, a short walk from the Ondiri wetland. Breakfast of mandazi, eggs and Kenyan tea is included.',
    host: { name: 'Mercy', years: 5, superhost: true, avatar: av('1544005313-94ddf0286df2') },
  },
  {
    id: 'lusigetti-two-bed', title: 'Lusigetti Two-Bedroom Retreat', type: 'Entire apartment', category: 'Two-bedroom', area: 'Lusigetti',
    price: 4200, monthly: 85000, rating: 4.84, reviews: 77, bedrooms: 2, beds: 2, baths: 2, guests: 4, instant: true,
    images: [u('1560448204-e02f11c3d0e2'), u('1600585154340-be6161a56a0c'), u('1505693416388-ac5ce068fe85'), u('1484154218962-a197022b5858')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Balcony', 'Backup water tank', 'CCTV'],
    description: 'Open-plan two-bedroom apartment in a gated development with reliable water and power backup. Close to Kikuyu campus and the Southern Bypass.',
    host: { name: 'Faith', years: 3, superhost: true, avatar: av('1534528741775-53994a69daeb') },
  },
  {
    id: 'nachu-bedsitter', title: 'Cosy Nachu Bedsitter', type: 'Entire bedsitter', category: 'Bedsitters', area: 'Nachu',
    price: 1500, monthly: 22000, rating: 4.62, reviews: 29, bedrooms: 0, beds: 1, baths: 1, guests: 2,
    images: [u('1595526114035-0d45ed16cfbf'), u('1531835551805-16d864c8d311'), u('1493809842364-78817add7ffb')],
    amenities: ['Wi-Fi', 'Hot water', 'Secure compound', 'Backup water tank'],
    description: 'Clean, affordable and quiet. A self-contained bedsitter for short stints, students and visiting lecturers who want good value near the campus.',
    host: { name: 'Peter', years: 1, superhost: false, avatar: av('1500648767791-00dcc994a43e') },
  },
  {
    id: 'kikuyu-town-studio', title: 'Kikuyu Town Central Studio', type: 'Entire studio', category: 'Studios', area: 'Kikuyu Town',
    price: 2500, monthly: 48000, rating: 4.79, reviews: 95, bedrooms: 0, beds: 1, baths: 1, guests: 2, instant: true,
    images: [u('1522708323590-d24dbb6b0267'), u('1493809842364-78817add7ffb'), u('1531835551805-16d864c8d311'), u('1556909114-f6e7ad7d3136')],
    amenities: ['Wi-Fi', 'Hot water', 'Kitchen', 'TV', 'Workspace', 'Secure compound', 'CCTV'],
    description: 'Walk to the market, matatu stage and restaurants. A smart studio on the third floor with a lift, great for business travellers on short trips.',
    host: { name: 'Wanjiru', years: 4, superhost: true, avatar: av('1494790108377-be9c29b29330') },
  },
  {
    id: 'regen-one-bed', title: 'Regen Modern One-Bedroom', type: 'Entire apartment', category: 'One-bedroom', area: 'Regen',
    price: 3200, monthly: 65000, rating: 4.86, reviews: 112, bedrooms: 1, beds: 1, baths: 1, guests: 3,
    images: [u('1502672260266-1c1ef2d93688'), u('1507089947368-19c1da9775ae'), u('1540518614846-7eded433c457'), u('1484154218962-a197022b5858')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Workspace', 'Balcony'],
    description: 'A stylish one-bedroom with a sofa bed, balcony and a quiet street. Fully furnished with everything you need for a week or a month.',
    host: { name: 'Brian', years: 2, superhost: false, avatar: av('1500648767791-00dcc994a43e') },
  },
  {
    id: 'kinoo-serviced', title: 'Kinoo Executive Serviced Suite', type: 'Entire serviced apartment', category: 'Serviced', area: 'Kinoo',
    price: 5200, monthly: 110000, rating: 4.94, reviews: 156, bedrooms: 2, beds: 2, baths: 2, guests: 4, featured: true,
    images: [u('1600585154340-be6161a56a0c'), u('1600607687939-ce8a6c25118c'), u('1600566753190-17f0baa2a6c3'), u('1598928506311-c55ded91a20c')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Workspace', 'Swimming pool', 'Generator', 'CCTV'],
    description: 'Hotel-standard serviced suite with gym and pool access, daily cleaning and a concierge desk. Our most booked stay for corporate guests.',
    host: { name: 'Luxe Hosts', years: 5, superhost: true, avatar: av('1507003211169-0a1dd7228f2d') },
  },
  {
    id: 'gitaru-monthly', title: 'Gitaru Monthly Furnished 1BR', type: 'Entire apartment', category: 'Monthly stays', area: 'Gitaru',
    price: 2600, monthly: 52000, rating: 4.71, reviews: 38, bedrooms: 1, beds: 1, baths: 1, guests: 2,
    images: [u('1560448204-e02f11c3d0e2'), u('1522771739844-6a9f6d5f14af'), u('1556909114-f6e7ad7d3136'), u('1507089947368-19c1da9775ae')],
    amenities: ['Wi-Fi', 'Free parking', 'Hot water', 'Kitchen', 'TV', 'Washing machine', 'Backup water tank'],
    description: 'Relocating to Kikuyu? Settle in with a fully furnished one-bedroom on a flexible monthly lease, utilities and Wi-Fi included.',
    host: { name: 'Faith', years: 3, superhost: true, avatar: av('1534528741775-53994a69daeb') },
  },
]

export const reviewsFor = (p: Property): Review[] => [
  { name: 'Achieng', date: 'September 2026', rating: 5, text: `Everything was exactly as described. ${p.host.name} was quick to respond and the place in ${p.area} was spotless.` },
  { name: 'Daniel', date: 'August 2026', rating: 5, text: 'Great location, secure compound and hot water every morning. Would book again for my next work trip.' },
  { name: 'Salma', date: 'August 2026', rating: 4, text: 'Lovely stay, check-in was smooth. Only small thing was the Wi-Fi dipping in the evenings.' },
  { name: 'James', date: 'July 2026', rating: 5, text: 'We stayed for a family wedding and it was perfect. Easy M-Pesa payment and clear directions.' },
]

export const kes = (n: number) => `KES ${n.toLocaleString('en-KE')}`
export const find = (id?: string) => properties.find(p => p.id === id)

export const nightsBetween = (a: string, b: string) => {
  if (!a || !b) return 0
  const d = Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
  return d > 0 ? d : 0
}
