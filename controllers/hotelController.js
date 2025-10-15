const Hotel = require('../models/Hotel');

// Comprehensive hardcoded hotel data for testing and demo
const HARDCODED_HOTELS = [
  // New York City Hotels
  {
    _id: 'hotel_001',
    name: 'The Plaza Hotel',
    location: 'New York, NY',
    rating: 4.8,
    pricePerNight: 595,
    amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Fitness Center', 'Room Service', 'Concierge', 'Valet Parking', 'Business Center'],
    description: 'Iconic luxury hotel in the heart of Manhattan, steps from Central Park and Fifth Avenue shopping.',
    availableRooms: 15,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/plaza-hotel.jpg'],
    address: '768 5th Ave, New York, NY 10019',
    phone: '+1-212-759-3000'
  },
  {
    _id: 'hotel_002',
    name: 'Pod Hotels Times Square',
    location: 'New York, NY',
    rating: 4.2,
    pricePerNight: 189,
    amenities: ['Free WiFi', 'Restaurant', 'Fitness Center', '24/7 Front Desk', 'Pet Friendly', 'Rooftop Bar'],
    description: 'Modern budget-friendly hotel in Times Square with compact, efficient rooms and great city views.',
    availableRooms: 32,
    status: 'active',
    starRating: 3,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    images: ['/images/pod-times-square.jpg'],
    address: '400 W 42nd St, New York, NY 10036',
    phone: '+1-212-830-1888'
  },
  {
    _id: 'hotel_003',
    name: 'The High Line Hotel',
    location: 'New York, NY',
    rating: 4.5,
    pricePerNight: 325,
    amenities: ['Free WiFi', 'Restaurant', 'Pet Friendly', 'Business Center', 'Garden', 'Historic Building'],
    description: 'Charming boutique hotel in Chelsea with Gothic Revival architecture and personalized service.',
    availableRooms: 8,
    status: 'active',
    starRating: 4,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/high-line-hotel.jpg'],
    address: '180 10th Ave, New York, NY 10011',
    phone: '+1-212-929-3888'
  },
  // Los Angeles Hotels
  {
    _id: 'hotel_004',
    name: 'The Beverly Hills Hotel',
    location: 'Los Angeles, CA',
    rating: 4.7,
    pricePerNight: 795,
    amenities: ['Spa', 'Pool', 'Restaurant', 'Fitness Center', 'Room Service', 'Valet Parking', 'Tennis Court', 'Garden'],
    description: 'Legendary pink palace in Beverly Hills, frequented by Hollywood stars since 1912.',
    availableRooms: 12,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/beverly-hills-hotel.jpg'],
    address: '9641 Sunset Blvd, Beverly Hills, CA 90210',
    phone: '+1-310-276-2251'
  },
  {
    _id: 'hotel_005',
    name: 'Hollywood Roosevelt Hotel',
    location: 'Los Angeles, CA',
    rating: 4.1,
    pricePerNight: 245,
    amenities: ['Pool', 'Restaurant', 'Fitness Center', 'Spa', 'Bar/Lounge', 'Historic Building', 'Rooftop Pool'],
    description: 'Historic Hollywood hotel on the Walk of Fame, home to the first Academy Awards ceremony.',
    availableRooms: 28,
    status: 'active',
    starRating: 4,
    checkInTime: '16:00',
    checkOutTime: '11:00',
    images: ['/images/roosevelt-hotel.jpg'],
    address: '7000 Hollywood Blvd, Hollywood, CA 90028',
    phone: '+1-323-466-7000'
  },
  {
    _id: 'hotel_006',
    name: 'Venice Beach Hotel',
    location: 'Los Angeles, CA',
    rating: 3.8,
    pricePerNight: 165,
    amenities: ['Free WiFi', 'Beach Access', 'Restaurant', 'Bar/Lounge', 'Bike Rentals', 'Pet Friendly'],
    description: 'Casual beachfront hotel steps from Venice Beach boardwalk and Santa Monica Pier.',
    availableRooms: 45,
    status: 'active',
    starRating: 3,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    images: ['/images/venice-beach-hotel.jpg'],
    address: '1515 Pacific Ave, Venice, CA 90291',
    phone: '+1-310-452-1111'
  },
  // London Hotels
  {
    _id: 'hotel_007',
    name: 'The Savoy',
    location: 'London, UK',
    rating: 4.9,
    pricePerNight: 685,
    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Room Service', 'Concierge', 'Business Center', 'Butler Service', 'Thames Views'],
    description: 'Legendary luxury hotel on the Strand with Art Deco elegance and unparalleled service.',
    availableRooms: 18,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/savoy-london.jpg'],
    address: 'Strand, London WC2R 0EZ, UK',
    phone: '+44-20-7836-4343'
  },
  {
    _id: 'hotel_008',
    name: 'Premier Inn London County Hall',
    location: 'London, UK',
    rating: 4.3,
    pricePerNight: 125,
    amenities: ['Free WiFi', 'Restaurant', 'Bar/Lounge', '24/7 Front Desk', 'Family Rooms', 'River Views'],
    description: 'Modern budget hotel with comfortable rooms and stunning views of the Thames and Big Ben.',
    availableRooms: 67,
    status: 'active',
    starRating: 3,
    checkInTime: '14:00',
    checkOutTime: '12:00',
    images: ['/images/premier-inn-london.jpg'],
    address: 'Belvedere Rd, London SE1 7PB, UK',
    phone: '+44-871-527-8648'
  },
  {
    _id: 'hotel_009',
    name: 'Zetter Townhouse Marylebone',
    location: 'London, UK',
    rating: 4.6,
    pricePerNight: 285,
    amenities: ['Free WiFi', 'Restaurant', 'Bar/Lounge', 'Pet Friendly', 'Historic Building', 'Garden', 'Afternoon Tea'],
    description: 'Charming boutique hotel in a Georgian townhouse with quirky British character.',
    availableRooms: 22,
    status: 'active',
    starRating: 4,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    images: ['/images/zetter-townhouse.jpg'],
    address: '28-30 Seymour St, London W1H 7JB, UK',
    phone: '+44-20-7324-4544'
  },
  // Paris Hotels
  {
    _id: 'hotel_010',
    name: 'Hotel Ritz Paris',
    location: 'Paris, France',
    rating: 4.8,
    pricePerNight: 895,
    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Pool', 'Room Service', 'Concierge', 'Valet Parking', 'Shopping Arcade'],
    description: 'Legendary palace hotel in Place Vendôme, epitome of Parisian luxury and elegance.',
    availableRooms: 9,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/ritz-paris.jpg'],
    address: '15 Place Vendôme, 75001 Paris, France',
    phone: '+33-1-43-16-30-30'
  },
  {
    _id: 'hotel_011',
    name: 'Hotel des Grands Boulevards',
    location: 'Paris, France',
    rating: 4.4,
    pricePerNight: 225,
    amenities: ['Free WiFi', 'Restaurant', 'Bar/Lounge', 'Garden', 'Pet Friendly', 'Historic Building'],
    description: 'Stylish boutique hotel near the Opéra with contemporary design and Parisian charm.',
    availableRooms: 34,
    status: 'active',
    starRating: 4,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/grands-boulevards.jpg'],
    address: '17 Boulevard Poissonnière, 75002 Paris, France',
    phone: '+33-1-85-73-33-33'
  },
  // Dubai Hotels
  {
    _id: 'hotel_012',
    name: 'Burj Al Arab Jumeirah',
    location: 'Dubai, UAE',
    rating: 4.9,
    pricePerNight: 1250,
    amenities: ['Spa', 'Restaurant', 'Pool', 'Beach Access', 'Butler Service', 'Helicopter Landing', 'Chauffeur Service', 'Private Beach'],
    description: 'World\'s most luxurious hotel, iconic sail-shaped tower offering unparalleled opulence.',
    availableRooms: 6,
    status: 'active',
    starRating: 7,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/burj-al-arab.jpg'],
    address: 'Jumeirah St, Dubai, UAE',
    phone: '+971-4-301-7777'
  },
  {
    _id: 'hotel_013',
    name: 'Rove Downtown Dubai',
    location: 'Dubai, UAE',
    rating: 4.2,
    pricePerNight: 195,
    amenities: ['Free WiFi', 'Pool', 'Fitness Center', 'Restaurant', 'Bar/Lounge', '24/7 Front Desk', 'Modern Design'],
    description: 'Contemporary hotel in Downtown Dubai with views of Burj Khalifa and Dubai Mall nearby.',
    availableRooms: 89,
    status: 'active',
    starRating: 4,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/rove-downtown.jpg'],
    address: 'Happiness St, Dubai, UAE',
    phone: '+971-4-243-8000'
  },
  // Miami Hotels
  {
    _id: 'hotel_014',
    name: 'The Fontainebleau Miami Beach',
    location: 'Miami, FL',
    rating: 4.3,
    pricePerNight: 385,
    amenities: ['Beach Access', 'Pool', 'Spa', 'Restaurant', 'Nightclub', 'Fitness Center', 'Water Sports', 'Kids Club'],
    description: 'Iconic oceanfront resort on Miami Beach with multiple pools, restaurants, and nightlife.',
    availableRooms: 145,
    status: 'active',
    starRating: 4,
    checkInTime: '16:00',
    checkOutTime: '11:00',
    images: ['/images/fontainebleau-miami.jpg'],
    address: '4441 Collins Ave, Miami Beach, FL 33140',
    phone: '+1-305-538-2000'
  },
  // San Francisco Hotels
  {
    _id: 'hotel_015',
    name: 'The St. Regis San Francisco',
    location: 'San Francisco, CA',
    rating: 4.6,
    pricePerNight: 545,
    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Room Service', 'Concierge', 'Business Center', 'Butler Service'],
    description: 'Luxury hotel in SOMA with contemporary design and impeccable service.',
    availableRooms: 23,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/st-regis-sf.jpg'],
    address: '125 3rd St, San Francisco, CA 94103',
    phone: '+1-415-284-4000'
  },
  {
    _id: 'hotel_016',
    name: 'Hotel Zephyr San Francisco',
    location: 'San Francisco, CA',
    rating: 4.1,
    pricePerNight: 225,
    amenities: ['Free WiFi', 'Restaurant', 'Fitness Center', 'Pet Friendly', 'Waterfront Views', 'Nautical Theme'],
    description: 'Playful nautical-themed hotel on Fisherman\'s Wharf with unique maritime decor.',
    availableRooms: 67,
    status: 'active',
    starRating: 4,
    checkInTime: '16:00',
    checkOutTime: '12:00',
    images: ['/images/hotel-zephyr.jpg'],
    address: '250 Beach St, San Francisco, CA 94133',
    phone: '+1-415-617-6565'
  },
  // Las Vegas Hotels
  {
    _id: 'hotel_017',
    name: 'The Bellagio Las Vegas',
    location: 'Las Vegas, NV',
    rating: 4.4,
    pricePerNight: 295,
    amenities: ['Casino', 'Pool', 'Spa', 'Restaurant', 'Show Venue', 'Shopping', 'Fine Dining', 'Fountains'],
    description: 'Elegant casino resort famous for its dancing fountains and upscale amenities.',
    availableRooms: 234,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    images: ['/images/bellagio-vegas.jpg'],
    address: '3600 Las Vegas Blvd S, Las Vegas, NV 89109',
    phone: '+1-702-693-7111'
  },
  {
    _id: 'hotel_018',
    name: 'The LINQ Hotel + Experience',
    location: 'Las Vegas, NV',
    rating: 3.9,
    pricePerNight: 89,
    amenities: ['Casino', 'Pool', 'Restaurant', 'Bar/Lounge', 'Shopping', 'Entertainment', 'High Roller Wheel'],
    description: 'Modern casino hotel at the center of the Strip with the High Roller observation wheel.',
    availableRooms: 345,
    status: 'active',
    starRating: 3,
    checkInTime: '16:00',
    checkOutTime: '11:00',
    images: ['/images/linq-vegas.jpg'],
    address: '3535 Las Vegas Blvd S, Las Vegas, NV 89109',
    phone: '+1-702-731-3311'
  },
  // Singapore Hotels
  {
    _id: 'hotel_019',
    name: 'Marina Bay Sands',
    location: 'Singapore',
    rating: 4.5,
    pricePerNight: 425,
    amenities: ['Infinity Pool', 'Casino', 'Spa', 'Restaurant', 'Shopping Mall', 'Observation Deck', 'Theater', 'Convention Center'],
    description: 'Iconic hotel with the world\'s largest rooftop infinity pool and stunning city views.',
    availableRooms: 78,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/marina-bay-sands.jpg'],
    address: '10 Bayfront Ave, Singapore 018956',
    phone: '+65-6688-8868'
  },
  {
    _id: 'hotel_020',
    name: 'Hotel Boss Singapore',
    location: 'Singapore',
    rating: 4.0,
    pricePerNight: 125,
    amenities: ['Free WiFi', 'Restaurant', 'Fitness Center', 'Business Center', '24/7 Front Desk', 'Modern Rooms'],
    description: 'Contemporary budget hotel in Lavender district with efficient service and modern amenities.',
    availableRooms: 156,
    status: 'active',
    starRating: 4,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/hotel-boss.jpg'],
    address: '500 Jalan Sultan, Singapore 199020',
    phone: '+65-6428-8388'
  },
  // Toronto Hotels
  {
    _id: 'hotel_021',
    name: 'The Ritz-Carlton Toronto',
    location: 'Toronto, Canada',
    rating: 4.7,
    pricePerNight: 485,
    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Pool', 'Room Service', 'Concierge', 'Business Center', 'Club Lounge'],
    description: 'Luxury hotel in the Entertainment District with panoramic city and lake views.',
    availableRooms: 34,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/ritz-carlton-toronto.jpg'],
    address: '181 Wellington St W, Toronto, ON M5V 3G7, Canada',
    phone: '+1-416-585-2500'
  },
  // Tokyo Hotels
  {
    _id: 'hotel_022',
    name: 'The Tokyo EDITION, Toranomon',
    location: 'Tokyo, Japan',
    rating: 4.8,
    pricePerNight: 565,
    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Bar/Lounge', 'Business Center', 'Modern Design', 'City Views'],
    description: 'Contemporary luxury hotel in Toranomon with sophisticated design and exceptional dining.',
    availableRooms: 28,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/edition-tokyo.jpg'],
    address: '4-1-1 Toranomon, Minato City, Tokyo 105-0001, Japan',
    phone: '+81-3-5422-1600'
  },
  {
    _id: 'hotel_023',
    name: 'Capsule Hotel Anshin Oyado Shimbashi',
    location: 'Tokyo, Japan',
    rating: 3.7,
    pricePerNight: 45,
    amenities: ['Free WiFi', 'Shared Bathroom', 'Lockers', 'Vending Machines', '24/7 Access', 'Compact Design'],
    description: 'Traditional Japanese capsule hotel experience in central Tokyo, perfect for solo travelers.',
    availableRooms: 234,
    status: 'active',
    starRating: 2,
    checkInTime: '16:00',
    checkOutTime: '10:00',
    images: ['/images/capsule-hotel-tokyo.jpg'],
    address: '2-1-3 Shimbashi, Minato City, Tokyo 105-0004, Japan',
    phone: '+81-3-3591-2391'
  },
  // Sydney Hotels
  {
    _id: 'hotel_024',
    name: 'Park Hyatt Sydney',
    location: 'Sydney, Australia',
    rating: 4.9,
    pricePerNight: 795,
    amenities: ['Harbor Views', 'Spa', 'Restaurant', 'Fitness Center', 'Pool', 'Room Service', 'Concierge', 'Opera House Views'],
    description: 'Luxury harbourside hotel with unparalleled views of Sydney Opera House and Harbour Bridge.',
    availableRooms: 18,
    status: 'active',
    starRating: 5,
    checkInTime: '15:00',
    checkOutTime: '12:00',
    images: ['/images/park-hyatt-sydney.jpg'],
    address: '7 Hickson Rd, The Rocks NSW 2000, Australia',
    phone: '+61-2-9241-1234'
  },
  {
    _id: 'hotel_025',
    name: 'YHA Sydney Harbour',
    location: 'Sydney, Australia',
    rating: 4.1,
    pricePerNight: 65,
    amenities: ['Harbor Views', 'Shared Kitchen', 'Common Areas', 'Laundry', 'Tour Desk', 'Budget Friendly', 'Hostel'],
    description: 'Award-winning hostel in The Rocks with stunning harbour views and excellent facilities.',
    availableRooms: 178,
    status: 'active',
    starRating: 3,
    checkInTime: '14:00',
    checkOutTime: '10:00',
    images: ['/images/yha-sydney.jpg'],
    address: '110 Cumberland St, The Rocks NSW 2000, Australia',
    phone: '+61-2-8272-0900'
  }
];

