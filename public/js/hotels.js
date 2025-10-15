document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('hotelSearchForm');
  const results = document.getElementById('hotelResults');
  const resultsSection = document.getElementById('resultsSection');
  const resultsCount = document.getElementById('resultsCount');
  const sortBy = document.getElementById('sortBy');
  
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
  
  // Guest selector functionality
  const guestBtn = document.getElementById('guestBtn');
  let guests = { adults: 2, children: 0, infants: 0, rooms: 1 };
  
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      // For now, just show an alert. In a real app, this would open a dropdown
      const newAdults = prompt('Number of adults:', guests.adults);
      const newRooms = prompt('Number of rooms:', guests.rooms);
      
      if (newAdults !== null) guests.adults = parseInt(newAdults) || 2;
      if (newRooms !== null) guests.rooms = parseInt(newRooms) || 1;
      
      updateGuestDisplay();
    });
  }
  
  function updateGuestDisplay() {
    if (guestBtn) {
      const span = guestBtn.querySelector('span');
      if (span) {
        span.textContent = `${guests.adults} Adults, ${guests.rooms} Room${guests.rooms > 1 ? 's' : ''}`;
      }
    }
  }
  
  // Search form submission
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      
      const location = document.getElementById('hotelLocation').value.trim();
      const checkIn = document.getElementById('checkIn').value;
      const checkOut = document.getElementById('checkOut').value;
      
      if (!location || !checkIn || !checkOut) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Show results section and loading state
      if (resultsSection) {
        resultsSection.style.display = 'block';
      }
      
      if (resultsCount) {
        resultsCount.textContent = 'Searching for hotels...';
      }
      
      if (results) {
        results.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
      }
      
      // Simulate API call
      setTimeout(() => {
        searchHotels(location, checkIn, checkOut);
      }, 1000);
    });
  }
  
  // Sort functionality
  if (sortBy) {
    sortBy.addEventListener('change', () => {
      const currentResults = document.querySelectorAll('.hotel-card');
      if (currentResults.length > 0) {
        sortHotels(sortBy.value);
      }
    });
  }
  
  // Search hotels with MongoDB backend integration
  async function searchHotels(location, checkIn, checkOut) {
    try {
      // Save search to history first
      await saveSearchHistory('hotel', {
        location,
        checkIn,
        checkOut,
        guests: guests,
        timestamp: new Date().toISOString()
      });

      // Fetch from backend
      const response = await fetch('/api/hotels/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`
        },
        body: JSON.stringify({
          location,
          checkIn,
          checkOut,
          guests,
          priceRange: { min: 0, max: 100000 } // Increased from 1000 to 100000
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const apiResponse = await response.json();
      let hotels = apiResponse.data || apiResponse; // Handle both {data: []} and direct [] responses
      
      // Transform MongoDB data to frontend format
      hotels = hotels.map(hotel => ({
        id: hotel._id || Math.random().toString(36).substr(2, 9),
        name: hotel.name,
        location: hotel.location,
        price: hotel.pricePerNight,
        rating: hotel.rating,
        reviews: hotel.reviews || Math.floor(Math.random() * 1000) + 100,
        amenities: hotel.amenities || [],
        image: hotel.images?.[0] || '../assets/images/hotel1.jpg',
        description: hotel.description || '',
        availableRooms: hotel.availableRooms || 0
      }));

      if (hotels.length === 0) {
        displayNoHotels();
        if (resultsCount) {
          resultsCount.textContent = 'No hotels found for your search criteria';
        }
      } else {
        displayHotels(hotels);
        if (resultsCount) {
          resultsCount.textContent = `${hotels.length} hotels found for your search`;
        }
      }

    } catch (error) {
      console.error('Hotel search failed:', error);
      
      // Show error message only - no fallback to mock data
      displayHotelError();
      if (resultsCount) {
        resultsCount.textContent = 'Error loading hotels. Please try again.';
      }
    }
  }

  
  function displayHotels(hotels) {
    if (!results) return;
    
    let html = '';
    hotels.forEach(hotel => {
      const starsHtml = '★'.repeat(Math.floor(hotel.rating)) + '☆'.repeat(5 - Math.floor(hotel.rating));
      
      html += `
        <div class="hotel-card" data-price="${hotel.price}" data-rating="${hotel.rating}">
          <div class="hotel-info">
            <div class="hotel-details">
              <h4>${hotel.name}</h4>
              <p><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
              <div class="hotel-rating">
                <span class="stars">${starsHtml}</span>
                <span class="rating-text">${hotel.rating} (${hotel.reviews} reviews)</span>
              </div>
            </div>
            <div class="hotel-price">
              <div class="price-amount">$${hotel.price}</div>
              <div class="price-period">per night</div>
            </div>
          </div>
          <div class="hotel-actions">
            <div class="hotel-amenities">
              ${hotel.amenities.map(amenity => `
                <span class="amenity">
                  <i class="fas fa-check"></i>
                  ${amenity}
                </span>
              `).join('')}
            </div>
            <button class="book-hotel-btn" data-id="${hotel.id}">
              <i class="fas fa-bed"></i>
              Book Now
            </button>
          </div>
        </div>
      `;
    });
    
    results.innerHTML = html;
    
    // Add booking event listeners
    document.querySelectorAll('.book-hotel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hotelId = btn.getAttribute('data-id');
        const hotel = hotels.find(h => h.id == hotelId);
        bookHotel(hotel);
      });
    });
  }
  
  function sortHotels(sortType) {
    const hotelCards = Array.from(document.querySelectorAll('.hotel-card'));
    
    hotelCards.sort((a, b) => {
      switch (sortType) {
        case 'price':
          return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        case 'rating':
          return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
        case 'distance':
          // Mock distance sorting
          return Math.random() - 0.5;
        default:
          return 0;
      }
    });
    
    const container = results;
    hotelCards.forEach(card => container.appendChild(card));
  }
  
  // Enhanced booking function with wallet validation
  function bookHotel(hotel) {
    const location = document.getElementById('hotelLocation').value.trim();
    const checkIn = document.getElementById('checkIn').value;
    const checkOut = document.getElementById('checkOut').value;
    
    if (!location || !checkIn || !checkOut) {
      alert('Please complete your search first before booking.');
      return;
    }

    // Calculate total nights and price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = hotel.price * nights * guests.rooms;

    // Get current user data including wallet balance
    const userData = JSON.parse(localStorage.getItem('travelEaseUser')) || { balance: 250.00 };
    const currentBalance = userData.balance || 250.00;
    
    // Check if wallet has sufficient balance
    if (currentBalance < totalPrice) {
      // Show insufficient balance error
      showInsufficientBalanceError(totalPrice, currentBalance, 'hotel');
      return;
    }

    // Show booking confirmation dialog
    const confirmation = confirm(
      `Confirm Hotel Booking:\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Location: ${hotel.location}\n` +
      `Check-in: ${checkIn}\n` +
      `Check-out: ${checkOut}\n` +
      `Nights: ${nights}\n` +
      `Rooms: ${guests.rooms}\n` +
      `Guests: ${guests.adults} Adults${guests.children > 0 ? ', ' + guests.children + ' Children' : ''}\n` +
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
      type: 'hotel',
      name: hotel.name,
      location: location,
      checkIn: checkIn,
      checkOut: checkOut,
      price: hotel.price,
      totalPrice,
      nights,
      guests: guests,
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
      title: `Hotel Booking - ${hotel.name}`,
      date: new Date().toLocaleString(),
      method: 'Wallet Balance',
      amount: -totalPrice
    });
    
    // Show success message
    showBookingSuccessMessage(hotel, newBalance, totalPrice, nights);
    
    // Trigger dashboard update across tabs/windows
    console.log('🏨 Hotel booked, triggering dashboard update...');
    triggerDashboardUpdate();
    console.log('✅ Dashboard update triggered successfully!');
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

  // Get user's hotel search history
  async function getUserHotelSearchHistory() {
    try {
      const userToken = localStorage.getItem('userToken');
      if (!userToken) return [];

      const response = await fetch('/api/search-history/hotels', {
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

  // Display recent hotel searches
  async function displayRecentHotelSearches() {
    const searches = await getUserHotelSearchHistory();
    if (searches.length === 0) return;

    const recentSearchesContainer = document.getElementById('recentHotelSearches');
    if (!recentSearchesContainer) return;

    recentSearchesContainer.innerHTML = searches.slice(0, 3).map(search => `
      <div class="recent-search-item" onclick="applyRecentHotelSearch('${JSON.stringify(search.searchParams).replace(/'/g, "&apos;")}')">
        <i class="fas fa-history"></i>
        <span>${search.searchParams.location}</span>
        <small>${new Date(search.timestamp).toLocaleDateString()}</small>
      </div>
    `).join('');
  }

  // Apply a recent hotel search
  window.applyRecentHotelSearch = function(searchParamsJson) {
    try {
      const searchParams = JSON.parse(searchParamsJson);
      
      // Fill form with recent search data
      document.getElementById('hotelLocation').value = searchParams.location || '';
      document.getElementById('checkIn').value = searchParams.checkIn || '';
      document.getElementById('checkOut').value = searchParams.checkOut || '';
      
      // Update guest counts if available
      if (searchParams.guests) {
        guests = { ...guests, ...searchParams.guests };
        updateGuestDisplay();
      }
      
      // Trigger search
      if (form) {
        form.dispatchEvent(new Event('submit'));
      }
    } catch (error) {
      console.error('Failed to apply recent search:', error);
    }
  };

  // Initialize recent searches display
  displayRecentHotelSearches();
  
  // Set minimum date for check-in to today
  const checkInInput = document.getElementById('checkIn');
  const checkOutInput = document.getElementById('checkOut');
  
  if (checkInInput) {
    const today = new Date().toISOString().split('T')[0];
    checkInInput.min = today;
    
    checkInInput.addEventListener('change', () => {
      if (checkOutInput) {
        const checkInDate = new Date(checkInInput.value);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        
        // Clear checkout if it's before the new check-in date
        if (checkOutInput.value && new Date(checkOutInput.value) <= checkInDate) {
          checkOutInput.value = '';
        }
      }
    });
  }
  
  // Display no hotels found message
  function displayNoHotels() {
    if (!results) return;
    
    results.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">
          <i class="fas fa-bed"></i>
        </div>
        <h3>No hotels found</h3>
        <p>We couldn't find any hotels matching your search criteria.</p>
        <div class="suggestions">
          <h4>Try:</h4>
          <ul>
            <li>Adjusting your travel dates</li>
            <li>Checking nearby areas</li>
            <li>Being flexible with your location</li>
            <li>Modifying your guest requirements</li>
          </ul>
        </div>
      </div>
    `;
  }

  // Display error message for hotels
  function displayHotelError() {
    if (!results) return;
    
    results.innerHTML = `
      <div class="error-message">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Oops! Something went wrong</h3>
        <p>We're having trouble loading hotels right now. Please try again in a moment.</p>
        <button class="retry-btn" onclick="document.getElementById('hotelSearchForm').dispatchEvent(new Event('submit'))">
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
  function showBookingSuccessMessage(hotel, newBalance, totalPrice, nights) {
    alert(
      `✅ Hotel Booking Confirmed!\n\n` +
      `Hotel: ${hotel.name}\n` +
      `Amount Charged: $${totalPrice}\n` +
      `Nights: ${nights}\n` +
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
        detail: { type: 'hotel', timestamp: Date.now() } 
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
});
