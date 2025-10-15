const Flight = require('../models/Flight');

// Comprehensive hardcoded flight data for testing and demo
const HARDCODED_FLIGHTS = [
  // NYC to LAX flights
  {
    _id: 'flight_001',
    airline: 'Delta Air Lines',
    flightNumber: 'DL1234',
    from: 'NYC',
    to: 'LAX',
    depart: '06:00',
    return: '09:30',
    duration: '6h 30m',
    price: 299,
    stops: 0,
    availableSeats: 45,
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 4',
    status: 'active'
  },
  {
    _id: 'flight_002',
    airline: 'American Airlines',
    flightNumber: 'AA5678',
    from: 'NYC',
    to: 'LAX',
    depart: '08:15',
    return: '11:45',
    duration: '6h 30m',
    price: 325,
    stops: 0,
    availableSeats: 32,
    aircraft: 'Airbus A321',
    terminal: 'Terminal 8',
    status: 'active'
  },
  {
    _id: 'flight_003',
    airline: 'United Airlines',
    flightNumber: 'UA9012',
    from: 'NYC',
    to: 'LAX',
    depart: '14:30',
    return: '18:00',
    duration: '6h 30m',
    price: 275,
    stops: 1,
    availableSeats: 28,
    aircraft: 'Boeing 777-200',
    terminal: 'Terminal 7',
    status: 'active'
  },
  {
    _id: 'flight_004',
    airline: 'JetBlue Airways',
    flightNumber: 'B6345',
    from: 'NYC',
    to: 'LAX',
    depart: '19:45',
    return: '23:15',
    duration: '6h 30m',
    price: 310,
    stops: 0,
    availableSeats: 41,
    aircraft: 'Airbus A320',
    terminal: 'Terminal 5',
    status: 'active'
  },
  // LAX to NYC flights
  {
    _id: 'flight_005',
    airline: 'Delta Air Lines',
    flightNumber: 'DL2468',
    from: 'LAX',
    to: 'NYC',
    depart: '07:20',
    return: '15:50',
    duration: '5h 30m',
    price: 315,
    stops: 0,
    availableSeats: 38,
    aircraft: 'Boeing 737-900',
    terminal: 'Terminal 2',
    status: 'active'
  },
  {
    _id: 'flight_006',
    airline: 'Southwest Airlines',
    flightNumber: 'WN1357',
    from: 'LAX',
    to: 'NYC',
    depart: '11:00',
    return: '19:30',
    duration: '5h 30m',
    price: 245,
    stops: 1,
    availableSeats: 55,
    aircraft: 'Boeing 737-700',
    terminal: 'Terminal 1',
    status: 'active'
  },
  // NYC to LHR flights
  {
    _id: 'flight_007',
    airline: 'British Airways',
    flightNumber: 'BA117',
    from: 'NYC',
    to: 'LHR',
    depart: '21:55',
    return: '08:20',
    duration: '7h 25m',
    price: 650,
    stops: 0,
    availableSeats: 24,
    aircraft: 'Boeing 777-300ER',
    terminal: 'Terminal 7',
    status: 'active'
  },
  {
    _id: 'flight_008',
    airline: 'Virgin Atlantic',
    flightNumber: 'VS003',
    from: 'NYC',
    to: 'LHR',
    depart: '20:30',
    return: '07:05',
    duration: '7h 35m',
    price: 685,
    stops: 0,
    availableSeats: 18,
    aircraft: 'Airbus A350-1000',
    terminal: 'Terminal 4',
    status: 'active'
  },
  // LHR to NYC flights
  {
    _id: 'flight_009',
    airline: 'British Airways',
    flightNumber: 'BA112',
    from: 'LHR',
    to: 'NYC',
    depart: '11:25',
    return: '14:50',
    duration: '8h 25m',
    price: 675,
    stops: 0,
    availableSeats: 31,
    aircraft: 'Boeing 787-9',
    terminal: 'Terminal 5',
    status: 'active'
  },
  // NYC to CDG flights
  {
    _id: 'flight_010',
    airline: 'Air France',
    flightNumber: 'AF007',
    from: 'NYC',
    to: 'CDG',
    depart: '23:20',
    return: '12:35',
    duration: '8h 15m',
    price: 720,
    stops: 0,
    availableSeats: 22,
    aircraft: 'Airbus A380',
    terminal: 'Terminal 1',
    status: 'active'
  },
  // CDG to NYC flights
  {
    _id: 'flight_011',
    airline: 'Air France',
    flightNumber: 'AF006',
    from: 'CDG',
    to: 'NYC',
    depart: '14:15',
    return: '17:40',
    duration: '8h 25m',
    price: 695,
    stops: 0,
    availableSeats: 27,
    aircraft: 'Boeing 777-300ER',
    terminal: 'Terminal 2E',
    status: 'active'
  },
  // NYC to DXB flights
  {
    _id: 'flight_012',
    airline: 'Emirates',
    flightNumber: 'EK201',
    from: 'NYC',
    to: 'DXB',
    depart: '02:25',
    return: '22:50',
    duration: '12h 25m',
    price: 850,
    stops: 0,
    availableSeats: 15,
    aircraft: 'Airbus A380',
    terminal: 'Terminal 4',
    status: 'active'
  },
  // DXB to NYC flights
  {
    _id: 'flight_013',
    airline: 'Emirates',
    flightNumber: 'EK204',
    from: 'DXB',
    to: 'NYC',
    depart: '08:15',
    return: '14:30',
    duration: '13h 15m',
    price: 875,
    stops: 0,
    availableSeats: 19,
    aircraft: 'Boeing 777-300ER',
    terminal: 'Terminal 3',
    status: 'active'
  },
  // LAX to LHR flights
  {
    _id: 'flight_014',
    airline: 'British Airways',
    flightNumber: 'BA269',
    from: 'LAX',
    to: 'LHR',
    depart: '15:20',
    return: '10:45',
    duration: '11h 25m',
    price: 780,
    stops: 0,
    availableSeats: 26,
    aircraft: 'Boeing 787-9',
    terminal: 'Terminal B',
    status: 'active'
  },
  // LHR to LAX flights
  {
    _id: 'flight_015',
    airline: 'Virgin Atlantic',
    flightNumber: 'VS141',
    from: 'LHR',
    to: 'LAX',
    depart: '12:40',
    return: '16:05',
    duration: '11h 25m',
    price: 755,
    stops: 0,
    availableSeats: 33,
    aircraft: 'Airbus A350-1000',
    terminal: 'Terminal 3',
    status: 'active'
  },
  // Additional domestic US flights
  {
    _id: 'flight_016',
    airline: 'Alaska Airlines',
    flightNumber: 'AS1429',
    from: 'LAX',
    to: 'SFO',
    depart: '09:15',
    return: '10:45',
    duration: '1h 30m',
    price: 125,
    stops: 0,
    availableSeats: 67,
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 6',
    status: 'active'
  },
  {
    _id: 'flight_017',
    airline: 'Spirit Airlines',
    flightNumber: 'NK678',
    from: 'LAX',
    to: 'LAS',
    depart: '16:30',
    return: '17:45',
    duration: '1h 15m',
    price: 89,
    stops: 0,
    availableSeats: 89,
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    status: 'active'
  },
  {
    _id: 'flight_018',
    airline: 'Frontier Airlines',
    flightNumber: 'F91234',
    from: 'NYC',
    to: 'MIA',
    depart: '12:45',
    return: '15:30',
    duration: '2h 45m',
    price: 145,
    stops: 0,
    availableSeats: 72,
    aircraft: 'Airbus A321',
    terminal: 'Terminal 5',
    status: 'active'
  },
  // Asian routes
  {
    _id: 'flight_019',
    airline: 'Singapore Airlines',
    flightNumber: 'SQ21',
    from: 'NYC',
    to: 'SIN',
    depart: '23:55',
    return: '05:25',
    duration: '18h 30m',
    price: 1250,
    stops: 0,
    availableSeats: 12,
    aircraft: 'Airbus A350-900ULR',
    terminal: 'Terminal 4',
    status: 'active'
  },
  {
    _id: 'flight_020',
    airline: 'Japan Airlines',
    flightNumber: 'JL006',
    from: 'NYC',
    to: 'NRT',
    depart: '13:45',
    return: '16:35',
    duration: '14h 50m',
    price: 980,
    stops: 0,
    availableSeats: 21,
    aircraft: 'Boeing 777-300ER',
    terminal: 'Terminal 1',
    status: 'active'
  },
  // Additional routes for variety
  {
    _id: 'flight_021',
    airline: 'Lufthansa',
    flightNumber: 'LH401',
    from: 'NYC',
    to: 'FRA',
    depart: '22:30',
    return: '11:55',
    duration: '8h 25m',
    price: 620,
    stops: 0,
    availableSeats: 29,
    aircraft: 'Airbus A340-600',
    terminal: 'Terminal 1',
    status: 'active'
  },
  {
    _id: 'flight_022',
    airline: 'KLM',
    flightNumber: 'KL643',
    from: 'NYC',
    to: 'AMS',
    depart: '17:35',
    return: '06:25',
    duration: '7h 50m',
    price: 595,
    stops: 0,
    availableSeats: 34,
    aircraft: 'Boeing 777-200ER',
    terminal: 'Terminal 4',
    status: 'active'
  },
  {
    _id: 'flight_023',
    airline: 'Qantas',
    flightNumber: 'QF12',
    from: 'LAX',
    to: 'SYD',
    depart: '22:30',
    return: '06:05',
    duration: '15h 35m',
    price: 1180,
    stops: 0,
    availableSeats: 16,
    aircraft: 'Airbus A380',
    terminal: 'Terminal B',
    status: 'active'
  },
  {
    _id: 'flight_024',
    airline: 'Air Canada',
    flightNumber: 'AC759',
    from: 'NYC',
    to: 'YYZ',
    depart: '16:45',
    return: '18:15',
    duration: '1h 30m',
    price: 195,
    stops: 0,
    availableSeats: 58,
    aircraft: 'Airbus A220-300',
    terminal: 'Terminal 1',
    status: 'active'
  },
  {
    _id: 'flight_025',
    airline: 'Turkish Airlines',
    flightNumber: 'TK001',
    from: 'NYC',
    to: 'IST',
    depart: '01:15',
    return: '17:40',
    duration: '10h 25m',
    price: 745,
    stops: 0,
    availableSeats: 25,
    aircraft: 'Boeing 787-9',
    terminal: 'Terminal 1',
    status: 'active'
  }
];

