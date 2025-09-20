export const events = [
  {
    id: 1,
    name: 'Brewing the Base Layer',
    location: [37.5665, 126.9780], // Seoul, Korea
    lat: 37.5665,
    lng: 126.9780,
    city: 'Seoul',
    country: 'Korea',
    venue: 'Espresso Lounge',
    date: '20 Sep 2025, 4:00 pm',
    attendees: 250,
    type: 'tasting', // Updated: type is now tasting, workshop, or competition
    status: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Seoul skyline
    highlightsLink: 'https://twitter.com/EspressoSystems',
    registrationLink: 'https://example.com/register-seoul',
    description: 'Join us for an exclusive coffee tasting experience in the heart of Seoul. Discover the perfect blend of clubs, crypto, and coffee culture.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 2,
    name: 'Espresso Partner Brews KBW',
    location: [37.5535, 126.9675], // Seoul, Korea (Hannam area approx)
    lat: 37.5535,
    lng: 126.9675,
    city: 'Hannam',
    country: 'Korea',
    venue: 'mtl cafe & bakery',
    date: '22 Sep 2025, 12:00 pm',
    attendees: 100,
    type: 'workshop',
    status: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Seoul Hannam
    highlightsLink: 'https://twitter.com/EspressoSystems',
    registrationLink: 'https://example.com/register-hannam',
    description: 'Learn the art of coffee brewing with our expert partners. A hands-on workshop combining the best of crypto technology and coffee craftsmanship.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 3,
    name: "That's That Me Espresso Karaoke at KBW",
    location: [37.5665, 126.9780], // Seoul, Korea
    lat: 37.5665,
    lng: 126.9780,
    city: 'Seoul',
    country: 'Korea',
    venue: 'Karaoke Palace',
    date: '25 Sep 2025, 8:00 pm',
    attendees: 150,
    type: 'tasting',
    status: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Seoul
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 4,
    name: 'Buenos Aires Blockchain Week',
    location: [-34.6037, -58.3816], // Buenos Aires, Argentina
    lat: -34.6037,
    lng: -58.3816,
    city: 'Buenos Aires',
    country: 'Argentina',
    venue: 'Teatro Colón',
    date: '5 Oct 2025',
    attendees: 1800,
    featured: true,
    type: 'tasting',
    status: 'UPCOMING',
    image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Buenos Aires
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  // Past Events
  {
    id: 5,
    name: 'Espresso Brews WebX',
    location: [35.6895, 139.6917], // Tokyo, Japan
    lat: 35.6895,
    lng: 139.6917,
    city: 'Tokyo',
    country: 'Japan',
    venue: 'Tera Cafe Shien Zojo ji',
    date: '26 Aug 2025, 10:00 am',
    attendees: 200,
    type: 'workshop',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Tokyo
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 6,
    name: 'Ethereum 10Y Anniversary San Francisco',
    location: [37.7749, -122.4194], // San Francisco, CA, USA
    lat: 37.7749,
    lng: -122.4194,
    city: 'San Francisco',
    country: 'USA',
    venue: 'Frontier Tower',
    date: '30 Jul 2025, 4:00 pm',
    attendees: 500,
    featured: true,
    type: 'competition',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // San Francisco
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 7,
    name: 'Berlin Blockchain Week',
    location: [52.5200, 13.4050], // Berlin, Germany
    lat: 52.5200,
    lng: 13.4050,
    city: 'Berlin',
    country: 'Germany',
    venue: 'Tech Hub Berlin',
    date: '15 Nov 2024',
    attendees: 3000,
    featured: true,
    type: 'competition',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Berlin
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 8,
    name: 'Brussels Blockchain Summit',
    location: [50.8476, 4.3572], // Brussels, Belgium
    lat: 50.8476,
    lng: 4.3572,
    city: 'Brussels',
    country: 'Belgium',
    venue: 'The Grand Place',
    date: '25 Sep 2024',
    attendees: 2200,
    featured: true,
    type: 'competition',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1626231564263-f0d87e261b8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Brussels
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 9,
    name: 'Bangkok Crypto Conference',
    location: [13.7563, 100.5018], // Bangkok, Thailand
    lat: 13.7563,
    lng: 100.5018,
    city: 'Bangkok',
    country: 'Thailand',
    venue: 'Bangkok Convention Center',
    date: '12 Jul 2024',
    attendees: 2600,
    featured: true,
    type: 'competition',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Bangkok
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 10,
    name: 'Denver Blockchain Summit',
    location: [39.7392, -104.9903], // Denver, USA
    lat: 39.7392,
    lng: -104.9903,
    city: 'Denver',
    country: 'USA',
    venue: 'Denver Convention Center',
    date: 'June 2023',
    attendees: 1800,
    type: 'workshop',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1634507307799-ace9b49840b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Denver
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 11,
    name: 'New York Blockchain Week',
    location: [40.7128, -74.0060], // New York, USA
    lat: 40.7128,
    lng: -74.0060,
    city: 'New York',
    country: 'USA',
    venue: 'Manhattan Conference Center',
    date: 'November 2023',
    attendees: 2500,
    featured: true,
    type: 'competition',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // New York
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  },
  {
    id: 12,
    name: 'Cannes Blockchain Festival',
    location: [43.5528, 7.0174], // Cannes, France
    lat: 43.5528,
    lng: 7.0174,
    city: 'Cannes',
    country: 'France',
    venue: 'Palais des Festivals',
    date: 'May 2024',
    attendees: 2400,
    featured: true,
    type: 'tasting',
    status: 'PAST',
    image: 'https://images.unsplash.com/photo-1565623833408-d77e39b88af6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', // Cannes
    highlightsLink: 'https://twitter.com/EspressoSystems',
    description: 'Clubs, crypto, and coffee.',
    detailedInfo: 'Espresso with skyline energy.'
  }
];