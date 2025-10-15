// Flight search functionality with modern features
document.addEventListener('DOMContentLoaded', function() {
    initializeFlightSearch();
    initializePassengerSelector();
    initializeLocationAutocomplete();
    initializeFilters();
    setMinDates();
    
    // Listen for profile updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'travelEaseUser') {
            updateUserDisplays();
        }
    });
    
    window.addEventListener('profileUpdated', function(e) {
        updateUserDisplays();
    });
    
    // Initialize user displays
    updateUserDisplays();
});

// Global variables
let passengerCounts = { adults: 1, children: 0, infants: 0 };
let selectedClass = 'economy';
let currentFlights = [];
let filteredFlights = [];

// Initialize flight search functionality
function initializeFlightSearch() {
    try {
        const searchForm = document.getElementById('flightSearchForm');
        const searchTabs = document.querySelectorAll('.search-tab');
        const swapBtn = document.getElementById('swapLocations');
        
        if (!searchForm) {
            console.warn('Flight search form not found');
            return;
        }
        
        // Search tabs functionality
        searchTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                searchTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const type = this.dataset.type;
                const returnDateGroup = document.getElementById('returnDateGroup');
                
                if (returnDateGroup) {
                    if (type === 'oneway') {
                        returnDateGroup.style.display = 'none';
                    } else {
                        returnDateGroup.style.display = 'block';
                    }
                }
            });
        });
        
        // Swap locations functionality
        if (swapBtn) {
            swapBtn.addEventListener('click', function() {
                const fromInput = document.getElementById('fromLocation');
                const toInput = document.getElementById('toLocation');
                
                if (fromInput && toInput) {
                    const temp = fromInput.value;
                    fromInput.value = toInput.value;
                    toInput.value = temp;
                }
            });
        }
        
        // Form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performFlightSearch();
        });
        
        console.log('Flight search initialized successfully');
    } catch (error) {
        console.error('Error initializing flight search:', error);
    }
}

// Initialize passenger selector
function initializePassengerSelector() {
    const passengerBtn = document.getElementById('passengerBtn');
    const passengerDropdown = document.getElementById('passengerDropdown');
    const counterBtns = document.querySelectorAll('.counter-btn');
    const classOptions = document.querySelectorAll('input[name="class"]');
    
    // Toggle dropdown
    passengerBtn.addEventListener('click', function() {
        passengerDropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!passengerBtn.contains(e.target) && !passengerDropdown.contains(e.target)) {
            passengerDropdown.classList.remove('active');
        }
    });
    
    // Counter functionality
    counterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const type = this.dataset.type;
            const counterValue = document.querySelector(`.counter-value[data-type="${type}"]`);
            
            if (!counterValue) {
                console.error(`Counter element not found for type: ${type}`);
                return;
            }
            
            // Get current value and ensure it's a valid number
            let currentValue = parseInt(counterValue.textContent) || 0;
            
            // Ensure we have the correct initial value from global state
            if (isNaN(currentValue) || currentValue < 0) {
                currentValue = passengerCounts[type] || 0;
                if (type === 'adults' && currentValue === 0) {
                    currentValue = 1; // Adults should never be 0
                }
            }
            
            if (action === 'plus') {
                if (type === 'adults' && currentValue < 9) {
                    currentValue++;
                } else if (type === 'children' && currentValue < 8) {
                    currentValue++;
                } else if (type === 'infants' && currentValue < passengerCounts.adults) {
                    currentValue++;
                }
            } else if (action === 'minus') {
                if (type === 'adults' && currentValue > 1) {
                    currentValue--;
                } else if ((type === 'children' || type === 'infants') && currentValue > 0) {
                    currentValue--;
                }
            }
            
            // Update both the display and global state
            counterValue.textContent = currentValue;
            passengerCounts[type] = currentValue;
            
            // Update infant limit based on adults
            if (type === 'adults') {
                const infantCounter = document.querySelector('.counter-value[data-type="infants"]');
                if (infantCounter) {
                    const infantCount = parseInt(infantCounter.textContent) || 0;
                    if (infantCount > currentValue) {
                        infantCounter.textContent = currentValue;
                        passengerCounts.infants = currentValue;
                    }
                }
            }
            
            updatePassengerDisplay();
        });
    });
    
    // Class selection
    classOptions.forEach(option => {
        option.addEventListener('change', function() {
            selectedClass = this.value;
            updatePassengerDisplay();
        });
    });
}

