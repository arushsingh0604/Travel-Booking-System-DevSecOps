document.addEventListener('DOMContentLoaded', () => {
  initializeDashboard();
  setupEventListeners();
  loadUserData();
  loadDashboardData();
});

function initializeDashboard() {
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    // For demo purposes, set logged in state if not present
    localStorage.setItem('isLoggedIn', 'true');
    console.log('Login state initialized for demo');
  }

  // Add loading states
  document.body.classList.add('loading');
  
  // Animate stats on load
  setTimeout(() => {
    animateStats();
    document.body.classList.remove('loading');
  }, 500);
}

function setupEventListeners() {
  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
  
  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Search functionality
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Close search dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const searchBar = document.querySelector('.search-bar');
      const dropdown = document.querySelector('.search-dropdown');
      
      if (dropdown && !searchBar.contains(e.target)) {
        hideSearchSuggestions();
      }
    });
    
    // Clear search when focus is lost
    searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        hideSearchSuggestions();
      }, 200); // Delay to allow click on search results
    });
  }
  
  // Notifications
  const notificationsBtn = document.querySelector('.notifications-btn');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', showNotifications);
  }
  
  // Deal buttons
  const dealButtons = document.querySelectorAll('.deal-card .btn');
  dealButtons.forEach(btn => {
    btn.addEventListener('click', handleDealClick);
  });
  
  // Event delegation for cancel booking buttons (dynamically added)
  document.addEventListener('click', function(e) {
    if (e.target.closest('.cancel-booking-btn')) {
      const button = e.target.closest('.cancel-booking-btn');
      const bookingId = button.getAttribute('data-booking-id');
      console.log('🚫 Cancel button clicked for booking:', bookingId);
      if (bookingId) {
        cancelBooking(bookingId);
      }
    }
  });
}

function loadUserData() {
  // Check for travelEaseUser in localStorage which contains profile data
  const userData = JSON.parse(localStorage.getItem('travelEaseUser')) || {};
  const userEmail = localStorage.getItem('currentUserEmail');
  
  // Get user information either from travelEaseUser or fallback to email-based info
  let username = userData.username;
  let userAvatar = userData.avatar;
  let firstName = '';
  
  if (!username && userEmail) {
    firstName = userEmail.split('@')[0];
    username = firstName.charAt(0).toUpperCase() + firstName.slice(1) + ' User';
  } else if (!username) {
    username = 'Yash Mittal'; // Default fallback
    firstName = 'Yash';
  } else {
    // Extract first name from full username
    firstName = username.split(' ')[0];
  }
  
  if (!userAvatar) {
    userAvatar = '../assets/images/Yash.jpg'; // Default avatar
  }
  
  // Update all user display elements
  const userFirstNameElements = document.querySelectorAll('#userFirstName');
  const usernameElements = document.querySelectorAll('#username, #sidebarUsername');
  const userAvatarElements = document.querySelectorAll('#userAvatar, #sidebarAvatar, #profileAvatar');
  
  userFirstNameElements.forEach(el => {
    if (el) el.textContent = firstName;
  });
  
  usernameElements.forEach(el => {
    if (el) el.textContent = username;
  });
  
  userAvatarElements.forEach(el => {
    if (el) el.src = userAvatar;
  });
  
  // Add event listener for storage changes to detect profile updates from other pages
  window.addEventListener('storage', function(event) {
    if (event.key === 'travelEaseUser') {
      // Profile was updated in another tab/page, reload user data
      loadUserData();
    }
    
    // Listen for booking updates
    if (event.key === 'upcomingTrips' || event.key === 'lastBookingUpdate') {
      console.log('Booking update detected, refreshing dashboard...');
      updateRecentBookings();
      updateStats(); // Update stats when bookings change
    }
  });
  
  // Listen for custom booking events (same window)
  window.addEventListener('bookingMade', function(event) {
    console.log('New booking made, updating dashboard...');
    updateRecentBookings();
  });
}