// Helper function to filter hotels by parameters
const filterHotelsByParams = (hotels, params) => {
  let filtered = [...hotels];
  
  // Filter by location
  if (params.location) {
    const locationName = params.location.trim().toLowerCase();
    filtered = filtered.filter(hotel => 
      hotel.location.toLowerCase().includes(locationName) ||
      hotel.name.toLowerCase().includes(locationName)
    );
  }
  
  // Filter by price range
  if (params.minPrice) {
    filtered = filtered.filter(hotel => hotel.pricePerNight >= parseInt(params.minPrice));
  }
  if (params.maxPrice) {
    filtered = filtered.filter(hotel => hotel.pricePerNight <= parseInt(params.maxPrice));
  }
  
  // Filter by rating
  if (params.minRating) {
    filtered = filtered.filter(hotel => hotel.rating >= parseFloat(params.minRating));
  }
  
  // Filter by amenities
  if (params.amenities && Array.isArray(params.amenities)) {
    filtered = filtered.filter(hotel => 
      params.amenities.some(amenity => 
        hotel.amenities.some(hotelAmenity => 
          hotelAmenity.toLowerCase().includes(amenity.toLowerCase())
        )
      )
    );
  }
  
  // Filter by star rating
  if (params.stars && Array.isArray(params.stars)) {
    filtered = filtered.filter(hotel => 
      params.stars.includes(hotel.starRating?.toString())
    );
  }
  
  // Filter by room availability
  if (params.rooms) {
    filtered = filtered.filter(hotel => hotel.availableRooms >= parseInt(params.rooms));
  }
  
  return filtered;
};