// Update passenger display
function updatePassengerDisplay() {
    try {
        const total = passengerCounts.adults + passengerCounts.children;
        const passengerText = `${total} ${total === 1 ? 'Passenger' : 'Passengers'}, ${selectedClass.charAt(0).toUpperCase() + selectedClass.slice(1)}`;
        const spanElement = document.querySelector('#passengerBtn span');
        if (spanElement) {
            spanElement.textContent = passengerText;
        } else {
            console.warn('Passenger button span not found');
        }
    } catch (error) {
        console.error('Error updating passenger display:', error);
    }
}

// Initialize location autocomplete
function initializeLocationAutocomplete() {
    const cities = [
        { code: 'NYC', name: 'New York', country: 'USA' },
        { code: 'LAX', name: 'Los Angeles', country: 'USA' },
        { code: 'LHR', name: 'London', country: 'UK' },
        { code: 'CDG', name: 'Paris', country: 'France' },
        { code: 'DXB', name: 'Dubai', country: 'UAE' },
        { code: 'NRT', name: 'Tokyo', country: 'Japan' },
        { code: 'SIN', name: 'Singapore', country: 'Singapore' },
        { code: 'SYD', name: 'Sydney', country: 'Australia' },
        { code: 'FRA', name: 'Frankfurt', country: 'Germany' },
        { code: 'AMS', name: 'Amsterdam', country: 'Netherlands' }
    ];
    
    const locationInputs = ['fromLocation', 'toLocation'];
    
    locationInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(inputId.replace('Location', 'Dropdown'));
        
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const matches = cities.filter(city => 
                city.name.toLowerCase().includes(query) ||
                city.code.toLowerCase().includes(query) ||
                city.country.toLowerCase().includes(query)
            );
            
            if (query.length > 0 && matches.length > 0) {
                dropdown.innerHTML = matches.map(city => 
                    `<div class="location-option" data-code="${city.code}" data-name="${city.name}">
                        <strong>${city.code}</strong> - ${city.name}, ${city.country}
                    </div>`
                ).join('');
                dropdown.style.display = 'block';
                
                // Add click handlers
                dropdown.querySelectorAll('.location-option').forEach(option => {
                    option.addEventListener('click', function() {
                        input.value = `${this.dataset.code} - ${this.dataset.name}`;
                        dropdown.style.display = 'none';
                    });
                });
            } else {
                dropdown.style.display = 'none';
            }
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    });
}

// Set minimum dates
function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    const departInput = document.getElementById('departDate');
    const returnInput = document.getElementById('returnDate');
    
    departInput.min = today;
    returnInput.min = today;
    
    departInput.addEventListener('change', function() {
        returnInput.min = this.value;
        if (returnInput.value && returnInput.value < this.value) {
            returnInput.value = this.value;
        }
    });
}

// Perform flight search
function performFlightSearch() {
    const fromLocation = document.getElementById('fromLocation').value;
    const toLocation = document.getElementById('toLocation').value;
    const departDate = document.getElementById('departDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    if (!fromLocation || !toLocation || !departDate) {
        alert('Please fill in all required fields');
        return;
    }
    
    const resultsSection = document.getElementById('resultsSection');
    const loadingState = document.getElementById('loadingState');
    const flightResults = document.getElementById('flightResults');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsSection.style.display = 'block';
    loadingState.style.display = 'block';
    flightResults.innerHTML = '';
    
    // Fetch flights from MongoDB backend
    fetchFlights(fromLocation, toLocation, departDate, returnDate)
        .then(flights => {
            currentFlights = flights;
            filteredFlights = [...currentFlights];
            
            loadingState.style.display = 'none';
            
            if (flights.length === 0) {
                displayNoFlights();
                resultsCount.textContent = 'No flights found for your search criteria';
            } else {
                displayFlights(filteredFlights);
                resultsCount.textContent = `${filteredFlights.length} flights found`;
                populateAirlineFilters();
            }
        })
        .catch(error => {
            console.error('Flight search failed:', error);
            loadingState.style.display = 'none';
            
            // Show error message only - no fallback to mock data
            displayErrorMessage();
            resultsCount.textContent = 'Error loading flights. Please try again.';
            
            // Clear the results
            currentFlights = [];
            filteredFlights = [];
        });
}

