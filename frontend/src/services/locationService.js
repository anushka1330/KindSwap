// Location Service for KindSwap Interactive India Map
// Supports: NGO/Volunteer locations, Donation locations, Pickup locations, Delivery locations, Matched exchanges

const STORAGE_KEY_LOCATIONS = 'kindswap_map_locations';
const STORAGE_KEY_CUSTOM_STATES = 'kindswap_custom_states';

export const INDIAN_STATES = [
  { name: 'Delhi NCR', lng: 77.1025, lat: 28.7041, zoom: 10, type: 'UT' },
  { name: 'Maharashtra', lng: 75.7139, lat: 19.7515, zoom: 6.5, type: 'State' },
  { name: 'Karnataka', lng: 75.7139, lat: 15.3173, zoom: 6.8, type: 'State' },
  { name: 'West Bengal', lng: 87.8550, lat: 22.9868, zoom: 7.0, type: 'State' },
  { name: 'Tamil Nadu', lng: 78.6569, lat: 11.1271, zoom: 7.0, type: 'State' },
  { name: 'Telangana', lng: 79.0193, lat: 18.1124, zoom: 7.0, type: 'State' },
  { name: 'Gujarat', lng: 71.1924, lat: 22.2587, zoom: 6.8, type: 'State' },
  { name: 'Rajasthan', lng: 74.2179, lat: 27.0238, zoom: 6.5, type: 'State' },
  { name: 'Uttar Pradesh', lng: 80.9462, lat: 26.8467, zoom: 6.5, type: 'State' },
  { name: 'Kerala', lng: 76.2711, lat: 10.8505, zoom: 7.2, type: 'State' },
  { name: 'Punjab', lng: 75.3412, lat: 31.1471, zoom: 7.2, type: 'State' },
  { name: 'Haryana', lng: 76.0856, lat: 29.0588, zoom: 7.5, type: 'State' },
  { name: 'Bihar', lng: 85.3131, lat: 25.0961, zoom: 7.0, type: 'State' },
  { name: 'Odisha', lng: 85.0985, lat: 20.9517, zoom: 7.0, type: 'State' },
  { name: 'Andhra Pradesh', lng: 80.0, lat: 15.9129, zoom: 6.8, type: 'State' },
  { name: 'Madhya Pradesh', lng: 77.4126, lat: 22.9734, zoom: 6.5, type: 'State' },
  { name: 'Assam', lng: 92.9376, lat: 26.2006, zoom: 7.0, type: 'State' },
  { name: 'Jharkhand', lng: 85.2799, lat: 23.6102, zoom: 7.2, type: 'State' },
  { name: 'Chhattisgarh', lng: 81.8661, lat: 21.2787, zoom: 6.8, type: 'State' },
  { name: 'Himachal Pradesh', lng: 77.1734, lat: 31.1048, zoom: 7.2, type: 'State' },
  { name: 'Uttarakhand', lng: 79.0193, lat: 30.0668, zoom: 7.2, type: 'State' },
  { name: 'Goa', lng: 74.1240, lat: 15.2993, zoom: 9.5, type: 'State' },
  { name: 'Jammu & Kashmir', lng: 74.7973, lat: 34.0837, zoom: 7.0, type: 'UT' },
  { name: 'Ladakh', lng: 77.5771, lat: 34.1526, zoom: 6.5, type: 'UT' },
  { name: 'Chandigarh', lng: 76.7794, lat: 30.7333, zoom: 11.0, type: 'UT' },
  { name: 'Tripura', lng: 91.9882, lat: 23.9408, zoom: 8.5, type: 'State' },
  { name: 'Manipur', lng: 93.9063, lat: 24.6637, zoom: 8.0, type: 'State' },
  { name: 'Meghalaya', lng: 91.3662, lat: 25.4670, zoom: 8.0, type: 'State' },
  { name: 'Nagaland', lng: 94.5624, lat: 26.1584, zoom: 8.0, type: 'State' },
  { name: 'Mizoram', lng: 92.9376, lat: 23.1645, zoom: 8.0, type: 'State' },
  { name: 'Sikkim', lng: 88.5122, lat: 27.5330, zoom: 9.0, type: 'State' },
  { name: 'Arunachal Pradesh', lng: 94.7278, lat: 28.2180, zoom: 7.0, type: 'State' },
  { name: 'Puducherry', lng: 79.8083, lat: 11.9416, zoom: 10.0, type: 'UT' },
  { name: 'Andaman & Nicobar', lng: 92.7359, lat: 11.7401, zoom: 7.0, type: 'UT' },
  { name: 'Dadra & Nagar Haveli', lng: 72.8397, lat: 20.4283, zoom: 9.0, type: 'UT' },
  { name: 'Lakshadweep', lng: 72.6369, lat: 10.5667, zoom: 9.0, type: 'UT' }
];