// Helper function to sort hotels
const sortHotels = (hotels, sortBy) => {
  const sorted = [...hotels];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'location':
      return sorted.sort((a, b) => a.location.localeCompare(b.location));
    default:
      return sorted.sort((a, b) => b.rating - a.rating || a.pricePerNight - b.pricePerNight);
  }
};

// Get all hotels (public) - for initial page load
const getAllHotelsPublic = async (req, res) => {
    try {
        console.log('🔍 Public hotels request received (using hardcoded data)');
        console.log('   Platform:', process.platform);
        
        // Use hardcoded hotels with basic sorting
        const hotels = sortHotels(HARDCODED_HOTELS, 'rating');
        
        console.log(`Found ${hotels.length} active hotels`);
        
        // Transform data to match frontend expectations
        const transformedHotels = hotels.map(hotel => ({
            id: hotel._id.toString(),
            _id: hotel._id,
            name: hotel.name,
            location: hotel.location,
            rating: hotel.rating,
            pricePerNight: hotel.pricePerNight,
            amenities: hotel.amenities || [],
            description: hotel.description,
            availableRooms: hotel.availableRooms,
            status: hotel.status,
            price: hotel.pricePerNight,
            rooms: hotel.availableRooms,
            starRating: hotel.starRating,
            reviews: Math.floor(Math.random() * 1000) + 100,
            images: hotel.images || [],
            address: hotel.address,
            phone: hotel.phone
        }));
        
        console.log('Sending public hotels:', transformedHotels.length);
        res.json({ success: true, data: transformedHotels, total: transformedHotels.length });
        
    } catch (error) {
        console.error('Public hotels fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching hotels', 
            error: error.message 
        });
    }
};

