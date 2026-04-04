# SeismicWatch

Underwater earthquake tracking web application with real-time 3D visualization.

## Features

- **3D Globe** - Interactive rotating globe with earthquake markers (Three.js)
- **2D Map** - Flat rectangular map view with drag and zoom
- **Real-time Data** - Live earthquake data from USGS API
- **Database Storage** - SQLite stores 7 days of earthquake history
- **Auto-refresh** - Updates every 10 minutes
- **Authentication** - User login/registration system
- **Admin Panel** - User management for enterprise users
- **Responsive** - Works on desktop and mobile

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Three.js (3D globe)
- Prisma + SQLite (database)
- NextAuth.js (authentication)

## Docker Deployment (Recommended)

Deploy to Docker on port **4080**:

```bash
docker-compose up -d
```

Or deploy via Portainer/Dockge using the GitHub repository:
- Repo: `https://github.com/Ferns1992/seismic-watch`
- Port: 4080

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up database:
```bash
npx prisma db push
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Default Admin Login

- Email: admin@seismicwatch.com
- Password: admin

## Environment Variables

The app works with default values - no env vars needed for basic setup.

## API

- `/api/earthquakes` - Get earthquake data
- `/api/earthquakes?refresh=true` - Force fresh data fetch from USGS

## License

MIT