// Helper function to filter flights
const filterFlightsByParams = (flights, params) => {
  let filtered = [...flights];
  
  // Filter by route
  if (params.from) {
    const fromCode = params.from.includes(' - ') ? params.from.split(' - ')[0].trim() : params.from.trim();
    filtered = filtered.filter(flight => 
      flight.from.toLowerCase().includes(fromCode.toLowerCase())
    );
  }
  
  if (params.to) {
    const toCode = params.to.includes(' - ') ? params.to.split(' - ')[0].trim() : params.to.trim();
    filtered = filtered.filter(flight => 
      flight.to.toLowerCase().includes(toCode.toLowerCase())
    );
  }
  
  // Filter by price range
  if (params.minPrice) {
    filtered = filtered.filter(flight => flight.price >= parseInt(params.minPrice));
  }
  if (params.maxPrice) {
    filtered = filtered.filter(flight => flight.price <= parseInt(params.maxPrice));
  }
  
  // Filter by airline
  if (params.airline && Array.isArray(params.airline)) {
    filtered = filtered.filter(flight => params.airline.includes(flight.airline));
  } else if (params.airline) {
    filtered = filtered.filter(flight => flight.airline === params.airline);
  }
  
  // Filter by stops
  if (params.stops !== undefined) {
    if (params.stops === '0' || params.stops === 'nonstop') {
      filtered = filtered.filter(flight => flight.stops === 0);
    } else if (params.maxStops) {
      filtered = filtered.filter(flight => flight.stops <= parseInt(params.maxStops));
    }
  }
  
  // Filter by departure time
  if (params.departureTime && Array.isArray(params.departureTime)) {
    filtered = filtered.filter(flight => {
      const hour = parseInt(flight.depart.split(':')[0]);
      return params.departureTime.some(timeSlot => {
        switch (timeSlot) {
          case 'morning': return hour >= 6 && hour < 12;
          case 'afternoon': return hour >= 12 && hour < 18;
          case 'evening': return hour >= 18 || hour < 6;
          default: return false;
        }
      });
    });
  } else if (params.departureTime) {
    const hour = parseInt(filtered[0]?.depart?.split(':')[0] || 0);
    const timeSlot = params.departureTime;
    filtered = filtered.filter(flight => {
      const flightHour = parseInt(flight.depart.split(':')[0]);
      switch (timeSlot) {
        case 'morning': return flightHour >= 6 && flightHour < 12;
        case 'afternoon': return flightHour >= 12 && flightHour < 18;
        case 'evening': return flightHour >= 18 || flightHour < 6;
        default: return true;
      }
    });
  }
  
  return filtered;
};