// Search hotels with enhanced filtering and Linux compatibility
const searchHotels = async (req, res) => {
    try {
        const { location, checkIn, checkOut, guests, priceRange, sortBy, filters } = req.body;
        
        // Enhanced logging for debugging
        console.log('🔍 Hotel search request received (using hardcoded data):');
        console.log('   Request body:', JSON.stringify(req.body, null, 2));
        console.log('   Platform:', process.platform);
        
        // Build search parameters for our hardcoded filter function
        let searchParams = {};
        
        // Location filter
        if (location) {
            searchParams.location = location;
        }
        
        // Price range filter
        if (priceRange && (priceRange.min || priceRange.max)) {
            if (priceRange.min) searchParams.minPrice = priceRange.min;
            if (priceRange.max) searchParams.maxPrice = priceRange.max;
        }
        
        // Room availability and guest capacity filter
        if (guests?.rooms && guests.rooms > 0) {
            searchParams.rooms = guests.rooms;
        }
        
        // Guest capacity (assuming 2 guests per room as default)
        if (guests?.adults || guests?.children) {
            const totalGuests = (guests.adults || 0) + (guests.children || 0);
            const requiredRooms = Math.ceil(totalGuests / 2); // Assuming 2 guests per room
            searchParams.rooms = Math.max(requiredRooms, guests?.rooms || 1);
        }
        
        // Apply additional filters from frontend
        if (filters) {
            // Rating filter
            if (filters.rating && filters.rating.min) {
                searchParams.minRating = filters.rating.min;
            }
            
            // Amenities filter
            if (filters.amenities && filters.amenities.length > 0) {
                searchParams.amenities = filters.amenities;
            }
            
            // Star rating filter
            if (filters.stars && filters.stars.length > 0) {
                searchParams.stars = filters.stars;
            }
        }
        
        console.log('Search parameters:', JSON.stringify(searchParams, null, 2));
        
        // Filter hotels using hardcoded data
        let hotels = filterHotelsByParams(HARDCODED_HOTELS, searchParams);
        
        console.log(`Found ${hotels.length} hotels matching search criteria`);
        
        // Sort hotels
        const sortedHotels = sortHotels(hotels, sortBy || 'rating');
        
        // Log sample hotels for debugging
        if (sortedHotels.length > 0) {
            console.log('Sample hotels found:');
            sortedHotels.slice(0, 3).forEach((hotel, index) => {
                console.log(`   ${index + 1}. ${hotel.name} in ${hotel.location} ($${hotel.pricePerNight}/night, Rating: ${hotel.rating})`);
            });
        } else {
            console.log('⚠️  No hotels found matching the search criteria');
        }
        
        // Transform data to match frontend expectations
        const transformedHotels = sortedHotels.map(hotel => ({
            id: hotel._id.toString(),
            _id: hotel._id,
            name: hotel.name,
            location: hotel.location,
            rating: hotel.rating,
            pricePerNight: hotel.pricePerNight,
            amenities: hotel.amenities || [],
            description: hotel.description,
            availableRooms: hotel.availableRooms,
            status: hotel.status,
            price: hotel.pricePerNight, // Alias for consistency
            rooms: hotel.availableRooms,
            starRating: hotel.starRating,
            reviews: Math.floor(Math.random() * 1000) + 100, // Mock reviews count
            images: hotel.images || [],
            address: hotel.address,
            phone: hotel.phone
        }));
        
        console.log('Sending transformed hotels:', transformedHotels.length);
        
        res.json({ 
            success: true, 
            data: transformedHotels, 
            total: transformedHotels.length,
            searchParams: searchParams // Include search params for debugging
        });
    } catch (error) {
        console.error('Hotel search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error searching hotels', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all hotels (admin)
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        res.json({ success: true, hotels });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
    }
};

// Get hotels debug (remove in production)
const getHotelsDebug = async (req, res) => {
    try {
        console.log('🔧 DEBUG: Fetching hotels without authentication');
        const hotels = await Hotel.find().sort({ createdAt: -1 });
        console.log(`Found ${hotels.length} hotels`);
        res.json({ success: true, hotels, debug: true });
    } catch (error) {
        console.error('Error in debug hotels route:', error);
        res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
    }
};

// Filter hotels using GET with query parameters (Linux-friendly)
const filterHotels = async (req, res) => {
    try {
        const { location, minPrice, maxPrice, minRating, sortBy, limit = 50, amenities, starRating } = req.query;
        
        console.log('🔍 Hotel filter request (GET, using hardcoded data):', req.query);
        
        // Build filter parameters for hardcoded data
        let filterParams = {};
        
        // Location filter
        if (location) {
            filterParams.location = location.trim();
        }
        
        // Price range filters
        if (minPrice) filterParams.minPrice = minPrice;
        if (maxPrice) filterParams.maxPrice = maxPrice;
        
        // Rating filter
        if (minRating) filterParams.minRating = minRating;
        
        // Additional filters from query params
        if (amenities) {
            // Handle comma-separated amenities or single amenity
            filterParams.amenities = amenities.includes(',') ? amenities.split(',').map(a => a.trim()) : [amenities];
        }
        
        if (starRating) {
            // Handle comma-separated star ratings or single rating
            filterParams.stars = starRating.includes(',') ? starRating.split(',').map(s => s.trim()) : [starRating];
        }
        
        console.log('Filter parameters:', JSON.stringify(filterParams, null, 2));
        
        // Filter hotels using hardcoded data
        let filteredHotels = filterHotelsByParams(HARDCODED_HOTELS, filterParams);
        
        // Sort hotels
        const sortedHotels = sortHotels(filteredHotels, sortBy || 'rating');
        
        // Apply limit
        const limitedHotels = sortedHotels.slice(0, parseInt(limit));
        
        console.log(`Found ${filteredHotels.length} hotels, returning ${limitedHotels.length} after limit`);
        
        // Transform data to match frontend expectations
        const transformedHotels = limitedHotels.map(hotel => ({
            id: hotel._id.toString(),
            _id: hotel._id,
            name: hotel.name,
            location: hotel.location,
            rating: hotel.rating,
            pricePerNight: hotel.pricePerNight,
            amenities: hotel.amenities || [],
            description: hotel.description,
            availableRooms: hotel.availableRooms,
            status: hotel.status,
            price: hotel.pricePerNight,
            rooms: hotel.availableRooms,
            starRating: hotel.starRating,
            reviews: Math.floor(Math.random() * 1000) + 100,
            images: hotel.images || [],
            address: hotel.address,
            phone: hotel.phone
        }));
        
        res.json({ success: true, data: transformedHotels, total: transformedHotels.length });
    } catch (error) {
        console.error('Hotel filter error:', error);
        res.status(500).json({ success: false, message: 'Error filtering hotels', error: error.message });
    }
};

// Get available locations
const getLocations = async (req, res) => {
    try {
        console.log('🔍 Getting locations from hardcoded data');
        
        // Get unique locations from hardcoded hotels
        const locations = [...new Set(HARDCODED_HOTELS.map(hotel => hotel.location))]
            .filter(location => location)
            .sort();
            
        console.log(`Found ${locations.length} unique locations:`, locations);
        res.json({ success: true, data: locations });
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ success: false, message: 'Error fetching locations', error: error.message });
    }
};

// Get available amenities
const getAmenities = async (req, res) => {
    try {
        console.log('🔍 Getting amenities from hardcoded data');
        
        // Get all amenities from hardcoded hotels and extract unique ones
        const allAmenities = HARDCODED_HOTELS.reduce((acc, hotel) => {
            if (hotel.amenities && hotel.amenities.length > 0) {
                acc.push(...hotel.amenities);
            }
            return acc;
        }, []);
        
        const uniqueAmenities = [...new Set(allAmenities)]
            .filter(amenity => amenity && amenity.trim())
            .sort();
            
        console.log(`Found ${uniqueAmenities.length} unique amenities:`, uniqueAmenities);
        res.json({ success: true, data: uniqueAmenities });
    } catch (error) {
        console.error('Error fetching amenities:', error);
        res.status(500).json({ success: false, message: 'Error fetching amenities', error: error.message });
    }
};

module.exports = {
    getAllHotelsPublic,
    searchHotels,
    filterHotels,
    getLocations,
    getAmenities,
    getAllHotels,
    getHotelsDebug
};
