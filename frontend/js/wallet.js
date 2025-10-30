document.addEventListener('DOMContentLoaded', () => {
  const balanceElem = document.getElementById('balance');
  const addFundsForm = document.getElementById('addFundsForm');
  const addFundsSection = document.querySelector('.add-funds-section');
  const addFundsBtn = document.getElementById('addFundsBtn');
  const closeFundsForm = document.getElementById('closeFundsForm');
  const fundAmountInput = document.getElementById('fundAmount');
  const quickAmountBtns = document.querySelectorAll('.quick-amount');
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
  
  let user = JSON.parse(localStorage.getItem('travelEaseUser')) || { balance: 250.00 };
  let currentBalance = user.balance || 250.00;
  
  // Sample transactions data
  let transactions = JSON.parse(localStorage.getItem('walletTransactions')) || [
    {
      id: 1,
      type: 'deposit',
      title: 'Funds Added',
      date: 'Today, 2:30 PM',
      method: 'Credit Card',
      amount: 250.00,
      timestamp: Date.now() - 3600000
    },
    {
      id: 2,
      type: 'payment',
      title: 'Flight Booking Payment',
      date: 'Yesterday, 4:15 PM',
      method: 'Wallet Balance',
      amount: -340.00,
      timestamp: Date.now() - 86400000
    },
    {
      id: 3,
      type: 'payment',
      title: 'Hotel Booking Payment',
      date: '2 days ago, 11:20 AM',
      method: 'Wallet Balance',
      amount: -180.00,
      timestamp: Date.now() - 172800000
    }
  ];
  
  // Initialize wallet display
  updateBalanceDisplay();
  displayTransactions(transactions);
  
  // Add funds button click
  if (addFundsBtn) {
    addFundsBtn.addEventListener('click', () => {
      if (addFundsSection) {
        addFundsSection.style.display = 'block';
        if (fundAmountInput) fundAmountInput.focus();
      }
    });
  }
  
  // Close add funds form
  if (closeFundsForm) {
    closeFundsForm.addEventListener('click', () => {
      if (addFundsSection) {
        addFundsSection.style.display = 'none';
      }
    });
  }
  
  // Quick amount buttons
  quickAmountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const amount = btn.dataset.amount;
      if (fundAmountInput) {
        fundAmountInput.value = amount;
        // Remove selected class from all buttons
        quickAmountBtns.forEach(b => b.classList.remove('selected'));
        // Add selected class to clicked button
        btn.classList.add('selected');
      }
    });
  });
  
  // Clear quick amount selection when typing
  if (fundAmountInput) {
    fundAmountInput.addEventListener('input', () => {
      quickAmountBtns.forEach(btn => btn.classList.remove('selected'));
    });
  }
  
  // Add funds form submission
  if (addFundsForm) {
    addFundsForm.addEventListener('submit', e => {
      e.preventDefault();
      
      const amount = parseFloat(fundAmountInput.value);
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'card';
      
      if (amount <= 0 || isNaN(amount)) {
        alert('Please enter a valid amount.');
        return;
      }
      
      if (amount < 10) {
        alert('Minimum amount to add is $10.');
        return;
      }
      
      if (amount > 5000) {
        alert('Maximum amount to add is $5000.');
        return;
      }
      
      // Add transaction
      addTransaction({
        type: 'deposit',
        title: 'Funds Added',
        date: new Date().toLocaleString(),
        method: getPaymentMethodName(paymentMethod),
        amount: amount
      });
      
      // Update balance
      currentBalance += amount;
      user.balance = currentBalance;
      localStorage.setItem('travelEaseUser', JSON.stringify(user));
      
      updateBalanceDisplay();
      displayTransactions(transactions);
      
      // Show success message
      alert(`$${amount.toFixed(2)} added to your wallet successfully!\n\nPayment Method: ${getPaymentMethodName(paymentMethod)}\n\nNew Balance: $${currentBalance.toFixed(2)}`);
      
      // Reset form and hide
      addFundsForm.reset();
      quickAmountBtns.forEach(btn => btn.classList.remove('selected'));
      if (addFundsSection) {
        addFundsSection.style.display = 'none';
      }
    });
  }
  
  // Transaction filtering
  if (filterSelect) {
    filterSelect.addEventListener('change', () => {
      const filterType = filterSelect.value;
      let filteredTransactions = transactions;
      
      if (filterType !== 'all') {
        filteredTransactions = transactions.filter(t => {
          switch (filterType) {
            case 'deposits':
              return t.type === 'deposit';
            case 'payments':
              return t.type === 'payment';
            case 'refunds':
              return t.type === 'refund';
            default:
              return true;
          }
        });
      }
      
      displayTransactions(filteredTransactions);
    });
  }
  
  function updateBalanceDisplay() {
    if (balanceElem) {
      balanceElem.textContent = `$${currentBalance.toFixed(2)}`;
    }
  }
  
  function getPaymentMethodName(method) {
    const methods = {
      card: 'Credit/Debit Card',
      bank: 'Bank Transfer',
      paypal: 'PayPal'
    };
    return methods[method] || 'Credit Card';
  }
  
  function addTransaction(transactionData) {
    const newTransaction = {
      id: Date.now(),
      timestamp: Date.now(),
      ...transactionData
    };
    
    transactions.unshift(newTransaction);
    localStorage.setItem('walletTransactions', JSON.stringify(transactions));
  }
  
  function displayTransactions(transactionsToShow) {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    // Keep existing sample transactions and add new ones
    let html = '';
    
    transactionsToShow.forEach(transaction => {
      const iconClass = getTransactionIcon(transaction.type);
      const amountClass = transaction.amount > 0 ? 'positive' : 'negative';
      const amountPrefix = transaction.amount > 0 ? '+' : '';
      
      html += `
        <div class="transaction-item">
          <div class="transaction-icon ${transaction.type}">
            <i class="fas ${iconClass}"></i>
          </div>
          <div class="transaction-details">
            <h4>${transaction.title}</h4>
            <p class="transaction-date">${transaction.date}</p>
            <span class="transaction-method">${transaction.method}</span>
          </div>
          <div class="transaction-amount ${amountClass}">${amountPrefix}$${Math.abs(transaction.amount).toFixed(2)}</div>
        </div>
      `;
    });
    
    transactionsList.innerHTML = html;
  }
  
  function getTransactionIcon(type) {
    const icons = {
      deposit: 'fa-arrow-up',
      payment: 'fa-plane-departure',
      refund: 'fa-undo'
    };
    return icons[type] || 'fa-exchange-alt';
  }
  
  // Handle mobile header add funds button
  const mobileAddFundsBtn = document.querySelector('.header-actions-mobile .btn');
  if (mobileAddFundsBtn) {
    mobileAddFundsBtn.addEventListener('click', () => {
      if (addFundsSection) {
        addFundsSection.style.display = 'block';
        if (fundAmountInput) fundAmountInput.focus();
      }
    });
  }
  
  // Close modal when clicking outside
  document.addEventListener('click', (e) => {
    if (addFundsSection && addFundsSection.style.display === 'block') {
      if (!addFundsSection.contains(e.target) && 
          e.target !== addFundsBtn && 
          e.target !== mobileAddFundsBtn &&
          !e.target.closest('.btn')) {
        addFundsSection.style.display = 'none';
      }
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
});