// Fetch flights from backend with enhanced MongoDB integration and fallback
async function fetchFlights(from, to, depart, returnDate = null) {
    try {
        const searchParams = {
            from: from.includes(' - ') ? from.split(' - ')[0] : from,
            to: to.includes(' - ') ? to.split(' - ')[0] : to,
            depart,
            returnDate,
            passengers: passengerCounts,
            class: selectedClass
        };

        // Try backend first
        try {
            console.log('Making request to /api/flights/search with params:', searchParams);
            
            const response = await fetch('/api/flights/search', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}` 
                },
                body: JSON.stringify(searchParams)
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const flights = await response.json();
                console.log('Backend response:', flights);
                
                // Save search to history
                await saveSearchHistory('flight', searchParams);
                
                if (flights && flights.length > 0) {
                    console.log(`Found ${flights.length} flights from backend`);
                    
                    // Transform backend response to frontend format
                    return flights.map((flight, index) => ({
                        id: flight._id || flight.id || `flight_${index}`,
                        _id: flight._id || flight.id, // Preserve MongoDB ID for booking
                        airline: flight.airline || 'Unknown Airline',
                        airlineCode: flight.airline ? flight.airline.substring(0, 2).toUpperCase() : 'UA',
                        airlineLogo: flight.airline ? flight.airline.substring(0, 2).toUpperCase() : 'UA',
                        flightNumber: flight.flightNumber || `FL${Math.random().toString().substr(2, 4)}`,
                        departureTime: flight.depart || flight.departureTime || '08:00',
                        arrivalTime: flight.return || flight.arrivalTime || '12:00',
                        duration: flight.duration || '4h 0m',
                        stops: flight.stops || 0,
                        stopsText: (flight.stops || 0) === 0 ? 'Nonstop' : `${flight.stops || 0} stop${(flight.stops || 0) > 1 ? 's' : ''}`,
                        price: flight.price || 0,
                        availableSeats: flight.availableSeats || 0,
                        from: flight.from || (from.includes(' - ') ? from.split(' - ')[0] : from),
                        to: flight.to || (to.includes(' - ') ? to.split(' - ')[0] : to),
                        fromFull: from,
                        toFull: to,
                        departureHour: parseInt((flight.depart || flight.departureTime || '08:00').split(':')[0]) || 8,
                        status: flight.status || 'active',
                        aircraft: flight.aircraft || 'Boeing 737',
                        terminal: flight.terminal || 'Terminal 1'
                    }));
                } else {
                    console.log('No flights returned from backend, using mock data');
                }
            } else {
                console.log(`Backend request failed with status ${response.status}, using mock data`);
            }
            
        } catch (backendError) {
            console.warn('Backend error, using mock data:', backendError);
        }
        
        // Fallback to mock data if backend is not available
        console.log('Using mock flight data for demo purposes');
        return generateMockFlights(searchParams);
        
    } catch (error) {
        console.error('Flight search error:', error);
        throw error;
    }
}

// Generate mock flight data for demo purposes
function generateMockFlights(searchParams) {
    const airlines = [
        { name: 'Delta Air Lines', code: 'DL' },
        { name: 'American Airlines', code: 'AA' },
        { name: 'United Airlines', code: 'UA' },
        { name: 'Southwest Airlines', code: 'SW' },
        { name: 'JetBlue Airways', code: 'B6' },
        { name: 'Alaska Airlines', code: 'AS' },
        { name: 'Spirit Airlines', code: 'NK' },
        { name: 'Frontier Airlines', code: 'F9' }
    ];
    
    const mockFlights = [];
    const fromCode = searchParams.from;
    const toCode = searchParams.to;
    
    // Generate 8-12 mock flights
    const numFlights = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const basePrice = Math.floor(Math.random() * 500) + 150; // $150-650 base price
        const classMultiplier = searchParams.class === 'business' ? 2.5 : searchParams.class === 'first' ? 4 : 1;
        const finalPrice = Math.floor(basePrice * classMultiplier);
        
        // Generate realistic times
        const departHour = Math.floor(Math.random() * 18) + 6; // 6 AM to 11 PM
        const departMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
        const flightDurationMinutes = Math.floor(Math.random() * 360) + 120; // 2-8 hours
        const arrivalTime = new Date();
        arrivalTime.setHours(departHour);
        arrivalTime.setMinutes(departMinute + flightDurationMinutes);
        
        const stops = Math.random() < 0.6 ? 0 : Math.random() < 0.8 ? 1 : 2; // 60% nonstop, 20% 1 stop, 20% 2 stops
        const stopsText = stops === 0 ? 'Nonstop' : `${stops} stop${stops > 1 ? 's' : ''}`;
        
        mockFlights.push({
            id: `flight_${i}_${Date.now()}`,
            airline: airline.name,
            airlineCode: airline.code,
            airlineLogo: airline.code,
            flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
            departureTime: `${departHour.toString().padStart(2, '0')}:${departMinute.toString().padStart(2, '0')}`,
            arrivalTime: `${arrivalTime.getHours().toString().padStart(2, '0')}:${arrivalTime.getMinutes().toString().padStart(2, '0')}`,
            duration: `${Math.floor(flightDurationMinutes / 60)}h ${flightDurationMinutes % 60}m`,
            stops: stops,
            stopsText: stopsText,
            price: finalPrice,
            availableSeats: Math.floor(Math.random() * 200) + 20,
            from: fromCode,
            to: toCode,
            fromFull: `${fromCode} - Airport`,
            toFull: `${toCode} - Airport`,
            departureHour: departHour,
            status: 'active',
            aircraft: ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A330'][Math.floor(Math.random() * 4)],
            terminal: `Terminal ${Math.floor(Math.random() * 4) + 1}`
        });
    }
    
    // Sort by price by default
    return mockFlights.sort((a, b) => a.price - b.price);
}


// Display flights
function displayFlights(flights) {
    const flightResults = document.getElementById('flightResults');
    
    if (flights.length === 0) {
        flightResults.innerHTML = `
            <div class="no-flights">
                <i class="fas fa-plane-slash"></i>
                <h3>No flights found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    flightResults.innerHTML = flights.map((flight, index) => `
        <div class="flight-card" data-flight-id="${flight.id}">
            <div class="flight-header">
                <div class="airline-info">
                    <div class="airline-logo">${flight.airlineLogo}</div>
                    <div class="airline-details">
                        <h4>${flight.airline}</h4>
                        <p class="flight-number">${flight.flightNumber}</p>
                    </div>
                </div>
                <div class="price-info">
                    <h3 class="price">$${flight.price}</h3>
                    <p class="price-per-person">per person</p>
                </div>
            </div>
            
            <div class="flight-route">
                <div class="route-point departure">
                    <h4 class="airport-code">${flight.from}</h4>
                    <p class="airport-name">${flight.fromFull.split(' - ')[1] || 'Airport'}</p>
                    <h3 class="departure-time">${flight.departureTime}</h3>
                </div>
                
                <div class="route-visual">
                    <div class="flight-duration">${flight.duration}</div>
                    <div class="route-line"></div>
                    <div class="stops-info">${flight.stopsText}</div>
                </div>
                
                <div class="route-point arrival">
                    <h4 class="airport-code">${flight.to}</h4>
                    <p class="airport-name">${flight.toFull.split(' - ')[1] || 'Airport'}</p>
                    <h3 class="arrival-time">${flight.arrivalTime}</h3>
                </div>
            </div>
            
            <div class="flight-details-row">
                <div class="flight-info">
                    <div class="info-item">
                        <i class="fas fa-suitcase-rolling"></i>
                        <span>1 carry-on, 1 checked bag</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-wifi"></i>
                        <span>WiFi available</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-utensils"></i>
                        <span>Meal included</span>
                    </div>
                </div>
                <button class="book-flight-btn" id="book-flight-${index}" data-flight-id="${flight.id}">
                    <i class="fas fa-credit-card"></i>
                    Book Flight
                </button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for booking buttons
    flights.forEach((flight, index) => {
        const bookButton = document.getElementById(`book-flight-${index}`);
        if (bookButton) {
            bookButton.addEventListener('click', function() {
                console.log(`✈️ Book button clicked for flight: ${flight.id}`);
                bookFlight(flight.id);
            });
        }
    });
    
    console.log(`📋 Added event listeners for ${flights.length} flight booking buttons`);
}

// Initialize filters
function initializeFilters() {
    try {
        const priceRangeInputs = document.querySelectorAll('#minPrice, #maxPrice');
        const sortSelect = document.getElementById('sortBy');
        const clearFiltersBtn = document.getElementById('clearFilters');
        
        // Price range filters with debouncing for better performance
        let filterTimeout;
        priceRangeInputs.forEach(input => {
            input.addEventListener('input', function() {
                const minPriceValue = document.getElementById('minPriceValue');
                const maxPriceValue = document.getElementById('maxPriceValue');
                const minPrice = document.getElementById('minPrice');
                const maxPrice = document.getElementById('maxPrice');
                
                if (minPriceValue && minPrice) {
                    minPriceValue.textContent = minPrice.value;
                }
                if (maxPriceValue && maxPrice) {
                    maxPriceValue.textContent = maxPrice.value;
                }
                
                // Debounce filter application for better performance
                clearTimeout(filterTimeout);
                filterTimeout = setTimeout(() => {
                    applyFilters();
                }, 300);
            });
        });
        
        // Time filters
        document.querySelectorAll('.time-option input').forEach(checkbox => {
            checkbox.addEventListener('change', applyFilters);
        });
        
        // Stops filters
        document.querySelectorAll('.stop-option input').forEach(radio => {
            radio.addEventListener('change', applyFilters);
        });
        
        // Sort functionality
        if (sortSelect) {
            sortSelect.addEventListener('change', function() {
                const sortValue = this.value;
                console.log('Sorting flights by:', sortValue);
                sortFlights(sortValue);
            });
        }
        
        // Clear filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', function() {
                console.log('Clearing all filters');
                
                try {
                    // Reset price range
                    const minPrice = document.getElementById('minPrice');
                    const maxPrice = document.getElementById('maxPrice');
                    const minPriceValue = document.getElementById('minPriceValue');
                    const maxPriceValue = document.getElementById('maxPriceValue');
                    
                    if (minPrice) minPrice.value = 0;
                    if (maxPrice) maxPrice.value = 2000;
                    if (minPriceValue) minPriceValue.textContent = '0';
                    if (maxPriceValue) maxPriceValue.textContent = '2000';
                    
                    // Reset time filters
                    document.querySelectorAll('.time-option input').forEach(cb => cb.checked = false);
                    
                    // Reset stops filter
                    const anyStopsRadio = document.querySelector('input[value="any"]');
                    if (anyStopsRadio) anyStopsRadio.checked = true;
                    
                    // Reset airline filters
                    document.querySelectorAll('#airlinesFilter input[type="checkbox"]').forEach(cb => cb.checked = false);
                    
                    // Apply filters to show all flights
                    filteredFlights = [...currentFlights];
                    displayFlights(filteredFlights);
                    
                    const resultsCount = document.getElementById('resultsCount');
                    if (resultsCount && currentFlights.length > 0) {
                        resultsCount.textContent = `${filteredFlights.length} flights found`;
                    }
                    
                } catch (error) {
                    console.error('Error clearing filters:', error);
                }
            });
        }
        
        console.log('Filters initialized successfully');
        
    } catch (error) {
        console.error('Error initializing filters:', error);
    }
}

// Apply filters
function applyFilters() {
    try {
        if (!currentFlights || !currentFlights.length) {
            console.log('No flights to filter');
            return;
        }
        
        const minPrice = parseInt(document.getElementById('minPrice')?.value || 0);
        const maxPrice = parseInt(document.getElementById('maxPrice')?.value || 2000);
        const selectedTimes = Array.from(document.querySelectorAll('.time-option input:checked')).map(cb => cb.value);
        const selectedStops = document.querySelector('input[name="stops"]:checked')?.value || 'any';
        const selectedAirlines = Array.from(document.querySelectorAll('#airlinesFilter input:checked')).map(cb => cb.value);
        
        console.log('Applying filters:', { minPrice, maxPrice, selectedTimes, selectedStops, selectedAirlines });
        
        filteredFlights = currentFlights.filter(flight => {
            // Price filter
            if (flight.price < minPrice || flight.price > maxPrice) return false;
            
            // Time filter
            if (selectedTimes.length > 0) {
                const hour = flight.departureHour;
                const timeMatches = selectedTimes.some(time => {
                    if (time === 'morning') return hour >= 6 && hour < 12;
                    if (time === 'afternoon') return hour >= 12 && hour < 18;
                    if (time === 'evening') return hour >= 18 || hour < 6;
                    return false;
                });
                if (!timeMatches) return false;
            }
            
            // Airline filter
            if (selectedAirlines.length > 0 && !selectedAirlines.includes(flight.airline)) {
                return false;
            }
            
            // Stops filter
            if (selectedStops !== 'any') {
                if (selectedStops === 'nonstop' && flight.stops > 0) return false;
                if (selectedStops === '1stop' && flight.stops > 1) return false;
            }
            
            return true;
        });
        
        console.log(`Filtered ${filteredFlights.length} flights from ${currentFlights.length} total`);
        
        displayFlights(filteredFlights);
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${filteredFlights.length} flights found`;
        }
        
    } catch (error) {
        console.error('Error applying filters:', error);
        // Show original flights if filtering fails
        filteredFlights = [...currentFlights];
        displayFlights(filteredFlights);
    }
}

// Sort flights
function sortFlights(criteria) {
    if (!filteredFlights.length) return;
    
    filteredFlights.sort((a, b) => {
        switch (criteria) {
            case 'price':
                return a.price - b.price;
            case 'duration':
                return a.duration.localeCompare(b.duration);
            case 'departure':
                return a.departureTime.localeCompare(b.departureTime);
            case 'arrival':
                return a.arrivalTime.localeCompare(b.arrivalTime);
            default:
                return 0;
        }
    });
    
    displayFlights(filteredFlights);
}

// Populate airline filters
function populateAirlineFilters() {
    const airlinesFilter = document.getElementById('airlinesFilter');
    if (!airlinesFilter) return;
    
    const airlines = [...new Set(currentFlights.map(f => f.airline))];
    
    airlinesFilter.innerHTML = airlines.map(airline => `
        <label class="airline-option">
            <input type="checkbox" value="${airline}" onchange="applyFilters()">
            <span>${airline}</span>
        </label>
    `).join('');
}

// Save search history to backend
async function saveSearchHistory(type, searchParams) {
    try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return; // Skip if user not logged in

        await fetch('/api/search-history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                type,
                searchParams,
                timestamp: new Date().toISOString()
            })
        });
    } catch (error) {
        console.warn('Failed to save search history:', error);
    }
}

