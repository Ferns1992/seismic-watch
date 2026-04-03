'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user')
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.accountPage}>
        <div className={styles.notLoggedIn}>
          <h2>Please log in to view your account</h2>
          <Link href="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.accountPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Account Settings</h1>
          <p>Manage your profile and subscription</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Profile Information</h2>
            <div className={styles.card}>
              <div className={styles.field}>
                <label>Name</label>
                <span>{user.name}</span>
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <span>{user.email}</span>
              </div>
              <div className={styles.field}>
                <label>Member Since</label>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Subscription</h2>
            <div className={styles.card}>
              <div className={styles.subscription}>
                <div className={styles.planInfo}>
                  <span className={styles.planName}>{user.subscription}</span>
                  <span className={styles.planStatus}>Active</span>
                </div>
                <p className={styles.planDescription}>
                  {user.subscription === 'FREE' && 'Basic earthquake data with 24-hour history'}
                  {user.subscription === 'PRO' && 'Full access with real-time alerts and API access'}
                  {user.subscription === 'ENTERPRISE' && 'Unlimited access with dedicated support'}
                </p>
                {user.subscription === 'FREE' && (
                  <Link href="/#pricing" className={styles.upgradeButton}>
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Preferences</h2>
            <div className={styles.card}>
              <div className={styles.field}>
                <label>Minimum Magnitude</label>
                <span>{user.preferences?.minMagnitude || 0}</span>
              </div>
              <div className={styles.field}>
                <label>Maximum Depth</label>
                <span>{user.preferences?.maxDepth || 700} km</span>
              </div>
              <div className={styles.field}>
                <label>Underwater Only</label>
                <span>{user.preferences?.underwaterOnly ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>API Access</h2>
            <div className={styles.card}>
              <p className={styles.apiInfo}>
                Use your API key to access earthquake data programmatically.
              </p>
              <div className={styles.apiKey}>
                <code>{user.apiKey || 'Generate an API key to get started'}</code>
                <button className={styles.generateButton}>
                  {user.apiKey ? 'Regenerate' : 'Generate Key'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