function loadDashboardData() {
  // Simulate loading dashboard data
  updateRecentBookings();
  updateStats();
}

// Expose updateRecentBookings globally for manual refresh
window.updateRecentBookings = updateRecentBookings;

function updateRecentBookings() {
  const bookingsList = document.getElementById('recentBookings');
  if (!bookingsList) {
    console.log('DEBUG: recentBookings element not found!');
    return;
  }
  
  console.log('DEBUG: Updating recent bookings...');
  
  // Add loading animation
  bookingsList.style.opacity = '0.6';
  
  // Get recent bookings from localStorage
  const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
  console.log('DEBUG: Found upcomingTrips:', upcomingTrips);
  
  // Get the most recent 5 bookings
  const recentBookings = upcomingTrips.slice(0, 5);
  console.log('DEBUG: Recent bookings to display:', recentBookings);
  
  setTimeout(() => {
    if (recentBookings.length === 0) {
      // Show empty state
      bookingsList.innerHTML = `
        <div class="empty-bookings">
          <div class="empty-icon">
            <i class="fas fa-suitcase"></i>
          </div>
          <h4>No Recent Bookings</h4>
          <p>Start exploring amazing packages and make your first booking!</p>
          <a href="packages.html" class="btn btn-primary">
            <i class="fas fa-search"></i>
            Browse Packages
          </a>
        </div>
      `;
    } else {
      // Generate booking items HTML
      let bookingsHTML = '';
      
      recentBookings.forEach(booking => {
        const iconClass = getBookingIcon(booking.type);
        const statusClass = booking.status === 'confirmed' ? 'confirmed' : 'pending';
        
        bookingsHTML += `
          <div class="booking-item" data-booking-id="${booking.id}">
            <div class="booking-icon">
              <i class="fas ${iconClass}"></i>
            </div>
            <div class="booking-details">
              <h4>${booking.name}</h4>
              <p class="booking-date">${formatBookingDate(booking)} • ${booking.location}</p>
              <span class="booking-status ${statusClass}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
            </div>
            <div class="booking-amount">$${booking.price.toLocaleString()}</div>
            ${booking.status === 'confirmed' ? `
              <div class="booking-actions">
                <button class="cancel-booking-btn" data-booking-id="${booking.id}" title="Cancel Booking">
                  <i class="fas fa-times"></i>
                  Cancel
                </button>
              </div>
            ` : ''}
          </div>
        `;
      });
      
      bookingsList.innerHTML = bookingsHTML;
    }
    
    bookingsList.style.opacity = '1';
    
    // Add animation to booking items
    const bookingItems = bookingsList.querySelectorAll('.booking-item');
    bookingItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, 300);
}

function getBookingIcon(bookingType) {
  const icons = {
    'package': 'fa-suitcase',
    'flight': 'fa-plane-departure',
    'hotel': 'fa-bed'
  };
  return icons[bookingType] || 'fa-suitcase';
}

function formatBookingDate(booking) {
  // Use bookingTime if available, otherwise use bookingDate
  if (booking.bookingTime) {
    return new Date(booking.bookingTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } else if (booking.bookingDate) {
    return new Date(booking.bookingDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return 'Recently booked';
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach((statElement, index) => {
    const finalValue = statElement.textContent;
    let startValue = 0;
    
    // Extract number from text (handle both numbers and currency)
    const numMatch = finalValue.match(/[\d,]+/);
    if (!numMatch) return;
    
    const finalNum = parseInt(numMatch[0].replace(/,/g, ''));
    const increment = finalNum / 30;
    const duration = 1000;
    const stepTime = duration / 30;
    
    setTimeout(() => {
      const counter = setInterval(() => {
        startValue += increment;
        
        if (startValue >= finalNum) {
          startValue = finalNum;
          clearInterval(counter);
        }
        
        // Format the number
        let displayValue = Math.floor(startValue).toLocaleString();
        
        // Add currency symbol if it was there originally
        if (finalValue.includes('$')) {
          displayValue = '$' + displayValue;
        }
        
        statElement.textContent = displayValue;
      }, stepTime);
    }, index * 200);
  });
}

async function updateStats() {
  try {
    // Fetch total counts from backend database collections
    const stats = await fetchDatabaseStats();
    
    console.log('📊 Updated dashboard stats from database:', stats);
    
    // Update the stat numbers in the DOM
    updateStatNumbers(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    
    // Fallback to user booking counts if backend is unavailable
    const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
    const flightBookings = upcomingTrips.filter(booking => booking.type === 'flight');
    const hotelBookings = upcomingTrips.filter(booking => booking.type === 'hotel');
    const packageBookings = upcomingTrips.filter(booking => booking.type === 'package');
    const totalSpent = upcomingTrips.reduce((sum, booking) => sum + (booking.price || 0), 0);
    
    const fallbackStats = {
      flights: flightBookings.length,
      hotels: hotelBookings.length,
      packages: packageBookings.length,
      savings: Math.floor(totalSpent * 0.15)
    };
    
    console.log('Using fallback stats (user bookings):', fallbackStats);
    updateStatNumbers(fallbackStats);
  }
}

// Fetch total counts from backend database collections
async function fetchDatabaseStats() {
  try {
    // Try to fetch from backend API
    const response = await fetch('/api/dashboard/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userToken') || ''}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        flights: data.totalFlights || 0,
        hotels: data.totalHotels || 0,
        packages: data.totalPackages || 0,
        savings: data.estimatedSavings || 2500 // Default savings value
      };
    } else {
      throw new Error('Backend not available');
    }
  } catch (error) {
    console.warn('Backend API not available, using static counts:', error);
    
    // Return your actual database counts as fallback
    return {
      flights: 16, // Your actual flights count from MongoDB
      hotels: 10,  // Your actual hotels count from MongoDB
      packages: 5,  // Estimated packages count
      savings: 2500 // Default savings amount
    };
  }
}

// Function to update stat numbers in the DOM
function updateStatNumbers(stats) {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach(card => {
    const statNumber = card.querySelector('.stat-number');
    const statLabel = card.querySelector('.stat-label');
    
    if (!statNumber || !statLabel) return;
    
    const label = statLabel.textContent.toLowerCase();
    
    // Match the stat to update based on label text
    if (label.includes('flight')) {
      const currentCount = stats.flights;
      const previousCount = parseInt(statNumber.textContent) || 0;
      statNumber.textContent = currentCount.toString();
      
      // Update the change indicator
      const changeSpan = card.querySelector('.stat-change');
      if (changeSpan) {
        const difference = currentCount - previousCount;
        if (difference > 0) {
          changeSpan.textContent = `+${difference} this month`;
          changeSpan.className = 'stat-change positive';
        } else if (difference < 0) {
          changeSpan.textContent = `${difference} this month`;
          changeSpan.className = 'stat-change negative';
        } else {
          changeSpan.textContent = 'No change this month';
          changeSpan.className = 'stat-change neutral';
        }
      }
    } else if (label.includes('hotel')) {
      const currentCount = stats.hotels;
      const previousCount = parseInt(statNumber.textContent) || 0;
      statNumber.textContent = currentCount.toString();
      
      // Update the change indicator
      const changeSpan = card.querySelector('.stat-change');
      if (changeSpan) {
        const difference = currentCount - previousCount;
        if (difference > 0) {
          changeSpan.textContent = `+${difference} this month`;
          changeSpan.className = 'stat-change positive';
        } else if (difference < 0) {
          changeSpan.textContent = `${difference} this month`;
          changeSpan.className = 'stat-change negative';
        } else {
          changeSpan.textContent = 'No change this month';
          changeSpan.className = 'stat-change neutral';
        }
      }
    } else if (label.includes('package')) {
      const currentCount = stats.packages;
      const previousCount = parseInt(statNumber.textContent) || 0;
      statNumber.textContent = currentCount.toString();
      
      // Update the change indicator
      const changeSpan = card.querySelector('.stat-change');
      if (changeSpan) {
        const difference = currentCount - previousCount;
        if (difference > 0) {
          changeSpan.textContent = `+${difference} this month`;
          changeSpan.className = 'stat-change positive';
        } else if (difference < 0) {
          changeSpan.textContent = `${difference} this month`;
          changeSpan.className = 'stat-change negative';
        } else {
          changeSpan.textContent = 'No change this month';
          changeSpan.className = 'stat-change neutral';
        }
      }
    } else if (label.includes('money') || label.includes('saved')) {
      statNumber.textContent = `$${stats.savings.toLocaleString()}`;
      
      // Update the change indicator for savings
      const changeSpan = card.querySelector('.stat-change');
      if (changeSpan && stats.savings > 0) {
        changeSpan.textContent = `+$${Math.floor(stats.savings * 0.2).toLocaleString()} this year`;
        changeSpan.className = 'stat-change positive';
      }
    }
  });
}

function handleLogout() {
  // Show confirmation dialog
  if (confirm('Are you sure you want to logout?')) {
    // Add loading state
    const logoutBtn = document.getElementById('logoutBtn');
    const originalText = logoutBtn.innerHTML;
    
    logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
    logoutBtn.disabled = true;
    
    setTimeout(() => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUserEmail');
      window.location.href = '../login.html';
    }, 1000);
  }
}

function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  
  if (query.length > 0) {
    // Show search results (this would typically call an API)
    showSearchSuggestions(query);
  } else {
    hideSearchSuggestions();
  }
}

