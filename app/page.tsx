'use client'

import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.landing}>
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gridPattern}></div>
          <div className={styles.glowOrb1}></div>
          <div className={styles.glowOrb2}></div>
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.pulseDot}></span>
            Live Earthquake Data
          </div>
          
          <h1 className={styles.title}>
            Track Underwater<br />
            <span className="text-gradient">Earthquakes</span> in Real-Time
          </h1>
          
          <p className={styles.subtitle}>
            Monitor seismic activity beneath the waves with our advanced 3D globe dashboard. 
            Get instant alerts, historical data, and powerful analytics.
          </p>
          
          <div className={styles.heroCta}>
            <Link href="/register" className="btn btn-primary">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link href="/dashboard" className="btn btn-secondary">
              View Demo
            </Link>
          </div>
          
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>10K+</span>
              <span className={styles.statLabel}>Earthquakes Tracked</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>24/7</span>
              <span className={styles.statLabel}>Real-Time Monitoring</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>99.9%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
          </div>
        </div>
        
        <div className={styles.globePreview}>
          <div className={styles.globeContainer}>
            <div className={styles.globe}>
              <div className={styles.globeGrid}></div>
              <div className={styles.globeMarker} style={{ top: '30%', left: '45%' }}></div>
              <div className={styles.globeMarker} style={{ top: '55%', left: '70%' }}></div>
              <div className={styles.globeMarker} style={{ top: '40%', left: '25%' }}></div>
              <div className={styles.globeMarker} style={{ top: '65%', left: '55%' }}></div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Powerful Features for<br />
            <span className="text-gradient">Seismic Monitoring</span>
          </h2>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3>3D Globe Dashboard</h3>
              <p>Interactive 3D globe with real-time earthquake visualization. Rotate, zoom, and explore seismic activity worldwide.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3>Tsunami Alerts</h3>
              <p>Instant notifications for underwater earthquakes that may trigger tsunamis. Stay informed and safe.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Historical Data</h3>
              <p>Access decades of seismic data. Analyze patterns and trends with powerful visualization tools.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <h3>Custom Alerts</h3>
              <p>Set up custom alerts based on magnitude, depth, and location. Get notified when it matters most.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <h3>API Access</h3>
              <p>Integrate earthquake data into your applications with our robust REST API.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Team Collaboration</h3>
              <p>Share dashboards and data with your team. Collaborate on research and analysis.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section id="pricing" className={styles.pricing}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Simple, Transparent<br />
            <span className="text-gradient">Pricing</span>
          </h2>
          
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Free</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>0</span>
                  <span className={styles.period}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Basic earthquake data
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  3D globe visualization
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  24-hour historical data
                </li>
                <li className={styles.disabled}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Real-time alerts
                </li>
                <li className={styles.disabled}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  API access
                </li>
              </ul>
              <Link href="/register" className={styles.pricingButton}>
                Get Started
              </Link>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <div className={styles.pricingHeader}>
                <h3>Pro</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>29</span>
                  <span className={styles.period}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  All Free features
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Real-time earthquake alerts
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  30-day historical data
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  API access (1000 req/day)
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Custom filters & alerts
                </li>
              </ul>
              <Link href="/register?plan=pro" className={styles.pricingButton}>
                Start Free Trial
              </Link>
            </div>
            
            <div className={styles.pricingCard}>
              <div className={styles.pricingHeader}>
                <h3>Enterprise</h3>
                <div className={styles.price}>
                  <span className={styles.currency}>$</span>
                  <span className={styles.amount}>99</span>
                  <span className={styles.period}>/month</span>
                </div>
              </div>
              <ul className={styles.pricingFeatures}>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  All Pro features
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Unlimited API access
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Full historical data
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Dedicated support
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Custom integrations
                </li>
              </ul>
              <Link href="/register?plan=enterprise" className={styles.pricingButton}>
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <section id="about" className={styles.about}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Trusted by Researchers<br />
            <span className="text-gradient">Worldwide</span>
          </h2>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonial}>
              <p>"SeismicWatch has transformed how we monitor oceanic seismic activity. The real-time alerts have been invaluable for our research."</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>Dr. S</div>
                <div>
                  <strong>Dr. Sarah Chen</strong>
                  <span>Marine Geophysicist, MIT</span>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <p>"The 3D globe visualization is stunning and the API is incredibly well-documented. Perfect for our early warning system."</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>J. M</div>
                <div>
                  <strong>James Miller</strong>
                  <span>CTO, OceanSafe Systems</span>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonial}>
              <p>"We've been able to reduce response time to underwater earthquakes by 60% since implementing SeismicWatch."</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.avatar}>R. T</div>
                <div>
                  <strong>Rachel Torres</strong>
                  <span>Director, Tsunami Alert Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <Link href="/" className={styles.footerLogo}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12c2-4 6-7 10-7s8 3 10 7c-2 4-6 7-10 7s-8-3-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                SeismicWatch
              </Link>
              <p>Real-time underwater earthquake tracking and monitoring platform.</p>
            </div>
            
            <div className={styles.footerLinks}>
              <h4>Product</h4>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/#pricing">Pricing</Link>
              <Link href="/#features">Features</Link>
              <Link href="/#about">About</Link>
            </div>
            
            <div className={styles.footerLinks}>
              <h4>Resources</h4>
              <Link href="#">API Documentation</Link>
              <Link href="#">Guides</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Support</Link>
            </div>
            
            <div className={styles.footerLinks}>
              <h4>Legal</h4>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Cookie Policy</Link>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <p>&copy; 2026 SeismicWatch. All rights reserved.</p>
            <div className={styles.socialLinks}>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
