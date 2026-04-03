'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data?.user) {
          setIsLoggedIn(true)
          setUserName(data.user.name || data.user.email)
          setIsAdmin(data.user.subscription === 'ENTERPRISE')
        }
      } catch (e) {
        console.error('Auth check failed')
      }
    }
    checkAuth()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch (e) {
      console.error('Logout error')
    }
    setIsLoggedIn(false)
    window.location.href = '/'
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12c2-4 6-7 10-7s8 3 10 7c-2 4-6 7-10 7s-8-3-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>SeismicWatch</span>
        </Link>

        <button 
          className={styles.menuToggle} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
          <Link 
            href="/dashboard" 
            className={`${styles.navLink} ${pathname === '/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          {isAdmin && (
            <Link 
              href="/admin/users" 
              className={`${styles.navLink} ${pathname === '/admin/users' ? styles.active : ''}`}
            >
              Users
            </Link>
          )}
          <Link 
            href="/#pricing" 
            className={styles.navLink}
          >
            Pricing
          </Link>
          <Link 
            href="/#about" 
            className={styles.navLink}
          >
            About
          </Link>
        </div>

        <div className={`${styles.authButtons} ${isMenuOpen ? styles.open : ''}`}>
          {isLoggedIn ? (
            <div className={styles.userMenu}>
              <Link href="/account" className={styles.userButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {userName}
              </Link>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