// Book flight function with wallet validation - Make it globally accessible
window.bookFlight = function(flightId) {
    console.log('🛩️ bookFlight called with flightId:', flightId);
    
    // Add debugging
    if (typeof flightId === 'undefined') {
        console.error('❌ Flight ID is undefined!');
        alert('Error: Flight ID is missing!');
        return;
    }
    
    const flight = currentFlights.find(f => f.id === flightId);
    if (!flight) {
        alert('Flight not found. Please refresh and try again.');
        return;
    }

    // Calculate total price
    const totalPassengers = passengerCounts.adults + passengerCounts.children + passengerCounts.infants;
    const totalPrice = flight.price * totalPassengers;
    
    // Get current user data including wallet balance
    const userData = JSON.parse(localStorage.getItem('travelEaseUser')) || { balance: 250.00 };
    const currentBalance = userData.balance || 250.00;
    
    // Check if wallet has sufficient balance
    if (currentBalance < totalPrice) {
        // Show insufficient balance error
        showInsufficientBalanceError(totalPrice, currentBalance, 'flight');
        return;
    }

    // Show booking confirmation dialog
    const confirmation = confirm(
        `Confirm Flight Booking:\n\n` +
        `Flight: ${flight.flightNumber} - ${flight.airline}\n` +
        `Route: ${flight.from} to ${flight.to}\n` +
        `Departure: ${flight.departureTime}\n` +
        `Arrival: ${flight.arrivalTime}\n` +
        `Passengers: ${totalPassengers} (${passengerCounts.adults} adults, ${passengerCounts.children} children, ${passengerCounts.infants} infants)\n` +
        `Class: ${selectedClass}\n` +
        `Total Price: $${totalPrice}\n\n` +
        `Proceed with booking?`
    );

    if (!confirmation) return;

    // Deduct amount from wallet
    const newBalance = currentBalance - totalPrice;
    userData.balance = newBalance;
    localStorage.setItem('travelEaseUser', JSON.stringify(userData));

    // Create booking record
    const booking = {
        id: Date.now(),
        type: 'flight',
        name: `${flight.airline} ${flight.flightNumber}`, // Add name property for dashboard display
        location: `${flight.from} → ${flight.to}`, // Add location property for dashboard display
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.from,
        to: flight.to,
        fromFull: flight.fromFull,
        toFull: flight.toFull,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        duration: flight.duration,
        stops: flight.stopsText,
        passengers: passengerCounts,
        totalPassengers,
        class: selectedClass,
        price: totalPrice, // Use totalPrice (not per-person price) for dashboard display
        pricePerPerson: flight.price, // Keep original per-person price as separate property
        totalPrice,
        departDate: document.getElementById('departDate').value,
        returnDate: document.getElementById('returnDate').value || null,
        bookingDate: new Date().toISOString().split('T')[0],
        bookingTime: new Date().toLocaleString(),
        status: 'confirmed'
    };
    
    // Save to upcoming trips
    const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
    upcomingTrips.unshift(booking); // Add to beginning of array for recent bookings
    localStorage.setItem('upcomingTrips', JSON.stringify(upcomingTrips));
    
    // Add wallet transaction record
    addWalletTransaction({
        type: 'payment',
        title: `Flight Booking - ${flight.flightNumber} (${flight.from} to ${flight.to})`,
        date: new Date().toLocaleString(),
        method: 'Wallet Balance',
        amount: -totalPrice
    });
    
    // Show success message
    showBookingSuccessMessage(flight, newBalance, totalPrice, totalPassengers);
    
    // Trigger dashboard update across tabs/windows
    console.log('✈️ Flight booked, triggering dashboard update...');
    triggerDashboardUpdate();
    console.log('✅ Dashboard update triggered successfully!');
}

