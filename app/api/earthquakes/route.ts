import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const minMagnitude = searchParams.get('minMagnitude') || '2.5'
    const timeRange = searchParams.get('timeRange') || 'day'
    const underwaterOnly = searchParams.get('underwaterOnly') !== 'false'

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
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`)
    }

    const data = await response.json()
    let features: EarthquakeFeature[] = data.features || []

    if (underwaterOnly) {
      features = features.filter((quake: EarthquakeFeature) => {
        const [longitude, latitude] = quake.geometry.coordinates
        return isUnderwater(longitude, latitude)
      })
    }

    const earthquakes = features.map((quake: EarthquakeFeature) => {
      const [longitude, latitude, depth] = quake.geometry.coordinates
      const { mag, place, time, tsunami, title } = quake.properties
      
      let depthCategory: 'shallow' | 'intermediate' | 'deep'
      if (depth < 70) depthCategory = 'shallow'
      else if (depth < 300) depthCategory = 'intermediate'
      else depthCategory = 'deep'

      return {
        id: quake.id,
        magnitude: mag,
        location: place || title,
        coordinates: { longitude, latitude, depth },
        time: new Date(time).toISOString(),
        depthCategory,
        tsunamiWarning: tsunami > 0,
        isUnderwater: isUnderwater(longitude, latitude),
      }
    })

    // Try to store in DB (optional - don't fail if it doesn't work)
    try {
      const { PrismaClient } = await import('@prisma/client')
      const prisma = new PrismaClient()
      
      for (const quake of earthquakes) {
        await prisma.earthquake.upsert({
          where: { id: quake.id },
          update: {},
          create: {
            id: quake.id,
            magnitude: quake.magnitude,
            location: quake.location,
            longitude: quake.coordinates.longitude,
            latitude: quake.coordinates.latitude,
            depth: quake.coordinates.depth,
            time: new Date(quake.time),
            depthCategory: quake.depthCategory,
            tsunamiWarning: quake.tsunamiWarning,
            isUnderwater: quake.isUnderwater,
          },
        }).catch(() => {})
      }
      
      // Cleanup old
      const cutoff = new Date(now - 7 * 86400000)
      await prisma.earthquake.deleteMany({ where: { time: { lt: cutoff } } }).catch(() => {})
      await prisma.$disconnect()
    } catch (dbError) {
      console.log('DB storage skipped')
    }

    return NextResponse.json({
      earthquakes,
      meta: {
        count: earthquakes.length,
        generated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Earthquake API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch earthquake data', details: String(error) },
      { status: 500 }
    )
  }
}
