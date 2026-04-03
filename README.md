# SeismicWatch

Underwater earthquake tracking web application with real-time 3D visualization.

## Features

- **3D Globe** - Interactive rotating globe with earthquake markers (Three.js)
- **2D Map** - Flat map view with drag and zoom
- **Real-time Data** - Live earthquake data from USGS API
- **Authentication** - User login/registration system
- **Admin Panel** - User management for enterprise users
- **Responsive** - Works on desktop and mobile

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Three.js (3D globe)
- Prisma + SQLite (database)
- NextAuth.js (authentication)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up database:
```bash
npx prisma migrate dev
npx tsx seed-admin.ts
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Default Admin Login

- Email: admin@seismicwatch.com
- Password: admin123

## Environment Variables

Create a `.env` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## License

MIT