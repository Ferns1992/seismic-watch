import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface EarthquakeFeature {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    tsunami: number
    title: string
  }
  geometry: {
    coordinates: [number, number, number]
  }
}

function isUnderwater(longitude: number, latitude: number): boolean {
  return latitude >= -60 && latitude <= 60 && Math.abs(longitude) < 180
}

async function fetchAndStoreEarthquakes(minMagnitude: string, timeRange: string, underwaterOnly: boolean) {
  let startTime: number
  const now = Date.now()
  
  switch (timeRange) {
    case 'hour': startTime = now - 3600000; break
    case 'week': startTime = now - 604800000; break
    case 'month': startTime = now - 2592000000; break
    default: startTime = now - 86400000
  }

  const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${new Date(startTime).toISOString()}&minmagnitude=${minMagnitude}&orderby=time`

  const response = await fetch(usgsUrl, { next: { revalidate: 600 } })
  if (!response.ok) throw new Error('Failed to fetch earthquake data')

  const data = await response.json()
  let features: EarthquakeFeature[] = data.features

  if (underwaterOnly) {
    features = features.filter((quake: EarthquakeFeature) => {
      const [longitude, latitude] = quake.geometry.coordinates
      return isUnderwater(longitude, latitude)
    })
  }

  const earthquakes = features.map((quake: EarthquakeFeature) => {
    const [longitude, latitude, depth] = quake.geometry.coordinates
    const { mag, place, time, tsunami, title } = quake.properties
    
    let depthCategory: string
    if (depth < 70) depthCategory = 'shallow'
    else if (depth < 300) depthCategory = 'intermediate'
    else depthCategory = 'deep'

    return {
      id: quake.id,
      magnitude: mag,
      location: place || title,
      longitude,
      latitude,
      depth,
      time: new Date(time),
      depthCategory,
      tsunamiWarning: tsunami > 0,
      isUnderwater: isUnderwater(longitude, latitude),
    }
  })

  // Store in database
  for (const quake of earthquakes) {
    await prisma.earthquake.upsert({
      where: { id: quake.id },
      update: {
        magnitude: quake.magnitude,
        location: quake.location,
        longitude: quake.longitude,
        latitude: quake.latitude,
        depth: quake.depth,
        time: quake.time,
        depthCategory: quake.depthCategory,
        tsunamiWarning: quake.tsunamiWarning,
        isUnderwater: quake.isUnderwater,
        lastUpdated: new Date(),
      },
      create: quake,
    })
  }

  // Delete old records (keep last 7 days)
  const cutoffDate = new Date(now - 7 * 86400000)
  await prisma.earthquake.deleteMany({
    where: { time: { lt: cutoffDate } }
  })

  return earthquakes
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const minMagnitude = searchParams.get('minMagnitude') || '2.5'
    const timeRange = searchParams.get('timeRange') || 'day'
    const underwaterOnly = searchParams.get('underwaterOnly') !== 'false'
    const refresh = searchParams.get('refresh') === 'true'

    // Check if we have recent data in DB
    const dbEarthquakes = await prisma.earthquake.findMany({
      where: {
        magnitude: { gte: parseFloat(minMagnitude) },
        ...(underwaterOnly && { isUnderwater: true }),
      },
      orderBy: { time: 'desc' },
      take: 200,
    })

    // If no data in DB or refresh requested, fetch fresh data
    if (dbEarthquakes.length === 0 || refresh) {
      await fetchAndStoreEarthquakes(minMagnitude, timeRange, underwaterOnly)
      
      const freshData = await prisma.earthquake.findMany({
        where: {
          magnitude: { gte: parseFloat(minMagnitude) },
          ...(underwaterOnly && { isUnderwater: true }),
        },
        orderBy: { time: 'desc' },
        take: 200,
      })

      return NextResponse.json({
        earthquakes: freshData.map(e => ({
          id: e.id,
          magnitude: e.magnitude,
          location: e.location,
          coordinates: { longitude: e.longitude, latitude: e.latitude, depth: e.depth },
          time: e.time.toISOString(),
          depthCategory: e.depthCategory,
          tsunamiWarning: e.tsunamiWarning,
          isUnderwater: e.isUnderwater,
        })),
        meta: { count: freshData.length, generated: new Date().toISOString() },
      })
    }

    return NextResponse.json({
      earthquakes: dbEarthquakes.map(e => ({
        id: e.id,
        magnitude: e.magnitude,
        location: e.location,
        coordinates: { longitude: e.longitude, latitude: e.latitude, depth: e.depth },
        time: e.time.toISOString(),
        depthCategory: e.depthCategory,
        tsunamiWarning: e.tsunamiWarning,
        isUnderwater: e.isUnderwater,
      })),
      meta: { count: dbEarthquakes.length, generated: new Date().toISOString() },
    })
  } catch (error) {
    console.error('Earthquake API error:', error)
    return NextResponse.json({ error: 'Failed to fetch earthquake data' }, { status: 500 })
  }
}