function showSearchSuggestions(query) {
  // Create or update search suggestions dropdown
  let dropdown = document.querySelector('.search-dropdown');
  
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    document.querySelector('.search-bar').appendChild(dropdown);
  }
  
  // Search through user's bookings
  const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
  const searchResults = searchBookings(query, upcomingTrips);
  
  if (searchResults.length === 0) {
    dropdown.innerHTML = `
      <div class="search-suggestion no-results">
        <i class="fas fa-search"></i>
        <span>No bookings found for "${query}"</span>
      </div>
    `;
  } else {
    dropdown.innerHTML = searchResults.map(booking => `
      <div class="search-suggestion booking-result" data-booking-id="${booking.id}" data-type="booking">
        <i class="fas ${getBookingIcon(booking.type)}"></i>
        <div class="booking-search-details">
          <span class="booking-name">${booking.name}</span>
          <span class="booking-location">${booking.location} • $${booking.price.toLocaleString()}</span>
          <span class="booking-status-small ${booking.status}">${booking.status}</span>
        </div>
      </div>
    `).join('');
    
    // Add click handlers for booking results
    dropdown.querySelectorAll('.booking-result').forEach(result => {
      result.addEventListener('click', function() {
        const bookingId = this.getAttribute('data-booking-id');
        highlightBooking(bookingId);
        dropdown.style.display = 'none';
        document.querySelector('.search-bar input').value = '';
      });
    });
  }
  
  dropdown.style.display = 'block';
}