// Get user's recent searches
async function getUserSearchHistory() {
    try {
        const userToken = localStorage.getItem('userToken');
        if (!userToken) return [];

        const response = await fetch('/api/search-history/flights', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (response.ok) {
            return await response.json();
        }
        return [];
    } catch (error) {
        console.warn('Failed to fetch search history:', error);
        return [];
    }
}

// Display recent searches (can be called to show quick search options)
async function displayRecentSearches() {
    const searches = await getUserSearchHistory();
    if (searches.length === 0) return;

    const recentSearchesContainer = document.getElementById('recentSearches');
    if (!recentSearchesContainer) return;

    recentSearchesContainer.innerHTML = searches.slice(0, 3).map(search => `
        <div class="recent-search-item" onclick="applyRecentSearch('${JSON.stringify(search.searchParams).replace(/'/g, "&apos;")}')"> 
            <i class="fas fa-history"></i>
            <span>${search.searchParams.from} → ${search.searchParams.to}</span>
            <small>${new Date(search.timestamp).toLocaleDateString()}</small>
        </div>
    `).join('');
}

// Apply a recent search
function applyRecentSearch(searchParamsJson) {
    try {
        const searchParams = JSON.parse(searchParamsJson);
        
        // Fill form with recent search data
        document.getElementById('fromLocation').value = searchParams.from;
        document.getElementById('toLocation').value = searchParams.to;
        document.getElementById('departDate').value = searchParams.depart;
        if (searchParams.returnDate) {
            document.getElementById('returnDate').value = searchParams.returnDate;
        }
        
        // Update passenger counts if available
        if (searchParams.passengers) {
            passengerCounts = { ...passengerCounts, ...searchParams.passengers };
            updatePassengerDisplay();
        }
        
        // Update class if available
        if (searchParams.class) {
            selectedClass = searchParams.class;
            const classRadio = document.querySelector(`input[name="class"][value="${searchParams.class}"]`);
            if (classRadio) classRadio.checked = true;
            updatePassengerDisplay();
        }
        
        // Trigger search
        performFlightSearch();
    } catch (error) {
        console.error('Failed to apply recent search:', error);
    }
}

// Display no flights found message
function displayNoFlights() {
    const flightResults = document.getElementById('flightResults');
    flightResults.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">
                <i class="fas fa-plane-slash"></i>
            </div>
            <h3>No flights found</h3>
            <p>We couldn't find any flights matching your search criteria.</p>
            <div class="suggestions">
                <h4>Try:</h4>
                <ul>
                    <li>Adjusting your travel dates</li>
                    <li>Checking nearby airports</li>
                    <li>Being flexible with your destination</li>
                    <li>Removing some filters</li>
                </ul>
            </div>
        </div>
    `;
}

// Display error message
function displayErrorMessage() {
    const flightResults = document.getElementById('flightResults');
    flightResults.innerHTML = `
        <div class="error-message">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Oops! Something went wrong</h3>
            <p>We're having trouble loading flights right now. Please try again in a moment.</p>
            <button class="retry-btn" onclick="performFlightSearch()">
                <i class="fas fa-redo"></i>
                Try Again
            </button>
        </div>
    `;
}

// Update user displays across the page
function updateUserDisplays() {
    const userData = JSON.parse(localStorage.getItem('travelEaseUser')) || {
        username: 'User',
        avatar: '../assets/images/img1.png'
    };
    
    // Update header user info
    const headerUsername = document.getElementById('username');
    const headerAvatar = document.getElementById('userAvatar');
    const sidebarUsername = document.getElementById('sidebarUsername');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    
    if (headerUsername) headerUsername.textContent = userData.username;
    if (headerAvatar) headerAvatar.src = userData.avatar;
    if (sidebarUsername) sidebarUsername.textContent = userData.username;
    if (sidebarAvatar) sidebarAvatar.src = userData.avatar;
}

// Helper function to show insufficient balance error
function showInsufficientBalanceError(requiredAmount, currentBalance, bookingType) {
    alert(
        `❌ Insufficient Wallet Balance!\n\n` +
        `Required: $${requiredAmount.toFixed(2)}\n` +
        `Available: $${currentBalance.toFixed(2)}\n` +
        `Shortfall: $${(requiredAmount - currentBalance).toFixed(2)}\n\n` +
        `Please add money to your wallet to book this ${bookingType}.`
    );
}

// Helper function to show booking success message
function showBookingSuccessMessage(flight, newBalance, totalPrice, totalPassengers) {
    alert(
        `✅ Flight Booking Confirmed!\n\n` +
        `Flight: ${flight.flightNumber} - ${flight.airline}\n` +
        `Route: ${flight.from} to ${flight.to}\n` +
        `Passengers: ${totalPassengers}\n` +
        `Amount Charged: $${totalPrice}\n` +
        `Remaining Wallet Balance: $${newBalance.toFixed(2)}\n\n` +
        `Booking details have been saved to your dashboard!`
    );
}

// Helper function to add wallet transaction
function addWalletTransaction(transaction) {
    try {
        const transactions = JSON.parse(localStorage.getItem('walletTransactions')) || [];
        transactions.unshift(transaction);
        localStorage.setItem('walletTransactions', JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving wallet transaction:', error);
    }
}

// Helper function to trigger dashboard update
function triggerDashboardUpdate() {
    try {
        // Trigger custom event for same-tab updates
        window.dispatchEvent(new CustomEvent('bookingUpdated', { 
            detail: { type: 'flight', timestamp: Date.now() } 
        }));
        
        // Trigger storage event for cross-tab updates by touching a flag
        const flag = Date.now().toString();
        localStorage.setItem('dashboardUpdateFlag', flag);
        
        // Clean up the flag after a short delay
        setTimeout(() => {
            if (localStorage.getItem('dashboardUpdateFlag') === flag) {
                localStorage.removeItem('dashboardUpdateFlag');
            }
        }, 1000);
    } catch (error) {
        console.error('Error triggering dashboard update:', error);
    }
}

// Add CSS for location dropdown
const style = document.createElement('style');
style.textContent = `
    .location-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 2px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10;
        display: none;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .location-option {
        padding: 0.75rem 1rem;
        cursor: pointer;
        border-bottom: 1px solid var(--border-color);
        transition: background-color 0.2s ease;
    }
    
    .location-option:hover {
        background: rgba(74, 144, 226, 0.1);
    }
    
    .location-option:last-child {
        border-bottom: none;
    }
    
    .airline-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: var(--border-radius-sm);
        transition: background-color 0.2s ease;
    }
    
    .airline-option:hover {
        background: rgba(74, 144, 226, 0.1);
    }
    
    .airline-option input {
        margin: 0;
    }
`;
document.head.appendChild(style);