// Initial seed locations covering Indian cities and categories
const INITIAL_LOCATIONS = [
  // 1. NGOs & Volunteers
  {
    id: 'ngo-1',
    type: 'ngo',
    title: 'Goonj NGO Exchange Center',
    category: 'Clothes & Household Essentials',
    description: 'Collecting and channelizing surplus urban clothing, school materials, and sanitary essentials to rural communities.',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0760,
    longitude: 72.8777,
    status: 'active',
    contactName: 'Anand K. (Coordinator)',
    contactPhone: '+91 98201 44520',
    relatedId: 'ngo-profile-01',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'ngo-2',
    type: 'ngo',
    title: 'Robin Hood Army Food Hub',
    category: 'Pantry & Food Staples',
    description: 'Zero-waste community volunteer circle redistributing surplus cooked food and pantry staples to night shelters.',
    city: 'New Delhi',
    state: 'Delhi NCR',
    latitude: 28.6139,
    longitude: 77.2090,
    status: 'active',
    contactName: 'Rohit Verma',
    contactPhone: '+91 98110 55210',
    relatedId: 'ngo-profile-02',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'ngo-3',
    type: 'ngo',
    title: 'Akshaya Patra Learning Kit Center',
    category: 'Books & Education',
    description: 'Distributing pre-owned school books, backpacks, and STEM kits to underprivileged students.',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'active',
    contactName: 'Suresh Rao',
    contactPhone: '+91 99002 33410',
    relatedId: 'ngo-profile-03',
    verified: true,
    updatedAt: '2026-09-07'
  },
  {
    id: 'ngo-4',
    type: 'ngo',
    title: 'CRY Child Rights Resource Center',
    category: 'Books & Winter Wear',
    description: 'Educational resources and winter essentials collection drive for street children.',
    city: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5726,
    longitude: 88.3639,
    status: 'active',
    contactName: 'Mousumi Ghosh',
    contactPhone: '+91 98305 11200',
    relatedId: 'ngo-profile-04',
    verified: true,
    updatedAt: '2026-09-06'
  },
  {
    id: 'ngo-5',
    type: 'ngo',
    title: 'Bhumi Volunteer Network',
    category: 'Electronics & Learning Tools',
    description: 'Refurbishing pre-loved laptops, tablets, and scientific calculators for college students.',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    status: 'active',
    contactName: 'Karthik Subramanian',
    contactPhone: '+91 94440 88710',
    relatedId: 'ngo-profile-05',
    verified: true,
    updatedAt: '2026-09-05'
  },
  {
    id: 'ngo-6',
    type: 'ngo',
    title: 'Udaan Youth Foundation',
    category: 'Handicrafts & Sewing Kits',
    description: 'Empowering women artisans with shared sewing machinery, fabric cuts, and craft kits.',
    city: 'Jaipur',
    state: 'Rajasthan',
    latitude: 26.9124,
    longitude: 75.7873,
    status: 'active',
    contactName: 'Meenakshi Sharma',
    contactPhone: '+91 94140 33890',
    relatedId: 'ngo-profile-06',
    verified: true,
    updatedAt: '2026-09-06'
  },

  // 2. Donation Locations (Individuals Sharing Items)
  {
    id: 'don-1',
    type: 'donation',
    title: 'Warm Winter Coats & Woolen Blankets',
    category: 'Clothes & Wearables',
    description: '4 lightly used winter jackets (Sizes M & L) and 2 freshly dry-cleaned woolen blankets.',
    city: 'New Delhi',
    state: 'Delhi NCR',
    latitude: 28.5355,
    longitude: 77.2600,
    status: 'active',
    contactName: 'Pooja S. (Donor)',
    contactPhone: '+91 98188 90123',
    relatedId: 'item-coat-01',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'don-2',
    type: 'donation',
    title: "Children's Illustrated Storybooks (Set of 12)",
    category: 'Books & Education',
    description: 'Complete Amar Chitra Katha, Panchatantra, and English picture reading books for ages 6-12.',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9352,
    longitude: 77.6245,
    status: 'active',
    contactName: 'Aarav M. (Donor)',
    contactPhone: '+91 98450 12345',
    relatedId: 'item-book-02',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'don-3',
    type: 'donation',
    title: 'Organic Pantry Staples & Pulses',
    category: 'Pantry & Food Staples',
    description: '10 kg sealed wheat flour, basmati rice, lentils, and cold-pressed mustard oil.',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.1136,
    longitude: 72.8697,
    status: 'active',
    contactName: 'Sneha P.',
    contactPhone: '+91 98210 67890',
    relatedId: 'item-pantry-03',
    verified: true,
    updatedAt: '2026-09-07'
  },
  {
    id: 'don-4',
    type: 'donation',
    title: 'Refurbished Study Laptop (Intel i5)',
    category: 'Electronics & Learning Tools',
    description: 'Clean formatted laptop in excellent condition with fresh battery and web camera for online classes.',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.3850,
    longitude: 78.4867,
    status: 'active',
    contactName: 'Rohan D.',
    contactPhone: '+91 99890 54321',
    relatedId: 'item-laptop-04',
    verified: true,
    updatedAt: '2026-09-07'
  },
  {
    id: 'don-5',
    type: 'donation',
    title: 'Pediatric Wheelchair & Walking Crutches',
    category: 'Medical Essentials',
    description: 'Lightweight folding wheelchair in pristine condition with adjustable footrests.',
    city: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    status: 'active',
    contactName: 'Nisha R.',
    contactPhone: '+91 98220 99881',
    relatedId: 'item-medical-05',
    verified: true,
    updatedAt: '2026-09-06'
  },
  {
    id: 'don-6',
    type: 'donation',
    title: 'School Uniforms & Backpacks (Batch of 8)',
    category: 'Clothes & Wearables',
    description: 'Clean navy blue and white school uniforms with waterproof rain-proof school bags.',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 23.0225,
    longitude: 72.5714,
    status: 'active',
    contactName: 'Bhavin Patel',
    contactPhone: '+91 98250 44321',
    relatedId: 'item-uniform-06',
    verified: true,
    updatedAt: '2026-09-06'
  },

  // 3. Pickup Locations (Convenient Neighborhood Drop/Pickup Points)
  {
    id: 'pick-1',
    type: 'pickup',
    title: 'Connaught Place Community Locker Point',
    category: 'Central Drop-off Hub',
    description: 'Secure, contactless 24/7 community exchange locker hub for safe neighbor handovers.',
    city: 'New Delhi',
    state: 'Delhi NCR',
    latitude: 28.6315,
    longitude: 77.2167,
    status: 'active',
    contactName: 'Delhi Circle Host',
    contactPhone: '+91 11 2341 0000',
    relatedId: 'hub-cp-01',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'pick-2',
    type: 'pickup',
    title: 'Bandra West Zero-Waste Pickup Station',
    category: 'Suburban Exchange Hub',
    description: 'Located at Hill Road community center. Volunteers available for item sanitization & package checks.',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0596,
    longitude: 72.8295,
    status: 'active',
    contactName: 'Bandra Green Circle',
    contactPhone: '+91 22 2640 1234',
    relatedId: 'hub-bandra-02',
    verified: true,
    updatedAt: '2026-09-07'
  },
  {
    id: 'pick-3',
    type: 'pickup',
    title: 'Indiranagar 100ft Rd Helper Point',
    category: 'Neighborhood Drop Point',
    description: 'Open daily 9 AM - 8 PM for contactless item drop-offs and verified requests.',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9784,
    longitude: 77.6408,
    status: 'active',
    contactName: 'Bengaluru KindCircle',
    contactPhone: '+91 80 4120 5678',
    relatedId: 'hub-indiranagar-03',
    verified: true,
    updatedAt: '2026-09-06'
  },
  {
    id: 'pick-4',
    type: 'pickup',
    title: 'Salt Lake Sector V Tech Park Drop Hub',
    category: 'IT Park Exchange Hub',
    description: 'Convenient exchange spot for corporate donors and local volunteer groups.',
    city: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5867,
    longitude: 88.4178,
    status: 'active',
    contactName: 'Salt Lake Volunteer Desk',
    contactPhone: '+91 33 2357 8899',
    relatedId: 'hub-saltlake-04',
    verified: true,
    updatedAt: '2026-09-05'
  },

  // 4. Delivery Locations (Pending or Active Deliveries)
  {
    id: 'del-1',
    type: 'delivery',
    title: 'Noida Community Shelter Outreach',
    category: 'Direct Delivery Route',
    description: 'Volunteer vehicle dispatching 25 winter woolen packages to rural night shelters.',
    city: 'Noida',
    state: 'Uttar Pradesh',
    latitude: 28.5355,
    longitude: 77.3910,
    status: 'pending',
    contactName: 'Deepak V. (Volunteer Driver)',
    contactPhone: '+91 98102 77441',
    relatedId: 'delivery-noida-01',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'del-2',
    type: 'delivery',
    title: 'Thane Senior Citizens Welfare Home',
    category: 'Elderly Support Delivery',
    description: 'Delivering hearing aids, large-print books, and organic dry nutrition packages.',
    city: 'Thane',
    state: 'Maharashtra',
    latitude: 19.2183,
    longitude: 72.9781,
    status: 'pending',
    contactName: 'Pravin Joshi',
    contactPhone: '+91 98205 33219',
    relatedId: 'delivery-thane-02',
    verified: true,
    updatedAt: '2026-09-07'
  },

  // 5. Matched Exchanges (Donor to Beneficiary In-Progress)
  {
    id: 'match-1',
    type: 'match',
    title: 'Children’s Encyclopedia Batch Handover',
    category: 'Matched Exchange',
    description: 'Pooja S. matched with Oak Street Children’s NGO. Verified match, handover scheduled today.',
    city: 'New Delhi',
    state: 'Delhi NCR',
    latitude: 28.5921,
    longitude: 77.2290,
    status: 'active',
    contactName: 'Pooja S. ⇄ Oak Street NGO',
    contactPhone: '+91 98188 90123',
    relatedId: 'exchange-match-101',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'match-2',
    type: 'match',
    title: 'Winter Fleece & Shawl Circle Swap',
    category: 'Matched Exchange',
    description: 'Sneha P. matched with Maya R. · Picked up at Bandra station, awaiting confirmation.',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0178,
    longitude: 72.8478,
    status: 'active',
    contactName: 'Sneha P. ⇄ Maya R.',
    contactPhone: '+91 98210 67890',
    relatedId: 'exchange-match-102',
    verified: true,
    updatedAt: '2026-09-08'
  },
  {
    id: 'match-3',
    type: 'match',
    title: 'STEM Science Kits for Government School',
    category: 'Matched Exchange',
    description: 'Aarav M. matched with Indiranagar Youth Learning Circle. Scheduled for Friday.',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9279,
    longitude: 77.6271,
    status: 'active',
    contactName: 'Aarav M. ⇄ Learning Circle',
    contactPhone: '+91 98450 12345',
    relatedId: 'exchange-match-103',
    verified: true,
    updatedAt: '2026-09-07'
  }
];

