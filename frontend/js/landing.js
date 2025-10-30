document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    });
  }

  // Search tab functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const searchForm = document.getElementById('quickSearch');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all tabs
      tabButtons.forEach(tab => tab.classList.remove('active'));
      // Add active class to clicked tab
      btn.classList.add('active');
      
      // Update form based on selected tab
      updateSearchForm(btn.dataset.tab);
    });
  });

  function updateSearchForm(tabType) {
    const formRows = searchForm.querySelectorAll('.form-row');
    const searchBtn = searchForm.querySelector('.search-btn');
    
    // Reset form
    formRows.forEach(row => row.style.display = 'grid');
    
    switch(tabType) {
      case 'flights':
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Flights';
        break;
      case 'hotels':
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Hotels';
        // Hide second date field for hotels
        const returnField = searchForm.querySelector('.form-row:last-of-type .form-group:last-child');
        if (returnField) {
          returnField.style.display = 'none';
        }
        break;
      case 'packages':
        searchBtn.innerHTML = '<i class="fas fa-search"></i> Search Packages';
        break;
    }
  }

  // Quick search form submission
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeTab = document.querySelector('.tab-btn.active');
      const tabType = activeTab ? activeTab.dataset.tab : 'flights';
      
      // Show alert for demo purposes
      alert(`Redirecting to ${tabType} search... (Please register/login first to access full features)`);
      
      // In a real app, you would redirect to the appropriate search page
      // window.location.href = `register.html`;
    });
  }

  // Navbar scroll effect
  let lastScrollTop = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove background based on scroll position
    if (scrollTop > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
  });

  // Feature cards animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe feature cards
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    // Initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    observer.observe(card);
  });

  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  @media (max-width: 768px) {
    .nav-menu.active {
      display: flex;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      flex-direction: column;
      padding: 1rem;
      box-shadow: var(--shadow-lg);
      border-top: 1px solid var(--border-light);
    }
  }
`;
document.head.appendChild(style);
