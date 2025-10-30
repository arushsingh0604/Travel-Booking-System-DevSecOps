document.addEventListener('DOMContentLoaded', () => {
  const reg = document.getElementById('registerForm');
  const log = document.getElementById('loginForm');

  // Password toggle functionality
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentNode.querySelector('input');
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // Password strength checker
  const passwordInput = document.getElementById('regPass');
  if (passwordInput) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    passwordInput.addEventListener('input', (e) => {
      const password = e.target.value;
      const strength = calculatePasswordStrength(password);
      
      strengthFill.className = `strength-fill ${strength.class}`;
      strengthText.textContent = strength.text;
    });
  }

  function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { class: 'weak', text: 'Weak password' };
    if (score === 3) return { class: 'fair', text: 'Fair password' };
    if (score === 4) return { class: 'good', text: 'Good password' };
    return { class: 'strong', text: 'Strong password' };
  }

  // Social login buttons (for demo)
  const socialBtns = document.querySelectorAll('.btn-social');
  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const provider = btn.classList.contains('btn-google') ? 'Google' : 'Facebook';
      alert(`${provider} login is not implemented in this demo. Please use the form above.`);
    });
  });

  // Form submission with enhanced UX
  if (reg) {
    reg.addEventListener('submit', async e => {
      e.preventDefault();
      
      const submitBtn = reg.querySelector('.auth-submit');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      
      try {
        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPass').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        if (!agreeTerms) {
          throw new Error('Please agree to the Terms of Service and Privacy Policy');
        }
        
        const user = { name, email, password: pass, balance: 0, avatar: null };
        let registrationSuccessful = false;
        
        // Store user data for both backend and local storage
        const newUser = {
          username: name,
          email: email,
          password: pass, // Store for local auth
          avatar: '../assets/images/img1.png',
          balance: 0
        };

        try {
          // Try backend registration first
          const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
          });
          
          const data = await res.json();
          
          if (res.ok) {
            registrationSuccessful = true;
          } else {
            throw new Error(data.message || 'Backend registration failed');
          }
        } catch (backendError) {
          console.log('Backend not available, using local storage...');
          
          // Check if user already exists locally
          const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
          const existingUser = users.find(u => u.email === email);
          
          if (existingUser) {
            throw new Error('User already exists with this email!');
          }
          
          // Register locally
          registrationSuccessful = true;
        }
        
        if (registrationSuccessful) {
          // Success animation
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
          submitBtn.style.background = 'var(--success)';
          
          // Store user data locally
          const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
          users.push(newUser);
          localStorage.setItem('registeredUsers', JSON.stringify(users));
          
          setTimeout(() => {
            showNotification('Registration successful! Please login.', 'success');
            location.href = 'login.html';
          }, 1500);
        } else {
          throw new Error('Registration failed!');
        }
      } catch (error) {
        // Error state
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
        submitBtn.style.background = 'var(--danger)';
        showNotification(error.message, 'error');
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 2000);
      }
    });
  }

  if (log) {
    log.addEventListener('submit', async e => {
      e.preventDefault();
      
      const submitBtn = log.querySelector('.auth-submit');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
      
      try {
        const email = document.getElementById('logEmail').value.trim();
        const pass = document.getElementById('logPass').value;
        
        let userData = null;
        let loginSuccessful = false;

        try {
          // Try backend authentication first
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: pass })
          });
          
          const data = await res.json();
          
          if (res.ok) {
            userData = {
              username: data.name || data.username || email.split('@')[0],
              email: email,
              avatar: data.avatar || '../assets/images/img1.png',
              balance: data.balance || 0
            };
            loginSuccessful = true;
          }
        } catch (backendError) {
          console.log('Backend not available, trying local authentication...');
          
          // Fallback to local authentication
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
          const existingUser = registeredUsers.find(user => user.email === email);
          
          if (existingUser) {
            userData = existingUser;
            loginSuccessful = true;
          } else {
            // If no registered user found, create a demo user for this email
            userData = {
              username: email.split('@')[0], // Use part before @ as username
              email: email,
              avatar: '../assets/images/img1.png',
              balance: 250.00
            };
            loginSuccessful = true;
            
            // Save this demo user for future logins
            registeredUsers.push(userData);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          }
        }
        
        if (loginSuccessful && userData) {
          // Success animation
          submitBtn.innerHTML = '<i class="fas fa-check"></i> Welcome Back!';
          submitBtn.style.background = 'var(--success)';
          
          // Store all necessary user data
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUserEmail', email);
          localStorage.setItem('travelEaseUser', JSON.stringify(userData));
          
          setTimeout(() => {
            location.href = '../dashboard.html';
          }, 1500);
        } else {
          throw new Error('Invalid credentials!');
        }
      } catch (error) {
        // Error state
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Try Again';
        submitBtn.style.background = 'var(--danger)';
        showNotification(error.message, 'error');
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 2000);
      }
    });
  }

  // Enhanced notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => removeNotification(notification), 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      removeNotification(notification);
    });
  }
  
  function getNotificationIcon(type) {
    switch(type) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  }
  
  function removeNotification(notification) {
    notification.classList.add('hide');
    setTimeout(() => notification.remove(), 300);
  }
});

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  .notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--border-light);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    max-width: 500px;
    z-index: 10000;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s ease;
  }
  
  .notification.show {
    transform: translateX(0);
    opacity: 1;
  }
  
  .notification.hide {
    transform: translateX(400px);
    opacity: 0;
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
  }
  
  .notification-success {
    border-left: 4px solid var(--success);
  }
  
  .notification-success .notification-content i {
    color: var(--success);
  }
  
  .notification-error {
    border-left: 4px solid var(--danger);
  }
  
  .notification-error .notification-content i {
    color: var(--danger);
  }
  
  .notification-close {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: var(--radius-sm);
    transition: all 0.2s ease;
  }
  
  .notification-close:hover {
    background: var(--gray-100);
    color: var(--text-primary);
  }
`;
document.head.appendChild(notificationStyles);
