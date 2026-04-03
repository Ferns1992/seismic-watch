import { NextRequest, NextResponse } from 'next/server'
import { auth, signOut } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await signOut({ redirect: false })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 })
  }
}
