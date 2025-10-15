document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Dashboard page loaded');

    // Elements
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const alertContainer = document.getElementById('alertContainer');
    const adminNameEl = document.getElementById('adminName');
    const adminEmailEl = document.getElementById('adminEmail');
    const navLinks = document.querySelectorAll('.nav-link');
    const actionCards = document.querySelectorAll('.action-card');
    
    // Stats elements
    const totalUsersEl = document.getElementById('totalUsers');
    const totalFlightsEl = document.getElementById('totalFlights');
    const totalHotelsEl = document.getElementById('totalHotels');
    const totalBookingsEl = document.getElementById('totalBookings');
    const activityListEl = document.getElementById('activityList');

    // Check authentication
    checkAuthentication();

    // Mobile sidebar toggle
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Navigation handling
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Handle navigation
            const section = this.dataset.section;
            if (section) {
                handleNavigation(section);
            }
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Quick action handlers
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.dataset.action;
            handleQuickAction(action);
        });
    });

    // Logout handler
    logoutBtn.addEventListener('click', handleLogout);

    // Refresh data handler
    refreshBtn.addEventListener('click', function() {
        loadDashboardData();
        showAlert('success', 'Data refreshed successfully!');
    });

    // Load initial data
    loadAdminInfo();
    loadDashboardData();

    function checkAuthentication() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
        const adminInfo = sessionStorage.getItem('adminInfo');
        
        if (!isLoggedIn || !adminInfo) {
            console.log('❌ Admin not authenticated, redirecting to login');
            window.location.href = '/admin/admin-login.html';
            return;
        }
        
        console.log('✅ Admin authenticated');
    }

    async function loadAdminInfo() {
        try {
            // Try to get admin info from API first
            const response = await fetch('/api/admin/current', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.admin) {
                    adminNameEl.textContent = data.admin.name || 'Admin User';
                    adminEmailEl.textContent = data.admin.email || 'admin@example.com';
                    console.log('👤 Admin info loaded from API:', data.admin);
                    return;
                }
            }
            
            // Fallback to sessionStorage
            const adminInfo = JSON.parse(sessionStorage.getItem('adminInfo'));
            if (adminInfo) {
                adminNameEl.textContent = adminInfo.name || 'Admin User';
                adminEmailEl.textContent = adminInfo.email || 'admin@example.com';
                console.log('👤 Admin info loaded from session:', adminInfo);
            } else {
                // Default values
                adminNameEl.textContent = 'Admin User';
                adminEmailEl.textContent = 'admin@example.com';
            }
        } catch (error) {
            console.error('Error loading admin info:', error);
            adminNameEl.textContent = 'Admin User';
            adminEmailEl.textContent = 'admin@example.com';
        }
    }

    async function loadDashboardData() {
        console.log('📊 Loading dashboard statistics...');
        
        try {
            // Set loading state
            setStatsLoading(true);
            
            // Load stats (placeholder data since we don't have the API endpoints yet)
            await loadStats();
            
            // Load recent activity
            await loadRecentActivity();
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showAlert('error', 'Failed to load dashboard data. Please try refreshing the page.');
        } finally {
            setStatsLoading(false);
        }
    }

    async function loadStats() {
        try {
            console.log('📈 Loading statistics from API...');
            
            const response = await fetch('/api/admin/stats', {
                method: 'GET',
                credentials: 'include'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.stats) {
                const stats = {
                    totalUsers: data.stats.users.total,
                    totalFlights: data.stats.flights.active,
                    totalHotels: data.stats.hotels.active,
                    totalBookings: data.stats.bookings.total
                };
                
                // Animate numbers
                animateNumber(totalUsersEl, stats.totalUsers);
                animateNumber(totalFlightsEl, stats.totalFlights);
                animateNumber(totalHotelsEl, stats.totalHotels);
                animateNumber(totalBookingsEl, stats.totalBookings);
                
                console.log('✅ Real statistics loaded:', stats);
            } else {
                throw new Error('Invalid response format');
            }
            
        } catch (error) {
            console.error('Error loading stats:', error);
            
            // Fallback to loading sample data on error
            const fallbackStats = {
                totalUsers: 0,
                totalFlights: 0,
                totalHotels: 0,
                totalBookings: 0
            };
            
            totalUsersEl.textContent = fallbackStats.totalUsers;
            totalFlightsEl.textContent = fallbackStats.totalFlights;
            totalHotelsEl.textContent = fallbackStats.totalHotels;
            totalBookingsEl.textContent = fallbackStats.totalBookings;
            
            showAlert('warning', 'Unable to load current statistics. Please try refreshing.');
        }
    }

    async function loadRecentActivity() {
        console.log('📋 Loading recent activity...');
        
        try {
            // Mock recent activity data
            const activities = [
                {
                    icon: 'fas fa-user-plus',
                    title: 'New user registration',
                    time: '2 minutes ago'
                },
                {
                    icon: 'fas fa-plane',
                    title: 'Flight booking completed',
                    time: '15 minutes ago'
                },
                {
                    icon: 'fas fa-hotel',
                    title: 'Hotel added to system',
                    time: '1 hour ago'
                },
                {
                    icon: 'fas fa-user-shield',
                    title: 'Admin login detected',
                    time: '2 hours ago'
                },
                {
                    icon: 'fas fa-cog',
                    title: 'System maintenance completed',
                    time: '3 hours ago'
                }
            ];
            
            // Clear loading state
            activityListEl.innerHTML = '';
            
            // Add activities
            activities.forEach(activity => {
                const activityEl = createActivityItem(activity);
                activityListEl.appendChild(activityEl);
            });
            
            console.log('✅ Recent activity loaded');
            
        } catch (error) {
            console.error('Error loading recent activity:', error);
            activityListEl.innerHTML = '<div class="loading">Failed to load recent activity</div>';
        }
    }

    function createActivityItem(activity) {
        const li = document.createElement('li');
        li.className = 'activity-item';
        
        li.innerHTML = `
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
        
        return li;
    }

    function animateNumber(element, targetNumber) {
        const duration = 2000; // 2 seconds
        const increment = targetNumber / (duration / 50); // Update every 50ms
        let currentNumber = 0;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= targetNumber) {
                element.textContent = targetNumber;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentNumber);
            }
        }, 50);
    }

    function setStatsLoading(isLoading) {
        const statNumbers = [totalUsersEl, totalFlightsEl, totalHotelsEl, totalBookingsEl];
        
        if (isLoading) {
            statNumbers.forEach(el => {
                el.textContent = '...';
            });
        }
    }

    function handleNavigation(section) {
        console.log(`🧭 Navigating to section: ${section}`);
        
        switch(section) {
            case 'users':
                window.location.href = 'users.html';
                break;
            case 'flights':
                window.location.href = 'flights.html';
                break;
            case 'hotels':
                window.location.href = 'hotels.html';
                break;
            case 'bookings':
                window.location.href = 'bookings.html';
                break;
            case 'analytics':
                showAlert('warning', 'Analytics panel will be available soon.');
                break;
            case 'settings':
                showAlert('warning', 'Settings panel will be available soon.');
                break;
            default:
                console.log('Unknown section:', section);
        }
    }

    function handleQuickAction(action) {
        console.log(`⚡ Quick action: ${action}`);
        
        switch(action) {
            case 'add-flight':
                showAlert('warning', 'Add Flight functionality will be available soon.');
                break;
            case 'add-hotel':
                showAlert('warning', 'Add Hotel functionality will be available soon.');
                break;
            case 'view-reports':
                showAlert('warning', 'Reports functionality will be available soon.');
                break;
            case 'manage-users':
                showAlert('warning', 'User Management functionality will be available soon.');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    async function handleLogout() {
        console.log('🚪 Logging out admin...');
        
        try {
            // Show loading state
            logoutBtn.disabled = true;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Out...';
            
            // Call logout API (placeholder for now)
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
            
            // Clear session storage
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminInfo');
            sessionStorage.removeItem('adminToken');
            
            // Clear local storage
            localStorage.removeItem('adminRememberEmail');
            
            showAlert('success', 'Logged out successfully! Redirecting...');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = '/admin/admin-login.html';
            }, 1500);
            
        } catch (error) {
            console.error('Logout error:', error);
            
            // Clear storage anyway
            sessionStorage.clear();
            localStorage.removeItem('adminRememberEmail');
            
            // Redirect to login
            window.location.href = '/admin/admin-login.html';
        }
    }

    function showAlert(type, message) {
        console.log(`🔔 Showing ${type} alert:`, message);
        
        hideAlert(); // Clear any existing alerts
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        alert.id = 'currentAlert';
        
        alertContainer.appendChild(alert);
        alert.style.display = 'block';
        
        // Auto-hide alerts
        if (type === 'success') {
            setTimeout(hideAlert, 3000);
        } else if (type === 'warning') {
            setTimeout(hideAlert, 5000);
        }
    }

    function hideAlert() {
        const existingAlert = document.getElementById('currentAlert');
        if (existingAlert) {
            existingAlert.remove();
        }
    }

    // Handle window resize for mobile responsiveness
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('open');
        }
    });

    // Auto-refresh dashboard data every 5 minutes
    setInterval(() => {
        console.log('🔄 Auto-refreshing dashboard data...');
        loadDashboardData();
    }, 5 * 60 * 1000);

    console.log('✅ Admin Dashboard JavaScript initialized successfully');
});