// Search through bookings function
function searchBookings(query, bookings) {
  const searchTerm = query.toLowerCase().trim();
  
  if (searchTerm.length < 2) return [];
  
  return bookings.filter(booking => {
    return (
      booking.name?.toLowerCase().includes(searchTerm) ||
      booking.location?.toLowerCase().includes(searchTerm) ||
      booking.airline?.toLowerCase().includes(searchTerm) ||
      booking.flightNumber?.toLowerCase().includes(searchTerm) ||
      booking.from?.toLowerCase().includes(searchTerm) ||
      booking.to?.toLowerCase().includes(searchTerm) ||
      booking.type?.toLowerCase().includes(searchTerm) ||
      booking.status?.toLowerCase().includes(searchTerm)
    );
  }).slice(0, 5); // Limit to 5 results
}

// Highlight a specific booking in the list
function highlightBooking(bookingId) {
  // Remove existing highlights
  document.querySelectorAll('.booking-item.highlighted').forEach(item => {
    item.classList.remove('highlighted');
  });
  
  // Find and highlight the target booking
  const targetBooking = document.querySelector(`[data-booking-id="${bookingId}"]`);
  if (targetBooking) {
    targetBooking.classList.add('highlighted');
    targetBooking.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Show notification
    showBookingFoundNotification(bookingId);
    
    // Remove highlight after 3 seconds
    setTimeout(() => {
      targetBooking.classList.remove('highlighted');
    }, 3000);
  } else {
    showBookingNotFoundNotification();
  }
}

