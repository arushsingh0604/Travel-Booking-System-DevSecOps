document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Admin Registration page loaded');

    // Get form elements
    const form = document.getElementById('adminRegisterForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerBtn = document.getElementById('registerBtn');
    const btnText = registerBtn.querySelector('.btn-text');
    const btnLoading = registerBtn.querySelector('.btn-loading');
    const alertContainer = document.getElementById('alertContainer');
    const passwordRequirements = document.getElementById('passwordRequirements');

    // Password validation elements
    const lengthRequirement = document.getElementById('length');
    const letterRequirement = document.getElementById('letter');
    const numberRequirement = document.getElementById('number');

    // Show/hide password requirements
    passwordInput.addEventListener('focus', function() {
        passwordRequirements.classList.add('show');
    });

    passwordInput.addEventListener('blur', function() {
        if (passwordInput.value === '') {
            passwordRequirements.classList.remove('show');
        }
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        
        // Check length
        if (password.length >= 6) {
            lengthRequirement.classList.remove('invalid');
            lengthRequirement.classList.add('valid');
        } else {
            lengthRequirement.classList.remove('valid');
            lengthRequirement.classList.add('invalid');
        }

        // Check for letter
        if (/[a-zA-Z]/.test(password)) {
            letterRequirement.classList.remove('invalid');
            letterRequirement.classList.add('valid');
        } else {
            letterRequirement.classList.remove('valid');
            letterRequirement.classList.add('invalid');
        }

        // Check for number
        if (/[0-9]/.test(password)) {
            numberRequirement.classList.remove('invalid');
            numberRequirement.classList.add('valid');
        } else {
            numberRequirement.classList.remove('valid');
            numberRequirement.classList.add('invalid');
        }

        // Validate confirm password if it has value
        if (confirmPasswordInput.value) {
            validatePasswordMatch();
        }
    });

    // Confirm password validation
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    function validatePasswordMatch() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
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

    // Name validation
    nameInput.addEventListener('input', function() {
        const name = this.value.trim();
        
        if (name.length < 2) {
            this.setCustomValidity('Name must be at least 2 characters long');
        } else if (name.length > 50) {
            this.setCustomValidity('Name cannot exceed 50 characters');
        } else {
            this.setCustomValidity('');
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 Admin registration form submitted');

        // Get form data
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim().toLowerCase(),
            password: passwordInput.value,
            confirmPassword: confirmPasswordInput.value
        };

        console.log('📄 Form data prepared:', {
            name: formData.name,
            email: formData.email,
            passwordLength: formData.password.length
        });

        // Client-side validation
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            console.log('🌐 Sending registration request...');
            
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            console.log('📡 Server response status:', response.status);

            const data = await response.json();
            console.log('📦 Server response data:', data);

            if (response.ok && data.success) {
                console.log('✅ Admin registration successful');
                showAlert('success', 'Admin account created successfully! Redirecting to login...');
                
                // Clear form
                form.reset();
                passwordRequirements.classList.remove('show');
                
                // Store success message for login page
                sessionStorage.setItem('adminRegisterSuccess', 'Account created successfully! Please sign in.');
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } else {
                console.log('❌ Admin registration failed:', data.message);
                showAlert('error', data.message || 'Registration failed. Please try again.');
            }

        } catch (error) {
            console.error('💥 Registration error:', error);
            showAlert('error', 'Network error. Please check your connection and try again.');
        } finally {
            setLoadingState(false);
        }
    });

    function validateForm(data) {
        console.log('🔍 Validating form data...');

        // Clear previous alerts
        hideAlert();

        // Name validation
        if (!data.name || data.name.length < 2) {
            showAlert('error', 'Name must be at least 2 characters long.');
            nameInput.focus();
            return false;
        }

        if (data.name.length > 50) {
            showAlert('error', 'Name cannot exceed 50 characters.');
            nameInput.focus();
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            showAlert('error', 'Please enter a valid email address.');
            emailInput.focus();
            return false;
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            showAlert('error', 'Password must be at least 6 characters long.');
            passwordInput.focus();
            return false;
        }

        if (!/[a-zA-Z]/.test(data.password)) {
            showAlert('error', 'Password must contain at least one letter.');
            passwordInput.focus();
            return false;
        }

        if (!/[0-9]/.test(data.password)) {
            showAlert('error', 'Password must contain at least one number.');
            passwordInput.focus();
            return false;
        }

        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            showAlert('error', 'Passwords do not match.');
            confirmPasswordInput.focus();
            return false;
        }

        console.log('✅ Form validation passed');
        return true;
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            registerBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        } else {
            registerBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
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
        
        // Auto-hide success/warning alerts after 5 seconds
        if (type === 'success' || type === 'warning') {
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
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('input', function() {
            this.setCustomValidity('');
        });
    });

    console.log('✅ Admin Registration JavaScript initialized successfully');
});