// Helper function to sort flights
const sortFlights = (flights, sortBy) => {
  const sorted = [...flights];
  
  switch (sortBy) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);
    case 'duration':
      return sorted.sort((a, b) => {
        const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]?.split('m')[0] || 0);
        const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]?.split('m')[0] || 0);
        return aDuration - bDuration;
      });
    case 'departure':
      return sorted.sort((a, b) => a.depart.localeCompare(b.depart));
    case 'arrival':
      return sorted.sort((a, b) => a.return.localeCompare(b.return));
    case 'airline':
      return sorted.sort((a, b) => a.airline.localeCompare(b.airline));
    default:
      return sorted.sort((a, b) => a.price - b.price);
  }
};

// Get all flights (public) - for initial page load
const getAllFlightsPublic = async (req, res) => {
    try {
        console.log('🔍 Public flights request received (using hardcoded data)');
        console.log('   Platform:', process.platform);
        
        // Use hardcoded flights with basic sorting
        const flights = sortFlights(HARDCODED_FLIGHTS, 'price');
        
        console.log(`Found ${flights.length} active flights`);
        
        // Transform data to match frontend expectations
        const transformedFlights = flights.map(flight => ({
            id: flight._id.toString(),
            _id: flight._id,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            from: flight.from,
            to: flight.to,
            depart: flight.depart,
            return: flight.return,
            price: flight.price,
            duration: flight.duration,
            stops: flight.stops,
            availableSeats: flight.availableSeats,
            status: flight.status,
            departureTime: flight.depart,
            arrivalTime: flight.return,
            aircraft: flight.aircraft || 'Boeing 737',
            terminal: flight.terminal || 'Terminal 1'
        }));
        
        console.log('Sending public flights:', transformedFlights.length);
        res.json({ success: true, data: transformedFlights, total: transformedFlights.length });
        
    } catch (error) {
        console.error('Public flights fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching flights', 
            error: error.message 
        });
    }
};