// Show booking found notification
function showBookingFoundNotification(bookingId) {
  const notification = document.createElement('div');
  notification.className = 'search-notification success';
  notification.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <span>Booking found and highlighted</span>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Show booking not found notification
function showBookingNotFoundNotification() {
  const notification = document.createElement('div');
  notification.className = 'search-notification error';
  notification.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>Booking not found in current view</span>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function hideSearchSuggestions() {
  const dropdown = document.querySelector('.search-dropdown');
  if (dropdown) {
    dropdown.style.display = 'none';
  }
}

function showNotifications() {
  const notifications = [
    {
      title: 'Flight Reminder',
      message: 'Your flight to Los Angeles is tomorrow at 2:30 PM',
      time: '2 hours ago',
      type: 'info'
    },
    {
      title: 'Booking Confirmed',
      message: 'Hotel booking for Hilton Garden Inn confirmed',
      time: '1 day ago',
      type: 'success'
    },
    {
      title: 'Special Offer',
      message: '40% off on flights to Paris - Limited time!',
      time: '2 days ago',
      type: 'warning'
    }
  ];
  
  showModal('Notifications', notifications.map(notif => `
    <div class="notification-item notification-${notif.type}">
      <div class="notification-content">
        <h4>${notif.title}</h4>
        <p>${notif.message}</p>
        <span class="notification-time">${notif.time}</span>
      </div>
    </div>
  `).join(''));
}

function handleDealClick(event) {
  event.preventDefault();
  const dealCard = event.target.closest('.deal-card');
  const dealTitle = dealCard.querySelector('h4').textContent;
  
  // Add click animation
  event.target.style.transform = 'scale(0.95)';
  setTimeout(() => {
    event.target.style.transform = 'scale(1)';
  }, 150);
  
  // Show deal details
  alert(`Booking ${dealTitle}... (This would redirect to the booking page)`);
}

function showModal(title, content) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  // Animate in
  setTimeout(() => modal.classList.add('show'), 10);
}

// Cancel booking function - Define before event delegation
function cancelBooking(bookingId) {
  console.log('🚫 cancelBooking called with bookingId:', bookingId);
  
  // Get all bookings from localStorage
  const upcomingTrips = JSON.parse(localStorage.getItem('upcomingTrips')) || [];
  
  // Find the booking to cancel
  const bookingToCancel = upcomingTrips.find(booking => booking.id.toString() === bookingId.toString());
  
  if (!bookingToCancel) {
    alert('❌ Booking not found!');
    return;
  }
  
  if (bookingToCancel.status !== 'confirmed') {
    alert('❌ Only confirmed bookings can be cancelled!');
    return;
  }
  
  // Show cancellation confirmation dialog
  const confirmation = confirm(
    `🚫 Cancel Booking Confirmation:\n\n` +
    `Booking: ${bookingToCancel.name}\n` +
    `Location: ${bookingToCancel.location}\n` +
    `Amount to Refund: $${bookingToCancel.price.toLocaleString()}\n\n` +
    `The refund amount will be added back to your wallet.\n\n` +
    `Are you sure you want to cancel this booking?`
  );
  
  if (!confirmation) return;
  
  try {
    // Get current user data and wallet balance
    const userData = JSON.parse(localStorage.getItem('travelEaseUser')) || { balance: 250.00 };
    const currentBalance = userData.balance || 250.00;
    const refundAmount = bookingToCancel.price;
    
    // Add refund to wallet
    const newBalance = currentBalance + refundAmount;
    userData.balance = newBalance;
    localStorage.setItem('travelEaseUser', JSON.stringify(userData));
    
    // Update booking status to cancelled
    bookingToCancel.status = 'cancelled';
    bookingToCancel.cancellationDate = new Date().toISOString();
    bookingToCancel.cancellationTime = new Date().toLocaleString();
    
    // Update the bookings in localStorage
    const updatedBookings = upcomingTrips.map(booking => 
      booking.id.toString() === bookingId.toString() ? bookingToCancel : booking
    );
    localStorage.setItem('upcomingTrips', JSON.stringify(updatedBookings));
    
    // Add wallet transaction record for refund
    addWalletTransaction({
      type: 'refund',
      title: `Booking Cancellation - ${bookingToCancel.name}`,
      date: new Date().toLocaleString(),
      method: 'Wallet Refund',
      amount: refundAmount
    });
    
    // Show success message
    alert(
      `✅ Booking Cancelled Successfully!\n\n` +
      `Booking: ${bookingToCancel.name}\n` +
      `Refund Amount: $${refundAmount.toFixed(2)}\n` +
      `New Wallet Balance: $${newBalance.toFixed(2)}\n\n` +
      `The refund has been added to your wallet.`
    );
    
    // Refresh the bookings display and stats
    updateRecentBookings();
    updateStats(); // Update stats immediately after cancellation
    
    // Trigger wallet balance update across tabs/windows
    triggerWalletUpdate();
    
    console.log('✅ Booking cancelled successfully!');
    
  } catch (error) {
    console.error('❌ Error cancelling booking:', error);
    alert('❌ An error occurred while cancelling the booking. Please try again.');
  }
};

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

// Helper function to trigger wallet update
function triggerWalletUpdate() {
  try {
    // Trigger custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('walletUpdated', { 
      detail: { timestamp: Date.now() } 
    }));
    
    // Trigger storage event for cross-tab updates
    const flag = Date.now().toString();
    localStorage.setItem('walletUpdateFlag', flag);
    
    // Clean up the flag after a short delay
    setTimeout(() => {
      if (localStorage.getItem('walletUpdateFlag') === flag) {
        localStorage.removeItem('walletUpdateFlag');
      }
    }, 1000);
  } catch (error) {
    console.error('Error triggering wallet update:', error);
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add some CSS for the new components
const dashboardStyles = document.createElement('style');
dashboardStyles.textContent = `
  .search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-light);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    margin-top: 0.5rem;
    display: none;
  }
  
  .search-suggestion {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .search-suggestion:hover {
    background: var(--gray-100);
  }
  
  .search-suggestion:first-child {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  
  .search-suggestion:last-child {
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .modal-overlay.show {
    opacity: 1;
  }
  
  .modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    transform: scale(0.9);
    transition: transform 0.3s ease;
  }
  
  .modal-overlay.show .modal-content {
    transform: scale(1);
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-light);
  }
  
  .modal-header h3 {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
  }
  
  .modal-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }
  
  .modal-close:hover {
    background: var(--gray-100);
    color: var(--text-primary);
  }
  
  .modal-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .notification-item {
    padding: 1rem;
    border-radius: var(--radius-lg);
    margin-bottom: 1rem;
    border-left: 4px solid;
  }
  
  .notification-info {
    border-left-color: var(--info);
    background: rgba(59, 130, 246, 0.1);
  }
  
  .notification-success {
    border-left-color: var(--success);
    background: rgba(16, 185, 129, 0.1);
  }
  
  .notification-warning {
    border-left-color: var(--warning);
    background: rgba(245, 158, 11, 0.1);
  }
  
  .notification-content h4 {
    margin: 0 0 0.5rem 0;
    font-size: var(--font-size-base);
    font-weight: 600;
  }
  
  .notification-content p {
    margin: 0 0 0.5rem 0;
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }
  
  .notification-time {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
  }
  
  body.loading {
    pointer-events: none;
  }
  
  body.loading .main-content {
    opacity: 0.6;
  }
  
  .empty-bookings {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-muted);
  }
  
  .empty-bookings .empty-icon {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: 1rem;
    opacity: 0.6;
  }
  
  .empty-bookings h4 {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  .empty-bookings p {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  .empty-bookings .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
  
  /* Booking item layout */
  .booking-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }
  
  .booking-actions {
    margin-left: auto;
    padding-left: 1rem;
  }
  
  .cancel-booking-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #ff4757;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  
  .cancel-booking-btn:hover {
    background: #ff3838;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
  }
  
  .cancel-booking-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.2);
  }
  
  .cancel-booking-btn i {
    font-size: 0.8rem;
  }
  
  /* Status styling for cancelled bookings */
  .booking-status.cancelled {
    background: #ffeaa7;
    color: #2d3436;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  /* Search results styling */
  .booking-result {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    border-bottom: 1px solid var(--border-light);
  }
  
  .booking-result:hover {
    background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
    transform: translateX(4px);
    border-color: var(--primary-200);
  }
  
  .booking-result:last-child {
    border-bottom: none;
  }
  
  .booking-search-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }
  
  .booking-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.9rem;
  }
  
  .booking-location {
    font-size: 0.8rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .booking-status-small {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    padding: 0.125rem 0.375rem;
    border-radius: 12px;
    background: var(--gray-100);
    color: var(--text-muted);
    align-self: flex-start;
  }
  
  .booking-status-small.confirmed {
    background: var(--success-100);
    color: var(--success-700);
  }
  
  .booking-status-small.pending {
    background: var(--warning-100);
    color: var(--warning-700);
  }
  
  .booking-status-small.cancelled {
    background: var(--error-100);
    color: var(--error-700);
  }
  
  .no-results {
    color: var(--text-muted);
    font-style: italic;
    padding: 1.5rem 1rem;
    text-align: center;
  }
  
  /* Booking highlighting */
  .booking-item.highlighted {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border: 2px solid #f59e0b;
    border-radius: var(--radius-lg);
    box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
    transform: scale(1.02);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .booking-item.highlighted .booking-details h4 {
    color: #92400e;
    font-weight: 700;
  }
  
  .booking-item.highlighted .booking-amount {
    color: #92400e;
    font-weight: 700;
  }
  
  /* Search notifications */
  .search-notification {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 10000;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 250px;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .search-notification.show {
    transform: translateX(0);
  }
  
  .search-notification.success {
    border-left: 4px solid var(--success);
    background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  }
  
  .search-notification.success i {
    color: var(--success);
    font-size: 1.25rem;
  }
  
  .search-notification.error {
    border-left: 4px solid var(--error);
    background: linear-gradient(135deg, #fef2f2, #fee2e2);
  }
  
  .search-notification.error i {
    color: var(--error);
    font-size: 1.25rem;
  }
  
  .search-notification span {
    font-weight: 500;
    color: var(--text-primary);
    font-size: 0.9rem;
  }
  
  /* Responsive search dropdown */
  @media (max-width: 768px) {
    .search-dropdown {
      position: fixed;
      top: auto;
      left: 1rem;
      right: 1rem;
      margin-top: 0;
      max-height: 70vh;
      overflow-y: auto;
    }
    
    .booking-search-details {
      gap: 0.125rem;
    }
    
    .booking-name {
      font-size: 0.85rem;
    }
    
    .booking-location {
      font-size: 0.75rem;
    }
    
    .search-notification {
      right: 0.5rem;
      left: 0.5rem;
      min-width: auto;
      font-size: 0.85rem;
    }
  }
`;
document.head.appendChild(dashboardStyles);
