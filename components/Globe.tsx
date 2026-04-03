'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface GlobeProps {
  earthquakes: Array<{
    id: string
    magnitude: number
    coordinates: { longitude: number; latitude: number }
  }>
  onMarkerClick?: (id: string) => void
}

export default function Globe({ earthquakes, onMarkerClick }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null)
  
  // 3D refs
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const markersRef = useRef<THREE.Mesh[]>([])
  const animationRef = useRef<number>(0)
  
  // 2D refs
  const [mapLoaded, setMapLoaded] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const mapWidth = 2048
  const mapHeight = 1024

  const latLonToXY = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * mapWidth
    const y = ((90 - lat) / 180) * mapHeight
    return { x, y }
  }

  // 3D Globe Setup
  useEffect(() => {
    if (!containerRef.current || viewMode !== '3d') return
    
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 2.5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight(0xffffff, 1)
    sun.position.set(5, 3, 5)
    scene.add(sun)

    // Globe Group
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)
    globeRef.current = globeGroup

    // Earth
    const textureLoader = new THREE.TextureLoader()
    const earthGeo = new THREE.SphereGeometry(1, 64, 64)
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
      bumpMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
      bumpScale: 0.02,
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    globeGroup.add(earth)

    // Clouds
    const cloudGeo = new THREE.SphereGeometry(1.01, 32, 32)
    const cloudMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png'),
      transparent: true,
      opacity: 0.3,
    })
    const clouds = new THREE.Mesh(cloudGeo, cloudMat)
    globeGroup.add(clouds)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1500
    const positions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 40 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i] = r * Math.sin(phi) * Math.cos(theta)
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i + 2] = r * Math.cos(phi)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 }))
    scene.add(stars)

    // Animation
    let autoRotate = true
    let velocity = { x: 0, y: 0.002 }
    let isDragging3d = false
    let dragStartPos = { x: 0, y: 0 }

    const onDown = (e: MouseEvent) => {
      isDragging3d = true
      autoRotate = false
      dragStartPos = { x: e.clientX, y: e.clientY }
    }
    const onMove = (e: MouseEvent) => {
      if (!isDragging3d) return
      const dx = e.clientX - dragStartPos.x
      const dy = e.clientY - dragStartPos.y
      velocity.y = dx * 0.004
      velocity.x = dy * 0.004
      dragStartPos = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => { isDragging3d = false }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z = Math.max(1.3, Math.min(5, camera.position.z + e.deltaY * 0.001))
    }
    const onClick = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - dragStartPos.x)
      const dy = Math.abs(e.clientY - dragStartPos.y)
      if (dx > 5 || dy > 5) return
      
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      const hits = raycaster.intersectObjects(markersRef.current)
      
      if (hits.length > 0 && onMarkerClick) {
        const id = hits[0].object.userData.id
        onMarkerClick(id)
      }
    }

    container.addEventListener('mousedown', onDown)
    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseup', onUp)
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('click', onClick)

    function animate() {
      animationRef.current = requestAnimationFrame(animate)
      
      if (autoRotate) {
        globeGroup.rotation.y += 0.0015
      } else {
        globeGroup.rotation.y += velocity.y
        globeGroup.rotation.x += velocity.x
        velocity.y *= 0.95
        velocity.x *= 0.95
      }
      
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      container.removeEventListener('mousedown', onDown)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseup', onUp)
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [viewMode, onMarkerClick])

  // Update 3D markers
  useEffect(() => {
    if (!globeRef.current || viewMode !== '3d') return
    
    markersRef.current.forEach(m => globeRef.current!.remove(m))
    markersRef.current = []

    earthquakes.forEach(quake => {
      const phi = (90 - quake.coordinates.latitude) * Math.PI / 180
      const theta = (quake.coordinates.longitude + 180) * Math.PI / 180
      const r = 1.025
      
      const x = -r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      const size = Math.max(0.02, quake.magnitude * 0.015)
      const geo = new THREE.SphereGeometry(size, 8, 8)
      
      let color = 0x00aaff
      if (quake.magnitude >= 6) color = 0xff2244
      else if (quake.magnitude >= 4.5) color = 0xffaa00

      const mat = new THREE.MeshBasicMaterial({ color })
      const marker = new THREE.Mesh(geo, mat)
      marker.position.set(x, y, z)
      marker.userData = { id: quake.id }
      
      globeRef.current!.add(marker)
      markersRef.current.push(marker)
    })
  }, [earthquakes, viewMode])

  // 2D handlers
  const handle2DMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }
  const handle2DMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }
  const handle2DClick = (quake: {id: string, coordinates: {latitude: number, longitude: number}}) => {
    setSelectedQuakeId(quake.id)
    const coords = latLonToXY(quake.coordinates.latitude, quake.coordinates.longitude)
    const cw = containerRef.current?.clientWidth || 800
    const ch = containerRef.current?.clientHeight || 600
    setOffset({ x: cw/2 - coords.x * 1.2, y: ch/2 - coords.y * 1.2 })
    setZoom(2)
    if (onMarkerClick) onMarkerClick(quake.id)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.5, Math.min(4, z * (e.deltaY > 0 ? 0.9 : 1.1))))
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      <div
        ref={containerRef}
        onMouseDown={viewMode === '2d' ? handle2DMouseDown : undefined}
        onMouseMove={viewMode === '2d' ? handle2DMouseMove : undefined}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onWheel={viewMode === '2d' ? handleWheel : undefined}
        style={{ width: '100%', height: '100%', cursor: viewMode === '3d' ? 'grab' : isDragging ? 'grabbing' : 'grab' }}
      >
        {viewMode === '3d' ? (
          // 3D View is rendered via Three.js effect
          <div />
        ) : (
          // 2D View
          <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#0a0e17' }}>
            <div style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: `${mapWidth * zoom * 0.35}px`,
              height: `${mapHeight * zoom * 0.35}px`,
              transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
              transition: isDragging ? 'none' : 'all 0.1s',
            }}>
              <img
                src="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                alt="Map"
                onLoad={() => setMapLoaded(true)}
                style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 0 40px rgba(6,182,212,0.2)' }}
                draggable={false}
              />
              {mapLoaded && earthquakes.map(quake => {
                const coords = latLonToXY(quake.coordinates.latitude, quake.coordinates.longitude)
                const size = Math.max(8, quake.magnitude * 4)
                const color = quake.magnitude >= 6 ? '#ff2244' : quake.magnitude >= 4.5 ? '#ffaa00' : '#00aaff'
                return (
                  <div
                    key={quake.id}
                    onClick={() => handle2DClick(quake)}
                    style={{
                      position: 'absolute',
                      left: `${(coords.x / mapWidth) * 100}%`,
                      top: `${(coords.y / mapHeight) * 100}%`,
                      width: `${size}px`, height: `${size}px`,
                      background: color,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      boxShadow: `0 0 10px ${color}`,
                      border: selectedQuakeId === quake.id ? '2px solid white' : 'none',
                    }}
                  />
                )
              })}
              {selectedQuakeId && (() => {
                const q = earthquakes.find(e => e.id === selectedQuakeId)
                if (!q) return null
                const coords = latLonToXY(q.coordinates.latitude, q.coordinates.longitude)
                return (
                  <div style={{
                    position: 'absolute',
                    left: `${(coords.x / mapWidth) * 100}%`,
                    top: `${(coords.y / mapHeight) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}>
                    <svg width="40" height="40">
                      <line x1="5" y1="5" x2="35" y2="35" stroke="red" strokeWidth="3"/>
                      <line x1="35" y1="5" x2="5" y2="35" stroke="red" strokeWidth="3"/>
                      <circle cx="20" cy="20" r="15" fill="none" stroke="red" strokeWidth="2" strokeDasharray="4 2"/>
                    </svg>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <button
        onClick={() => { setViewMode('3d'); setSelectedQuakeId(null) }}
        style={{
          position: 'absolute', top: 20, right: 20,
          padding: '10px 20px',
          background: viewMode === '3d' ? '#06b6d4' : 'rgba(17,24,39,0.9)',
          border: '1px solid #06b6d4', borderRadius: 8,
          color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
        }}
      >
        🌍 3D Globe
      </button>
      <button
        onClick={() => { setViewMode('2d'); setSelectedQuakeId(null) }}
        style={{
          position: 'absolute', top: 20, right: 140,
          padding: '10px 20px',
          background: viewMode === '2d' ? '#06b6d4' : 'rgba(17,24,39,0.9)',
          border: '1px solid #06b6d4', borderRadius: 8,
          color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
        }}
      >
        🗺️ 2D Map
      </button>
      
      <div style={{
        position: 'absolute', top: 20, left: 20,
        background: 'rgba(17,24,39,0.9)', padding: '12px 16px',
        borderRadius: 8, border: '1px solid #1e293b', color: '#94a3b8', fontSize: 12,
      }}>
        <div style={{ marginBottom: 6, fontWeight: 600, color: '#f8fafc' }}>Controls</div>
        {viewMode === '3d' ? (
          <><div>🖱️ Drag to rotate</div><div>🔍 Scroll to zoom</div></>
        ) : (
          <><div>🖱️ Drag to move</div><div>🔍 Scroll to zoom</div></>
        )}
        <div>👆 Click marker</div>
      </div>
    </div>
  )
}
