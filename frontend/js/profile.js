document.addEventListener('DOMContentLoaded', () => {
  let userData = JSON.parse(localStorage.getItem('travelEaseUser')) || {
    username: 'Yash Mittal',
    email: 'yash.mittal@example.com',
    avatar: '../assets/images/Yash.jpg'
  };

  // Settings tabs functionality
  const settingsTabs = document.querySelectorAll('.settings-tab');
  const settingsContents = document.querySelectorAll('.settings-content');
  
  // Profile form elements
  const editProfileBtn = document.getElementById('editProfileBtn');
  const profileForm = document.getElementById('profileForm');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const editAvatarBtn = document.getElementById('editAvatarBtn');
  const avatarInput = document.getElementById('avatarInput');
  
  // Display elements
  const displayName = document.getElementById('displayName');
  const displayEmail = document.getElementById('displayEmail');
  const profileAvatar = document.getElementById('profileAvatar');
  
  // Form inputs
  const usernameInput = document.getElementById('profileUsername');
  const emailInput = document.getElementById('profileEmail');
  const phoneInput = document.getElementById('profilePhone');
  const dobInput = document.getElementById('profileDob');
  const addressInput = document.getElementById('profileAddress');
  
  // Initialize profile display
  loadProfileData();
  
  // Settings tabs navigation
  settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Remove active class from all tabs
      settingsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Hide all content sections
      settingsContents.forEach(content => {
        content.style.display = 'none';
      });
      
      // Show target content
      const targetContent = document.getElementById(targetTab + '-tab');
      if (targetContent) {
        targetContent.style.display = 'block';
      }
    });
  });
  
  // Edit profile button
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      toggleProfileEditMode(true);
    });
  }
  
  // Cancel profile edit
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', () => {
      toggleProfileEditMode(false);
      loadProfileData(); // Reset form data
    });
  }
  
  // Avatar edit button
  if (editAvatarBtn) {
    editAvatarBtn.addEventListener('click', () => {
      avatarInput.click();
    });
  }
  
  // Avatar upload handler
  if (avatarInput) {
    avatarInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be less than 5MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        if (profileAvatar) {
          profileAvatar.src = evt.target.result;
        }
      };
      reader.readAsDataURL(file);
    });
  }
  
  // Profile form submission
  if (profileForm) {
    profileForm.addEventListener('submit', e => {
      e.preventDefault();
      
      // Validate form
      if (!usernameInput.value.trim() || !emailInput.value.trim()) {
        alert('Please fill in all required fields.');
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        alert('Please enter a valid email address.');
        return;
      }
      
      // Update user data
      userData = {
        ...userData,
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dateOfBirth: dobInput.value,
        address: addressInput.value.trim(),
        avatar: profileAvatar.src
      };
      
      // Save to localStorage
      localStorage.setItem('travelEaseUser', JSON.stringify(userData));
      
      // Update display
      loadProfileData();
      toggleProfileEditMode(false);
      
      // Update header and sidebar user info
      updateUserDisplays();
      
      // Trigger profile update event for other pages to detect changes
      triggerProfileUpdateEvent();
      
      alert('Profile updated successfully!');
    });
  }
  
  // Security actions
  const securityButtons = document.querySelectorAll('.security-card .btn');
  securityButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.target.textContent.trim();
      
      if (action.includes('Update Password')) {
        handlePasswordUpdate();
      } else if (action.includes('Enable 2FA')) {
        handleTwoFactorAuth();
      } else if (action.includes('View Activity')) {
        handleLoginHistory();
      }
    });
  });
  
  // Notification toggles
  const notificationToggles = document.querySelectorAll('.toggle-option input[type="checkbox"]');
  notificationToggles.forEach(toggle => {
    toggle.addEventListener('change', () => {
      const setting = toggle.parentElement.querySelector('.toggle-label').textContent;
      saveNotificationSetting(setting, toggle.checked);
    });
  });
  
  // Preference selects
  const preferenceSelects = document.querySelectorAll('.form-select');
  preferenceSelects.forEach(select => {
    select.addEventListener('change', () => {
      const preference = select.parentElement.querySelector('h3').textContent;
      savePreference(preference, select.value);
    });
  });
  
  function loadProfileData() {
    if (displayName) displayName.textContent = userData.username || 'User';
    if (displayEmail) displayEmail.textContent = userData.email || '';
    if (profileAvatar) profileAvatar.src = userData.avatar || '../assets/images/img1.png';
    
    if (usernameInput) usernameInput.value = userData.username || '';
    if (emailInput) emailInput.value = userData.email || '';
    if (phoneInput) phoneInput.value = userData.phone || '';
    if (dobInput) dobInput.value = userData.dateOfBirth || '';
    if (addressInput) addressInput.value = userData.address || '';
  }
  
  function toggleProfileEditMode(editMode) {
    if (profileForm) {
      profileForm.style.display = editMode ? 'block' : 'none';
    }
    
    if (editProfileBtn) {
      editProfileBtn.style.display = editMode ? 'none' : 'inline-flex';
    }
  }
  
  function updateUserDisplays() {
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
  
  function handlePasswordUpdate() {
    const currentPassword = prompt('Enter your current password:');
    if (!currentPassword) return;
    
    const newPassword = prompt('Enter your new password:');
    if (!newPassword) return;
    
    const confirmPassword = prompt('Confirm your new password:');
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }
    
    // In a real app, this would make an API call
    userData.password = newPassword;
    localStorage.setItem('travelEaseUser', JSON.stringify(userData));
    alert('Password updated successfully!');
  }
  
  function handleTwoFactorAuth() {
    const phone = prompt('Enter your phone number for 2FA setup:');
    if (!phone) return;
    
    // In a real app, this would send a verification code
    const code = prompt('Enter the verification code sent to your phone:');
    if (!code) return;
    
    userData.twoFactorEnabled = true;
    userData.twoFactorPhone = phone;
    localStorage.setItem('travelEaseUser', JSON.stringify(userData));
    alert('Two-factor authentication enabled successfully!');
  }
  
  function handleLoginHistory() {
    const loginHistory = [
      'Today, 9:30 AM - Current session',
      'Yesterday, 6:45 PM - Chrome on Windows',
      '2 days ago, 2:15 PM - Safari on iPhone',
      '3 days ago, 8:20 AM - Chrome on Windows'
    ];
    
    alert('Recent Login Activity:\n\n' + loginHistory.join('\n'));
  }
  
  function saveNotificationSetting(setting, enabled) {
    const notifications = JSON.parse(localStorage.getItem('notificationSettings')) || {};
    notifications[setting] = enabled;
    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
  }
  
  function savePreference(preference, value) {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    preferences[preference] = value;
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Show confirmation
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--primary);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      font-weight: 500;
    `;
    toast.textContent = `${preference} updated to ${value}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  }
  
  // Load saved preferences on page load
  function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    
    preferenceSelects.forEach(select => {
      const preference = select.parentElement.querySelector('h3').textContent;
      if (preferences[preference]) {
        select.value = preferences[preference];
      }
    });
  }
  
  // Load saved notification settings
  function loadNotificationSettings() {
    const notifications = JSON.parse(localStorage.getItem('notificationSettings')) || {};
    
    notificationToggles.forEach(toggle => {
      const setting = toggle.parentElement.querySelector('.toggle-label').textContent;
      if (notifications.hasOwnProperty(setting)) {
        toggle.checked = notifications[setting];
      }
    });
  }
  
  // Initialize preferences and notification settings
  loadPreferences();
  loadNotificationSettings();
  
  function triggerProfileUpdateEvent() {
    // Trigger a custom event to notify other scripts
    const event = new CustomEvent('profileUpdated', {
      detail: {
        userData: userData
      }
    });
    window.dispatchEvent(event);
    
    // Also trigger a storage event manually for same-page detection
    if (typeof window.StorageEvent === 'function') {
      const storageEvent = new StorageEvent('storage', {
        key: 'travelEaseUser',
        newValue: JSON.stringify(userData),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
    }
  }
});
