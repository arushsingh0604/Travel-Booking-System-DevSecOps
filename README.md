# TravelEase - Travel Booking Platform

## Project Structure

```
TravelEase/
├── index.html                 # Landing page (main entry point) hggjh
├── server.js                  # Backend server
├── package-lock.json          # NPM dependencies lock file
├── README.md                  # Project documentation
│
├── assets/                    # Static assets
│   └── images/               # Image files
│       ├── hero.avif
│       ├── flight-splash.webp
│       ├── hotel-splash.avif
│       ├── img1.png
│       ├── img2.webp
│       ├── img3.webp
│       ├── img4.jpg
│       └── Yash.jpg
│
├── src/                      # Source code hii
│   ├── css/                  # Stylesheets
│   │   ├── base.css         # Base styles
│   │   ├── landing.css      # Landing page styles
│   │   ├── auth.css         # Authentication pages styles
│   │   ├── dashboard.css    # Dashboard styles
│   │   ├── flights.css      # Flights page styles
│   │   ├── hotels.css       # Hotels page styles
│   │   ├── packages.css     # Packages page styles
│   │   ├── offers.css       # Offers page styles
│   │   ├── profile.css      # Profile page styles
│   │   └── wallet.css       # Wallet page styles
│   │
│   └── js/                   # JavaScript files
│       ├── auth.js          # Authentication logic
│       ├── dashboard.js     # Dashboard functionality
│       ├── flights.js       # Flights search and booking
│       ├── hotels.js        # Hotels search and booking
│       ├── packages.js      # Packages functionality
│       ├── offers.js        # Offers functionality
│       ├── profile.js       # Profile management
│       ├── wallet.js        # Wallet functionality
│       └── sidebar.js       # Sidebar navigation
│
├── auth-pages/               # Authentication pages
│   ├── login.html           # User login page
│   └── register.html        # User registration page
│
├── dashboard-pages/          # Dashboard and user pages
│   ├── dashboard.html       # Main dashboard (after login)
│   ├── flights.html         # Flight search and booking
│   ├── hotels.html          # Hotel search and booking
│   ├── packages.html        # Travel packages
│   ├── offers.html          # Special offers
│   ├── profile.html         # User profile management
│   └── wallet.html          # User wallet/payments
│
└── public/                   # Public assets (future use)
```

## Page Flow

1. **Landing Page** (`index.html`)
   - Main entry point for visitors
   - Contains navigation to login/register pages
   - Located in root directory

2. **Authentication** (`auth-pages/`)
   - `login.html` - User login
   - `register.html` - New user registration
   - Both redirect to dashboard after successful authentication

3. **Dashboard** (`dashboard-pages/`)
   - `dashboard.html` - Main dashboard after login (formerly index.html in dashboard folder)
   - All other pages for logged-in users
   - Consistent navigation sidebar across all pages

## Key Changes Made

1. **Fixed Asset Path**: Changed `assests/` to `assets/` (corrected spelling)
2. **Organized Structure**: 
   - CSS files moved to `src/css/`
   - JavaScript files moved to `src/js/`
   - Images moved to `assets/images/`
3. **Renamed Main Dashboard**: `dashboard/index.html` → `dashboard-pages/dashboard.html`
4. **Updated All References**: All file paths updated to reflect new structure
5. **Consistent Navigation**: All dashboard navigation now points to `dashboard.html` instead of `index.html`

## Running the Application

1. Start the server: `node server.js`
2. Open browser and navigate to the landing page
3. Use the navigation to login/register
4. Access dashboard features after authentication

## File Naming Convention

- **Landing page**: `index.html` (root)
- **Dashboard main**: `dashboard.html` 
- **Feature pages**: Descriptive names (flights.html, hotels.html, etc.)
- **Folders**: Kebab-case with descriptive names
- **Assets**: Organized by type in dedicated folders
