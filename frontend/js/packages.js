document.addEventListener('DOMContentLoaded', () => {
  const packagesList = document.getElementById('packagesList');
  const filterTabs = document.querySelectorAll('.filter-tab');
  const viewBtns = document.querySelectorAll('.view-btn');
  
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
  
  // Enhanced package data with categories
  const packages = [
    {
      id: 1,
      name: 'Tropical Paradise Getaway',
      location: 'Bali, Indonesia',
      description: 'Experience the ultimate tropical paradise with pristine beaches, ancient temples, and luxurious resorts.',
      details: '7 days in Bali',
      price: 1299,
      duration: '7 days / 6 nights',
      category: 'beach',
      features: ['All Inclusive', 'Beach Resort', 'Spa Access', 'Cultural Tours'],
      rating: 4.8,
      badge: 'Popular'
    },
    {
      id: 2,
      name: 'European Grand Tour',
      location: 'Paris, Rome, Barcelona',
      description: 'Discover the rich history and culture of Europe with visits to iconic cities and landmarks.',
      details: '10 days multi-city tour',
      price: 2899,
      duration: '10 days / 9 nights',
      category: 'cultural',
      features: ['City Tours', 'Museums', 'Local Cuisine', 'Historic Sites'],
      rating: 4.9,
      badge: 'Best Seller'
    },
    {
      id: 3,
      name: 'Mountain Adventure Trek',
      location: 'Nepal Himalayas',
      description: 'Challenge yourself with breathtaking mountain views and an unforgettable trekking experience.',
      details: '8 days mountain trekking',
      price: 1599,
      duration: '8 days / 7 nights',
      category: 'adventure',
      features: ['Professional Guide', 'Camping', 'Mountain Views', 'Local Culture'],
      rating: 4.7,
      badge: 'Adventure'
    },
    {
      id: 4,
      name: 'Luxury Safari Experience',
      location: 'Kenya & Tanzania',
      description: 'Witness the great migration and enjoy luxury accommodations in the heart of African wilderness.',
      details: '6 days luxury safari',
      price: 3499,
      duration: '6 days / 5 nights',
      category: 'luxury',
      features: ['Luxury Lodges', 'Game Drives', 'Professional Guide', 'All Meals'],
      rating: 4.9,
      badge: 'Exclusive'
    },
    {
      id: 5,
      name: 'Amazon Rainforest Explorer',
      location: 'Peru & Brazil',
      description: 'Immerse yourself in the world\'s largest rainforest and discover incredible wildlife.',
      details: '9 days rainforest adventure',
      price: 2199,
      duration: '9 days / 8 nights',
      category: 'adventure',
      features: ['Jungle Lodge', 'Wildlife Tours', 'River Cruises', 'Local Guides'],
      rating: 4.6
    },
    {
      id: 6,
      name: 'Greek Island Hopping',
      location: 'Santorini, Mykonos, Crete',
      description: 'Explore the stunning Greek islands with crystal clear waters and whitewashed villages.',
      details: '8 days island hopping',
      price: 1899,
      duration: '8 days / 7 nights',
      category: 'beach',
      features: ['Island Ferry', 'Beach Hotels', 'Local Cuisine', 'Historic Sites'],
      rating: 4.8
    }
  ];
  
  let currentCategory = 'all';
  let currentView = 'grid';
  
  // Initialize display
  displayPackages(packages);
  
  // Category filter functionality
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter packages
      currentCategory = tab.dataset.category;
      const filteredPackages = currentCategory === 'all' 
        ? packages 
        : packages.filter(pkg => pkg.category === currentCategory);
      
      displayPackages(filteredPackages);
    });
  });
  
  // View toggle functionality
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentView = btn.dataset.view;
      
      if (currentView === 'list') {
        packagesList.classList.add('list-view');
      } else {
        packagesList.classList.remove('list-view');
      }
    });
  });
  
  function displayPackages(packagesToShow) {
    if (!packagesList) return;
    
    let html = '';
    packagesToShow.forEach(pkg => {
      const categoryIcons = {
        adventure: 'fa-mountain',
        beach: 'fa-umbrella-beach',
        cultural: 'fa-landmark',
        luxury: 'fa-gem'
      };
      
      const icon = categoryIcons[pkg.category] || 'fa-suitcase';
      
      html += `
        <div class="package-card" data-category="${pkg.category}">
          <div class="package-image">
            <i class="fas ${icon}"></i>
            ${pkg.badge ? `<div class="package-badge">${pkg.badge}</div>` : ''}
          </div>
          <div class="package-content">
            <div class="package-header">
              <h3 class="package-title">${pkg.name}</h3>
              <div class="package-location">
                <i class="fas fa-map-marker-alt"></i>
                ${pkg.location}
              </div>
            </div>
            
            <div class="package-details">
              <p class="package-description">${pkg.description}</p>
              <div class="package-features">
                ${pkg.features.map(feature => `<span class="package-feature">${feature}</span>`).join('')}
              </div>
              <div class="package-duration">
                <i class="fas fa-clock"></i>
                ${pkg.duration}
              </div>
            </div>
            
            <div class="package-footer">
              <div class="package-price">
                <div class="price-amount">$${pkg.price.toLocaleString()}</div>
                <div class="price-period">per person</div>
              </div>
              <button class="book-package-btn" data-id="${pkg.id}">
                <i class="fas fa-suitcase"></i>
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    packagesList.innerHTML = html;
    
    // Add booking event listeners
    packagesList.querySelectorAll('.book-package-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkgId = btn.getAttribute('data-id');
        const pkg = packages.find(p => p.id == pkgId);
        bookPackage(pkg);
      });
    });
  }
  
  function bookPackage(pkg) {
    // Get current user data including wallet balance
    const userData = JSON.parse(localStorage.getItem('travelEaseUser')) || { balance: 250.00 };
    const currentBalance = userData.balance || 250.00;
    
    // Check if wallet has sufficient balance
    if (currentBalance < pkg.price) {
      // Show insufficient balance error
      showInsufficientBalanceError(pkg.price, currentBalance);
      return;
    }
    
    // Deduct amount from wallet
    const newBalance = currentBalance - pkg.price;
    userData.balance = newBalance;
    localStorage.setItem('travelEaseUser', JSON.stringify(userData));
    
    // Create booking record
    const booking = {
      id: Date.now(),
      type: 'package',
      name: pkg.name,
      location: pkg.location,
      duration: pkg.duration,
      price: pkg.price,
      features: pkg.features,
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
      title: `Package Booking - ${pkg.name}`,
      date: new Date().toLocaleString(),
      method: 'Wallet Balance',
      amount: -pkg.price
    });
    
    // Show success message
    showBookingSuccessMessage(pkg, newBalance);
    
    // Trigger dashboard update across tabs/windows
    console.log('📦 Package booked, triggering dashboard update...');
    triggerDashboardUpdate();
    console.log('✅ Dashboard update triggered successfully!');
    
    // Also log the booking data for debugging
    console.log('Booking created:', booking);
    console.log('Current upcomingTrips:', JSON.parse(localStorage.getItem('upcomingTrips')));
  }
  
  function showInsufficientBalanceError(packagePrice, currentBalance) {
    const shortfall = packagePrice - currentBalance;
    alert(`❌ Insufficient Balance\n\nPackage Price: $${packagePrice.toLocaleString()}\nYour Balance: $${currentBalance.toFixed(2)}\nShortfall: $${shortfall.toFixed(2)}\n\nPlease add funds to your wallet to complete this booking.`);
  }
  
  function showBookingSuccessMessage(pkg, newBalance) {
    alert(`✅ Package Booked Successfully!\n\nPackage: ${pkg.name}\nLocation: ${pkg.location}\nDuration: ${pkg.duration}\nAmount Paid: $${pkg.price.toLocaleString()}\n\nRemaining Balance: $${newBalance.toFixed(2)}\n\nBooking confirmation will be sent to your email.`);
  }
  
  function addWalletTransaction(transactionData) {
    // Get existing transactions
    let transactions = JSON.parse(localStorage.getItem('walletTransactions')) || [];
    
    // Create new transaction
    const newTransaction = {
      id: Date.now(),
      timestamp: Date.now(),
      ...transactionData
    };
    
    // Add to beginning of transactions array
    transactions.unshift(newTransaction);
    
    // Save back to localStorage
    localStorage.setItem('walletTransactions', JSON.stringify(transactions));
  }
  
  // Add smooth scrolling to package cards on hover
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.package-card')) {
      e.target.closest('.package-card').style.transform = 'translateY(-8px)';
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.package-card')) {
      e.target.closest('.package-card').style.transform = 'translateY(0)';
    }
  });
  
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
  
  // Trigger dashboard update when a booking is made
  function triggerDashboardUpdate() {
    // Create a custom storage event to notify dashboard
    const dashboardUpdateEvent = {
      key: 'dashboardUpdate',
      newValue: Date.now().toString(),
      type: 'bookingMade'
    };
    
    // Dispatch custom event for same-window communication
    window.dispatchEvent(new CustomEvent('bookingMade', {
      detail: { timestamp: Date.now() }
    }));
    
    // Use localStorage to trigger storage events across tabs/windows
    localStorage.setItem('lastBookingUpdate', Date.now().toString());
    
    // Also trigger a manual storage event for cross-tab communication
    try {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'upcomingTrips',
        newValue: localStorage.getItem('upcomingTrips'),
        url: window.location.href
      }));
    } catch (e) {
      // Fallback for browsers that don't support StorageEvent constructor
      console.log('Booking made - dashboard should update');
    }
  }
});
