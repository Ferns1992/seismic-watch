import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch fresh earthquake data
    const response = await fetch('http://localhost:4080/api/earthquakes?refresh=true&minMagnitude=2.5&timeRange=day', {
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      throw new Error('Failed to refresh earthquake data')
    }
    
    const data = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      count: data.meta?.count || 0,
      message: 'Earthquake data refreshed' 
    })
  } catch (error) {
    console.error('Refresh error:', error)
    return NextResponse.json({ success: false, error: 'Failed to refresh' }, { status: 500 })
  }
}