export const LocationService = {
  // Retrieve all Indian states & Union Territories
  getAllStates() {
    try {
      const custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_STATES) || '[]');
      const names = new Set(INDIAN_STATES.map(s => s.name.toLowerCase()));
      const combined = [...INDIAN_STATES];
      for (const st of custom) {
        if (!names.has(st.name.toLowerCase())) {
          combined.push(st);
          names.add(st.name.toLowerCase());
        }
      }
      return combined;
    } catch {
      return [...INDIAN_STATES];
    }
  },

  // Allow dynamically adding ANY Indian state / city
  addCustomState({ name, lng, lat, zoom = 7.5, type = 'Custom State' }) {
    if (!name) return null;
    const states = LocationService.getAllStates();
    const existing = states.find(s => s.name.toLowerCase() === name.trim().toLowerCase());
    if (existing) {
      return existing;
    }
    const newState = {
      name: name.trim(),
      lng: parseFloat(lng) || 78.9629,
      lat: parseFloat(lat) || 22.5937,
      zoom: parseFloat(zoom) || 7.5,
      type
    };
    try {
      const custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_STATES) || '[]');
      custom.push(newState);
      localStorage.setItem(STORAGE_KEY_CUSTOM_STATES, JSON.stringify(custom));
    } catch (err) {
      console.warn('Could not save custom state to localStorage', err);
    }
    return newState;
  },

  // Retrieve state info by name
  getStateByName(stateName) {
    if (!stateName) return null;
    const all = LocationService.getAllStates();
    const clean = stateName.toLowerCase().replace(/, india/i, '').trim();
    return all.find(s => s.name.toLowerCase() === clean || clean.includes(s.name.toLowerCase()));
  },

  // Retrieve all locations with optional backend integration and fallback
  async getLocations() {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (apiUrl) {
      try {
        const res = await fetch(`${apiUrl}/locations`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch {
        // Silently fall back to cached / local data
      }
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_LOCATIONS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }

    // Return default seed data
    return [...INITIAL_LOCATIONS];
  },

  // Filter locations by type
  async getLocationsByType(type = 'all') {
    const locs = await LocationService.getLocations();
    if (!type || type === 'all') return locs;
    return locs.filter(l => l.type.toLowerCase() === type.toLowerCase());
  },

  // Filter locations by state
  async getLocationsByState(stateName) {
    const locs = await LocationService.getLocations();
    if (!stateName || stateName === 'All India' || stateName === 'India') return locs;
    const clean = stateName.toLowerCase().replace(/, india/i, '').trim();
    return locs.filter(l => l.state.toLowerCase() === clean || l.state.toLowerCase().includes(clean));
  },

  // Add new location (e.g., when donor posts a new donation)
  async addLocation(loc) {
    const locs = await LocationService.getLocations();
    const newLoc = {
      id: loc.id || `loc-${Date.now()}`,
      type: loc.type || 'donation',
      title: loc.title || 'Community Item',
      category: loc.category || 'General Essentials',
      description: loc.description || '',
      city: loc.city || 'New Delhi',
      state: loc.state || 'Delhi NCR',
      latitude: parseFloat(loc.latitude) || 28.6139,
      longitude: parseFloat(loc.longitude) || 77.2090,
      status: loc.status || 'active',
      contactName: loc.contactName || 'Community Member',
      contactPhone: loc.contactPhone || '',
      relatedId: loc.relatedId || null,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    locs.unshift(newLoc);
    try {
      localStorage.setItem(STORAGE_KEY_LOCATIONS, JSON.stringify(locs));
    } catch {
      // ignore
    }
    return newLoc;
  }
};
