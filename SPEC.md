# SeismicWatch - Underwater Earthquake Tracking System

## Project Overview

**Project Name:** SeismicWatch
**Type:** Full-stack Web Application
**Core Functionality:** Real-time underwater earthquake tracking with interactive 3D globe visualization, user authentication, and subscription system
**Target Users:** Researchers, emergency responders, maritime industries, insurance companies, and general public interested in seismic activity

---

## Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** SQLite with Prisma ORM (for simplicity)
- **Authentication:** NextAuth.js with credentials provider
- **3D Globe:** Google Maps JavaScript API with 3D globe enabled
- **Earthquake Data:** USGS Earthquake API (real-time)
- **Styling:** CSS Modules + Custom CSS
- **State Management:** React Context + useState

---

## UI/UX Specification

### Color Palette

| Role | Color | Hex Code |
|------|-------|----------|
| Background (Dark) | Deep Ocean | `#0a0e17` |
| Surface | Navy Blue | `#111827` |
| Surface Elevated | Dark Slate | `#1e293b` |
| Primary | Electric Cyan | `#06b6d4` |
| Secondary | Coral Red | `#f43f5e` |
| Accent | Amber Warning | `#f59e0b` |
| Success | Emerald | `#10b981` |
| Text Primary | White | `#f8fafc` |
| Text Secondary | Slate Gray | `#94a3b8` |
| Ocean Blue | Deep Sea | `#0ea5e9` |

### Typography

- **Headings:** "Orbitron", sans-serif (futuristic tech feel)
- **Body:** "Inter", sans-serif
- **Monospace (data):** "JetBrains Mono", monospace

### Font Sizes
- H1: 2.5rem (40px)
- H2: 2rem (32px)
- H3: 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- Caption: 0.75rem (12px)

### Spacing System
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Page Structure

### 1. Landing Page (/)
- Hero section with animated 3D globe preview
- Feature highlights
- Pricing cards
- Call-to-action buttons
- Footer with links

### 2. Authentication Pages
- **/login** - Login form
- **/register** - User registration form
- Clean, centered card design
- Form validation with error messages

### 3. Dashboard (/dashboard)
- Full-screen 3D globe (80% height)
- Sidebar with earthquake filters
- Real-time earthquake markers
- Stats panel showing recent activity
- Underwater filter toggle

### 4. User Account (/account)
- Profile information
- Subscription status
- API key management
- Usage statistics

---

## Components Specification

### 1. Navbar
- Logo (SeismicWatch with wave icon)
- Navigation links: Dashboard, Pricing, About
- Auth buttons: Login/Register or User dropdown
- Sticky position on scroll
- Glassmorphism effect

### 2. 3D Globe Component
- Google Maps with 3D globe projection
- Earthquake markers with depth-based colors:
  - Shallow (0-70km): Red `#f43f5e`
  - Intermediate (70-300km): Orange `#f59e0b`
  - Deep (300-700km): Blue `#0ea5e9`
- Marker size based on magnitude
- Click marker to see earthquake details
- Real-time data refresh every 5 minutes
- Filter by magnitude, depth, time range
- "Underwater only" toggle

### 3. Earthquake Card (Sidebar)
- Magnitude (large, bold)
- Location name
- Depth
- Time ago
- Tsunami warning indicator
- Click to focus on globe

### 4. Stats Panel
- Total earthquakes (24h)
- Largest recent quake
- Tsunami warnings active
- Underwater quakes count

### 5. Authentication Forms
- Email input with validation
- Password input with show/hide toggle
- Confirm password (register only)
- Name input (register only)
- Submit button with loading state
- Error message display
- Link to alternate form (login/register)

### 6. Pricing Cards
- Free Tier: Basic features, limited API
- Pro Tier: Full access, real-time data, $29/month
- Enterprise: Custom solutions, contact sales

---

## Functionality Specification

### Authentication System
- User registration with email/password
- Login with credentials
- Session management with JWT
- Password hashing with bcrypt
- Form validation:
  - Email: valid format required
  - Password: minimum 8 characters
  - Name: minimum 2 characters

### Earthquake Data Integration
- Fetch from USGS GeoJSON feed
- Filter parameters:
  - Time: Past hour, day, week, month
  - Magnitude: All, 2.5+, 4.5+, 6.0+
  - Location: Global, specific regions
- Data processing:
  - Parse earthquake properties
  - Calculate depth categories
  - Determine tsunami risk

### 3D Globe Features
- Smooth rotation and zoom
- Earthquake cluster markers at low zoom
- Individual markers at high zoom
- Info windows with earthquake details
- Real-time marker updates
- Underwater earthquake filtering (oceans only)

### User Dashboard
- Personalized earthquake filters (saved to user)
- Recent activity history
- Favorite locations

---

## Data Models

### User
```
id: String (UUID)
email: String (unique)
password: String (hashed)
name: String
subscription: Enum (FREE, PRO, ENTERPRISE)
createdAt: DateTime
updatedAt: DateTime
```

### UserPreferences
```
id: String (UUID)
userId: String (foreign key)
minMagnitude: Float
maxDepth: Float
underwaterOnly: Boolean
favoriteRegions: String[]
```

---

## API Endpoints

### Authentication
- POST /api/auth/register - Create new user
- POST /api/auth/login - Authenticate user
- GET /api/auth/session - Get current session

### Earthquakes
- GET /api/earthquakes - Fetch earthquake data with filters

### User
- GET /api/user/profile - Get user profile
- PUT /api/user/preferences - Update user preferences

---

## Acceptance Criteria

1. **Landing Page**
   - [x] Globe animation loads without errors
   - [x] All navigation links work
   - [x] Pricing cards display correctly
   - [x] Responsive on all devices

2. **Authentication**
   - [x] Users can register with valid email/password
   - [x] Users can login with credentials
   - [x] Invalid inputs show error messages
   - [x] Redirect to dashboard after login

3. **Dashboard**
   - [x] 3D globe renders correctly
   - [x] Earthquake data loads from USGS
   - [x] Markers display on globe
   - [x] Clicking markers shows info
   - [x] Filters work correctly
   - [x] Underwater filter shows ocean quakes only

4. **General**
   - [x] No console errors
   - [x] Pages load under 3 seconds
   - [x] Mobile responsive design

---

## File Structure

```
/app
  /page.tsx (landing)
  /layout.tsx
  /login/page.tsx
  /register/page.tsx
  /dashboard/page.tsx
  /account/page.tsx
  /api
    /auth/[...nextauth]/route.ts
    /earthquakes/route.ts
    /user/route.ts
/components
  /Navbar.tsx
  /Globe.tsx
  /EarthquakeCard.tsx
  /StatsPanel.tsx
  /AuthForm.tsx
  /PricingCard.tsx
  /Footer.tsx
/lib
  /prisma.ts
  /auth.ts
  /earthquakes.ts
/prisma
  /schema.prisma
/styles
  /globals.css
```

---

## Environment Variables

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```
