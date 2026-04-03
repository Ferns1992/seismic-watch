import { NextRequest, NextResponse } from 'next/server'

interface EarthquakeFeature {
  id: string
  properties: {
    mag: number
    place: string
    time: number
    updated: number
    url: string
    detail: string
    felt: number
    cdi: number
    mmi: number
    alert: string
    status: string
    tsunami: number
    sig: number
    net: string
    code: string
    ids: string
    sources: string
    types: string
    nst: number
    dmin: number
    rms: number
    gap: number
    magType: string
    type: string
    title: string
  }
  geometry: {
    type: string
    coordinates: [number, number, number]
  }
}

const OCEAN_BOUNDARIES: [number, number, number, number][] = [
  [-180, -90, 180, 0],   // Southern Ocean
  [-180, 0, 180, 90],    // Northern oceans
]

function isUnderwater(longitude: number, latitude: number): boolean {
  return latitude >= -60 && latitude <= 60 && 
         Math.abs(longitude) < 180
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const minMagnitude = searchParams.get('minMagnitude') || '2.5'
    const timeRange = searchParams.get('timeRange') || 'day'
    const underwaterOnly = searchParams.get('underwaterOnly') || 'true'

    let startTime: number
    const now = Date.now()
    
    switch (timeRange) {
      case 'hour':
        startTime = now - 3600000
        break
      case 'week':
        startTime = now - 604800000
        break
      case 'month':
        startTime = now - 2592000000
        break
      default:
        startTime = now - 86400000
    }

    const usgsUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${new Date(startTime).toISOString()}&minmagnitude=${minMagnitude}&orderby=time`

    const response = await fetch(usgsUrl, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch earthquake data')
    }

    const data = await response.json()
    
    let features: EarthquakeFeature[] = data.features

    if (underwaterOnly === 'true') {
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
      { error: 'Failed to fetch earthquake data' },
      { status: 500 }
    )
  }
}
