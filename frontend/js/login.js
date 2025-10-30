document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Login page loaded');

    // Get form elements
    const form = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const rememberMe = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    const alertContainer = document.getElementById('alertContainer');

    // Check for success message from registration
    const registerSuccess = sessionStorage.getItem('adminRegisterSuccess');
    if (registerSuccess) {
        showAlert('success', registerSuccess);
        sessionStorage.removeItem('adminRegisterSuccess');
    }

    // Password toggle functionality
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });

    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem('adminRememberEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMe.checked = true;
    }

    // Email validation
    emailInput.addEventListener('input', function() {
        const email = this.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.setCustomValidity('Please enter a valid email address');
        } else {
            this.setCustomValidity('');
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 Admin login form submitted');

        // Get form data
        const formData = {
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value,
            rememberMe: rememberMe.checked
        };

        console.log('📄 Form data prepared:', {
            email: formData.email,
            rememberMe: formData.rememberMe
        });

        // Client-side validation
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            console.log('🌐 Sending login request...');
            
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            console.log('📡 Server response status:', response.status);

            const data = await response.json();
            console.log('📦 Server response data:', data);

            if (response.ok && data.success) {
                console.log('✅ Admin login successful');
                showAlert('success', 'Login successful! Redirecting to dashboard...');
                
                // Handle remember me
                if (formData.rememberMe) {
                    localStorage.setItem('adminRememberEmail', formData.email);
                } else {
                    localStorage.removeItem('adminRememberEmail');
                }
                
                // Store admin session info
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminInfo', JSON.stringify({
                    id: data.admin.id,
                    name: data.admin.name,
                    email: data.admin.email,
                    role: data.admin.role
                }));
                
                // Store token if provided
                if (data.token) {
                    sessionStorage.setItem('adminToken', data.token);
                }
                
                // Clear form
                form.reset();
                
                // Redirect to admin dashboard after 1.5 seconds
                setTimeout(() => {
                    window.location.href = '../admin-pages/dashboard.html';
                }, 1500);
                
            } else {
                console.log('❌ Admin login failed:', data.message);
                showAlert('error', data.message || 'Login failed. Please check your credentials.');
                
                // Clear password on failed login
                passwordInput.value = '';
                passwordInput.focus();
            }

        } catch (error) {
            console.error('💥 Login error:', error);
            showAlert('error', 'Network error. Please check your connection and try again.');
        } finally {
            setLoadingState(false);
        }
    });

    function validateForm(data) {
        console.log('🔍 Validating form data...');

        // Clear previous alerts
        hideAlert();

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showAlert('error', 'Please enter a valid email address.');
            emailInput.focus();
            return false;
        }

        // Password validation
        if (!data.password) {
            showAlert('error', 'Password is required.');
            passwordInput.focus();
            return false;
        }

        if (data.password.length < 6) {
            showAlert('error', 'Password must be at least 6 characters long.');
            passwordInput.focus();
            return false;
        }

        console.log('✅ Form validation passed');
        return true;
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            
            // Disable form inputs
            emailInput.disabled = true;
            passwordInput.disabled = true;
            rememberMe.disabled = true;
        } else {
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            
            // Enable form inputs
            emailInput.disabled = false;
            passwordInput.disabled = false;
            rememberMe.disabled = false;
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
        
        // Auto-hide success alerts after 3 seconds
        if (type === 'success') {
            setTimeout(hideAlert, 3000);
        }
        
        // Auto-hide warning alerts after 5 seconds
        if (type === 'warning') {
            setTimeout(hideAlert, 5000);
        }
    }

    function hideAlert() {
        const existingAlert = document.getElementById('currentAlert');
        if (existingAlert) {
            existingAlert.remove();
        }
    }

    // Handle browser back/forward buttons
    window.addEventListener('pageshow', function() {
        setLoadingState(false);
        hideAlert();
    });

    // Clear form validation messages on input
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    });

    // Handle forgot password click (placeholder)
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        showAlert('warning', 'Password reset functionality will be available soon. Please contact your system administrator.');
    });

    console.log('✅ Admin Login JavaScript initialized successfully');
});
