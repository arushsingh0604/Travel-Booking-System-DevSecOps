document.addEventListener('DOMContentLoaded', () => {
  const offersList = document.getElementById('offersList');
  const categoryTabs = document.querySelectorAll('.category-tab');
  const filterSelect = document.querySelector('.filter-select');
  
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
  
  // Enhanced offers data with categories and more details
  const offers = [
    {
      id: 1,
      title: 'International Flight Flash Sale',
      description: 'Book your dream international flight at unbeatable prices. Limited time offer with instant confirmation.',
      discount: '50% OFF',
      category: 'flights',
      code: 'INTFLIGHT50',
      features: ['All Destinations', 'Instant Booking', 'Free Cancellation', '24/7 Support'],
      validity: 'Valid until Dec 31, 2024',
      priority: 1
    },
    {
      id: 2,
      title: 'Luxury Hotel Stays',
      description: 'Experience premium accommodations with exclusive amenities and personalized service.',
      discount: '35% OFF',
      category: 'hotels',
      code: 'LUXHOTEL35',
      features: ['5-Star Hotels', 'Spa Access', 'Room Upgrade', 'Free Breakfast'],
      validity: 'Valid until Nov 30, 2024',
      priority: 2
    },
    {
      id: 3,
      title: 'Complete Vacation Packages',
      description: 'All-inclusive vacation packages with flights, hotels, and activities bundled together.',
      discount: '40% OFF',
      category: 'packages',
      code: 'VACATION40',
      features: ['Flight + Hotel', 'Activities Included', 'Tour Guide', 'Travel Insurance'],
      validity: 'Valid until Jan 15, 2025',
      priority: 3
    },
    {
      id: 4,
      title: 'Weekend Getaway Special',
      description: 'Quick weekend escapes to nearby destinations with amazing deals on short stays.',
      discount: '25% OFF',
      category: 'hotels',
      code: 'WEEKEND25',
      features: ['2-3 Days', 'City Centers', 'Free WiFi', 'Late Checkout'],
      validity: 'Valid until Dec 15, 2024',
      priority: 4
    },
    {
      id: 5,
      title: 'Last Minute Flight Deals',
      description: 'Grab amazing discounts on flights departing within the next 7 days. Perfect for spontaneous travelers.',
      discount: '60% OFF',
      category: 'limited',
      code: 'LASTMIN60',
      features: ['7 Days Notice', 'Domestic & Intl', 'Mobile Check-in', 'Seat Selection'],
      validity: 'Valid for next 48 hours only',
      priority: 5
    },
    {
      id: 6,
      title: 'Adventure Package Combo',
      description: 'Thrilling adventure packages including extreme sports, mountain trekking, and wildlife safaris.',
      discount: '45% OFF',
      category: 'packages',
      code: 'ADVENTURE45',
      features: ['Adventure Sports', 'Professional Guide', 'Safety Equipment', 'Group Discounts'],
      validity: 'Valid until Mar 31, 2025',
      priority: 6
    }
  ];
  
  let currentCategory = 'all';
  
  // Initialize timer
  startCountdownTimer();
  
  // Initialize display
  displayOffers(offers);
  
  // Category filter functionality
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Filter offers
      currentCategory = tab.dataset.category;
      const filteredOffers = currentCategory === 'all' 
        ? offers 
        : offers.filter(offer => offer.category === currentCategory);
      
      displayOffers(filteredOffers);
    });
  });
  
  // Sort/filter functionality
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      const currentOffers = getCurrentOffers();
      const sortedOffers = sortOffers(currentOffers, filterSelect.value);
      displayOffers(sortedOffers);
    });
  }
  
  function getCurrentOffers() {
    return currentCategory === 'all' 
      ? offers 
      : offers.filter(offer => offer.category === currentCategory);
  }
  
  function sortOffers(offersToSort, sortType) {
    const sorted = [...offersToSort];
    
    switch (sortType) {
      case 'discount':
        return sorted.sort((a, b) => {
          const aDiscount = parseInt(a.discount.replace(/[^0-9]/g, ''));
          const bDiscount = parseInt(b.discount.replace(/[^0-9]/g, ''));
          return bDiscount - aDiscount;
        });
      case 'expiry':
        return sorted.sort((a, b) => a.priority - b.priority);
      case 'newest':
      default:
        return sorted.sort((a, b) => a.id - b.id);
    }
  }
  
  function displayOffers(offersToShow) {
    if (!offersList) return;
    
    let html = '';
    offersToShow.forEach(offer => {
      const categoryIcons = {
        flights: 'fa-plane-departure',
        hotels: 'fa-bed',
        packages: 'fa-suitcase',
        limited: 'fa-clock'
      };
      
      const icon = categoryIcons[offer.category] || 'fa-tag';
      
      html += `
        <div class="offer-card" data-category="${offer.category}">
          <div class="offer-header">
            <div class="offer-discount">${offer.discount}</div>
            <h3 class="offer-title">${offer.title}</h3>
            <div class="offer-category">
              <i class="fas ${icon}"></i>
              ${offer.category.charAt(0).toUpperCase() + offer.category.slice(1)}
            </div>
          </div>
          
          <div class="offer-content">
            <p class="offer-description">${offer.description}</p>
            
            <div class="offer-features">
              ${offer.features.map(feature => `<span class="offer-feature">${feature}</span>`).join('')}
            </div>
            
            <div class="offer-validity">
              <i class="fas fa-calendar-alt"></i>
              ${offer.validity}
            </div>
            
            <div class="offer-footer">
              <div class="offer-code">${offer.code}</div>
              <button class="claim-offer-btn" data-id="${offer.id}">
                <i class="fas fa-tag"></i>
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    offersList.innerHTML = html;
    
    // Add claim event listeners
    document.querySelectorAll('.claim-offer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const offerId = btn.getAttribute('data-id');
        const offer = offers.find(o => o.id == offerId);
        claimOffer(offer);
      });
    });
  }
  
  function claimOffer(offer) {
    // Copy code to clipboard
    navigator.clipboard.writeText(offer.code).then(() => {
      // Save claimed offer
      const claimedOffers = JSON.parse(localStorage.getItem('claimedOffers')) || [];
      
      if (!claimedOffers.find(o => o.id === offer.id)) {
        claimedOffers.push({
          ...offer,
          claimedDate: new Date().toISOString()
        });
        localStorage.setItem('claimedOffers', JSON.stringify(claimedOffers));
      }
      
      // Show success message
      alert(`Offer claimed successfully!\n\nCode: ${offer.code}\n(Copied to clipboard)\n\nUse this code during checkout to get ${offer.discount} on ${offer.title}.\n\n${offer.validity}`);
    }).catch(() => {
      // Fallback if clipboard API is not available
      alert(`Offer claimed successfully!\n\nCode: ${offer.code}\n\nPlease copy this code and use it during checkout to get ${offer.discount} on ${offer.title}.\n\n${offer.validity}`);
    });
  }
  
  function startCountdownTimer() {
    const timerValues = document.querySelectorAll('.timer-value');
    
    if (timerValues.length === 0) return;
    
    let hours = 23;
    let minutes = 45;
    
    const updateTimer = () => {
      if (timerValues[0]) timerValues[0].textContent = hours.toString().padStart(2, '0');
      if (timerValues[1]) timerValues[1].textContent = minutes.toString().padStart(2, '0');
      
      minutes--;
      if (minutes < 0) {
        minutes = 59;
        hours--;
        if (hours < 0) {
          hours = 23;
          minutes = 59;
        }
      }
    };
    
    // Update immediately
    updateTimer();
    
    // Update every minute
    setInterval(updateTimer, 60000);
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
});
