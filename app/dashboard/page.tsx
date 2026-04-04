'use client'

import { useState, useEffect, useCallback } from 'react'
import Globe from '@/components/Globe'
import styles from './page.module.css'

interface Earthquake {
  id: string
  magnitude: number
  location: string
  coordinates: {
    longitude: number
    latitude: number
    depth: number
  }
  time: string
  depthCategory: 'shallow' | 'intermediate' | 'deep'
  tsunamiWarning: boolean
  isUnderwater: boolean
}

export default function DashboardPage() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([])
  const [selectedQuake, setSelectedQuake] = useState<Earthquake | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filters, setFilters] = useState({
    minMagnitude: '2.5',
    timeRange: 'day',
    underwaterOnly: true,
  })

  const fetchEarthquakes = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        minMagnitude: filters.minMagnitude,
        timeRange: filters.timeRange,
        underwaterOnly: filters.underwaterOnly.toString(),
      })
      const res = await fetch(`/api/earthquakes?${params}`)
      const data = await res.json()
      setEarthquakes(data.earthquakes || [])
    } catch (error) {
      console.error('Failed to fetch earthquakes:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEarthquakes()
    const interval = setInterval(fetchEarthquakes, 600000) // 10 minutes
    return () => clearInterval(interval)
  }, [fetchEarthquakes])

  const getMagnitudeColor = (mag: number) => {
    if (mag >= 6) return '#f43f5e'
    if (mag >= 4.5) return '#f59e0b'
    if (mag >= 2.5) return '#0ea5e9'
    return '#10b981'
  }

  const getDepthColor = (depth: number) => {
    if (depth < 70) return '#f43f5e'
    if (depth < 300) return '#f59e0b'
    return '#0ea5e9'
  }

  const formatTimeAgo = (time: string) => {
    const diff = Date.now() - new Date(time).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const stats = {
    total: earthquakes.length,
    largest: earthquakes.length > 0 ? Math.max(...earthquakes.map(e => e.magnitude)).toFixed(1) : '0',
    tsunami: earthquakes.filter(e => e.tsunamiWarning).length,
    underwater: earthquakes.filter(e => e.isUnderwater).length,
  }

  return (
    <div className={styles.dashboard}>
      <aside className={`${styles.sidebar} ${!sidebarOpen ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2>Filters</h2>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Magnitude</label>
          <select 
            value={filters.minMagnitude}
            onChange={(e) => setFilters({ ...filters, minMagnitude: e.target.value })}
          >
            <option value="0">All</option>
            <option value="2.5">2.5+</option>
            <option value="4.5">4.5+</option>
            <option value="6.0">6.0+</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>Time</label>
          <select 
            value={filters.timeRange}
            onChange={(e) => setFilters({ ...filters, timeRange: e.target.value })}
          >
            <option value="hour">Past Hour</option>
            <option value="day">Past 24 Hours</option>
            <option value="week">Past 7 Days</option>
            <option value="month">Past 30 Days</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.checkbox}>
            <input 
              type="checkbox"
              checked={filters.underwaterOnly}
              onChange={(e) => setFilters({ ...filters, underwaterOnly: e.target.checked })}
            />
            <span>Underwater Only</span>
          </label>
        </div>
        
        <div className={styles.stats}>
          <h3>Activity</h3>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Largest</span>
            <span className={styles.statValue}>M{stats.largest}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Tsunami</span>
            <span className={`${styles.statValue} ${stats.tsunami > 0 ? styles.warning : ''}`}>
              {stats.tsunami}
            </span>
          </div>
        </div>
        
        <div className={styles.quakeList}>
          <h3>Recent Quakes ({earthquakes.length})</h3>
          {loading ? (
            <div className={styles.loading}>Loading...</div>
          ) : earthquakes.slice(0, 20).map((quake) => (
            <div 
              key={quake.id} 
              className={`${styles.quakeCard} ${selectedQuake?.id === quake.id ? styles.selected : ''}`}
              onClick={() => setSelectedQuake(quake)}
            >
              <div className={styles.quakeHeader}>
                <span 
                  className={styles.magnitude}
                  style={{ background: getMagnitudeColor(quake.magnitude) }}
                >
                  {quake.magnitude.toFixed(1)}
                </span>
                <span className={styles.timeAgo}>{formatTimeAgo(quake.time)}</span>
              </div>
              <p className={styles.quakeLocation}>{quake.location}</p>
              <div className={styles.quakeMeta}>
                <span>{quake.coordinates.depth.toFixed(0)}km</span>
                {quake.tsunamiWarning && (
                  <span className={styles.tsunamiBadge}>TSUNAMI</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
      
      <button 
        className={styles.sidebarToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ left: sidebarOpen ? '320px' : '50px' }}
      >
        {sidebarOpen ? '◀' : '▶'}
      </button>
      
      <main className={styles.main}>
        <div className={styles.mapContainer}>
          <Globe 
            earthquakes={earthquakes.map(e => ({
              id: e.id,
              magnitude: e.magnitude,
              coordinates: {
                longitude: e.coordinates.longitude,
                latitude: e.coordinates.latitude,
              }
            }))}
            onMarkerClick={(id) => {
              const quake = earthquakes.find(q => q.id === id)
              if (quake) setSelectedQuake(quake)
            }}
          />
          
          {selectedQuake && (
            <div className={styles.quakeDetail}>
              <button className={styles.closeBtn} onClick={() => setSelectedQuake(null)}>
                &times;
              </button>
              <h3>Earthquake Details</h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <label>Magnitude</label>
                  <span style={{ color: getMagnitudeColor(selectedQuake.magnitude) }}>
                    {selectedQuake.magnitude.toFixed(1)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Depth</label>
                  <span>{selectedQuake.coordinates.depth.toFixed(0)} km</span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                  <label>Location</label>
                  <span>{selectedQuake.location}</span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: '1 / -1' }}>
                  <label>Coordinates</label>
                  <span>
                    {selectedQuake.coordinates.latitude.toFixed(4)}, {selectedQuake.coordinates.longitude.toFixed(4)}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Type</label>
                  <span style={{ color: getDepthColor(selectedQuake.coordinates.depth) }}>
                    {selectedQuake.depthCategory}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <label>Time</label>
                  <span>{new Date(selectedQuake.time).toLocaleTimeString()}</span>
                </div>
              </div>
              {selectedQuake.tsunamiWarning && (
                <div className={styles.tsunamiWarning}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  Tsunami Warning
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