// Search flights with enhanced filtering and Linux compatibility
const searchFlights = async (req, res) => {
    try {
        const { from, to, depart, returnDate, passengers, class: flightClass, priceRange, sortBy, filters } = req.body;
        
        // Enhanced logging for debugging
        console.log('🔍 Flight search request received (using hardcoded data):');
        console.log('   Request body:', JSON.stringify(req.body, null, 2));
        console.log('   Platform:', process.platform);
        
        // Build search parameters for our hardcoded filter function
        let searchParams = {};
        
        // Location filters
        if (from) {
            searchParams.from = from;
        }
        if (to) {
            searchParams.to = to;
        }
        
        // Price range filter
        if (priceRange && (priceRange.min || priceRange.max)) {
            if (priceRange.min) searchParams.minPrice = priceRange.min;
            if (priceRange.max) searchParams.maxPrice = priceRange.max;
        }
        
        // Passenger capacity filter
        if (passengers) {
            const totalPassengers = (passengers.adults || 1) + (passengers.children || 0) + (passengers.infants || 0);
            if (totalPassengers > 0) {
                searchParams.minSeats = totalPassengers;
            }
        }
        
        // Apply additional filters from frontend
        if (filters) {
            // Airline filter
            if (filters.airlines && filters.airlines.length > 0) {
                searchParams.airline = filters.airlines;
            }
            
            // Stops filter
            if (filters.stops !== undefined) {
                if (filters.stops === 'nonstop') {
                    searchParams.stops = '0';
                } else if (filters.stops === '1stop') {
                    searchParams.maxStops = 1;
                }
            }
            
            // Time filters (departure time)
            if (filters.departureTime && filters.departureTime.length > 0) {
                searchParams.departureTime = filters.departureTime;
            }
        }
        
        console.log('Search parameters:', JSON.stringify(searchParams, null, 2));
        
        // Filter flights using hardcoded data
        let flights = filterFlightsByParams(HARDCODED_FLIGHTS, searchParams);
        
        // Apply passenger seat filter if needed
        if (searchParams.minSeats) {
            flights = flights.filter(flight => flight.availableSeats >= searchParams.minSeats);
        }
        
        console.log(`Found ${flights.length} flights matching search criteria`);
        
        // Sort flights
        const sortedFlights = sortFlights(flights, sortBy || 'price');
        
        // Log sample flights for debugging
        if (sortedFlights.length > 0) {
            console.log('Sample flights found:');
            sortedFlights.slice(0, 3).forEach((flight, index) => {
                console.log(`   ${index + 1}. ${flight.airline} ${flight.flightNumber}: ${flight.from} → ${flight.to} ($${flight.price})`);
            });
        } else {
            console.log('⚠️  No flights found matching the search criteria');
        }
        
        // Transform data to match frontend expectations
        const transformedFlights = sortedFlights.map(flight => ({
            id: flight._id.toString(),
            _id: flight._id,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            from: flight.from,
            to: flight.to,
            depart: flight.depart,
            return: flight.return,
            price: flight.price,
            duration: flight.duration,
            stops: flight.stops,
            availableSeats: flight.availableSeats,
            status: flight.status,
            departureTime: flight.depart,
            arrivalTime: flight.return,
            aircraft: flight.aircraft || 'Boeing 737',
            terminal: flight.terminal || 'Terminal 1'
        }));
        
        console.log('Sending transformed flights:', transformedFlights.length);
        
        res.json({ 
            success: true, 
            data: transformedFlights, 
            total: transformedFlights.length,
            searchParams: searchParams // Include search params for debugging
        });
    } catch (error) {
        console.error('Flight search error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error searching flights', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get all flights (admin)
const getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find().sort({ createdAt: -1 });
        res.json({ success: true, flights });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching flights', error: error.message });
    }
};

// Get flights debug (remove in production)
const getFlightsDebug = async (req, res) => {
    try {
        console.log('🔧 DEBUG: Fetching flights without authentication');
        const flights = await Flight.find().sort({ createdAt: -1 });
        console.log(`Found ${flights.length} flights`);
        res.json({ success: true, flights, debug: true });
    } catch (error) {
        console.error('Error in debug flights route:', error);
        res.status(500).json({ success: false, message: 'Error fetching flights', error: error.message });
    }
};

// Filter flights using GET with query parameters (Linux-friendly)
const filterFlights = async (req, res) => {
    try {
        const { from, to, minPrice, maxPrice, sortBy, limit = 50, airline, departureTime, stops } = req.query;
        
        console.log('🔍 Flight filter request (GET, using hardcoded data):', req.query);
        
        // Build filter parameters for hardcoded data
        let filterParams = {};
        
        // Location filters
        if (from) {
            filterParams.from = from.trim();
        }
        if (to) {
            filterParams.to = to.trim();
        }
        
        // Price range filters
        if (minPrice) filterParams.minPrice = minPrice;
        if (maxPrice) filterParams.maxPrice = maxPrice;
        
        // Additional filters from query params
        if (airline) {
            // Handle comma-separated airlines or single airline
            filterParams.airline = airline.includes(',') ? airline.split(',').map(a => a.trim()) : airline;
        }
        
        if (departureTime) {
            // Handle comma-separated departure times or single time
            filterParams.departureTime = departureTime.includes(',') ? 
                departureTime.split(',').map(t => t.trim()) : [departureTime];
        }
        
        if (stops !== undefined) {
            filterParams.stops = stops;
        }
        
        console.log('Filter parameters:', JSON.stringify(filterParams, null, 2));
        
        // Filter flights using hardcoded data
        let filteredFlights = filterFlightsByParams(HARDCODED_FLIGHTS, filterParams);
        
        // Sort flights
        const sortedFlights = sortFlights(filteredFlights, sortBy || 'price');
        
        // Apply limit
        const limitedFlights = sortedFlights.slice(0, parseInt(limit));
        
        console.log(`Found ${filteredFlights.length} flights, returning ${limitedFlights.length} after limit`);
        
        // Transform data to match frontend expectations
        const transformedFlights = limitedFlights.map(flight => ({
            id: flight._id.toString(),
            _id: flight._id,
            airline: flight.airline,
            flightNumber: flight.flightNumber,
            from: flight.from,
            to: flight.to,
            depart: flight.depart,
            return: flight.return,
            price: flight.price,
            duration: flight.duration,
            stops: flight.stops,
            availableSeats: flight.availableSeats,
            status: flight.status,
            departureTime: flight.depart,
            arrivalTime: flight.return,
            aircraft: flight.aircraft || 'Boeing 737',
            terminal: flight.terminal || 'Terminal 1'
        }));
        
        res.json({ success: true, data: transformedFlights, total: transformedFlights.length });
    } catch (error) {
        console.error('Flight filter error:', error);
        res.status(500).json({ success: false, message: 'Error filtering flights', error: error.message });
    }
};

// Get available airlines
const getAirlines = async (req, res) => {
    try {
        console.log('🔍 Getting airlines from hardcoded data');
        
        // Get unique airlines from hardcoded flights
        const airlines = [...new Set(HARDCODED_FLIGHTS.map(flight => flight.airline))]
            .filter(airline => airline)
            .sort();
            
        console.log(`Found ${airlines.length} unique airlines:`, airlines);
        res.json({ success: true, data: airlines });
    } catch (error) {
        console.error('Error fetching airlines:', error);
        res.status(500).json({ success: false, message: 'Error fetching airlines', error: error.message });
    }
};

// Get available locations (from and to)
const getLocations = async (req, res) => {
    try {
        console.log('🔍 Getting locations from hardcoded data');
        
        // Get unique locations from hardcoded flights
        const fromLocations = [...new Set(HARDCODED_FLIGHTS.map(flight => flight.from))]
            .filter(location => location)
            .sort();
            
        const toLocations = [...new Set(HARDCODED_FLIGHTS.map(flight => flight.to))]
            .filter(location => location)
            .sort();
        
        const allLocations = [...new Set([...fromLocations, ...toLocations])]
            .filter(location => location)
            .sort();
            
        console.log(`Found ${allLocations.length} unique locations:`, allLocations);
            
        res.json({ 
            success: true, 
            data: {
                all: allLocations,
                from: fromLocations,
                to: toLocations
            }
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ success: false, message: 'Error fetching locations', error: error.message });
    }
};

module.exports = {
    getAllFlightsPublic,
    searchFlights,
    filterFlights,
    getAirlines,
    getLocations,
    getAllFlights,
    getFlightsDebug
};
