'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
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
  const canvasRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [selectedQuakeId, setSelectedQuakeId] = useState<string | null>(null)
  
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const markersRef = useRef<THREE.Mesh[]>([])
  const animationRef = useRef<number>(0)
  
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

  // Initialize 3D Globe
  useEffect(() => {
    if (!canvasRef.current || viewMode !== '3d') return
    
    const container = canvasRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 3
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight(0xffffff, 1)
    sun.position.set(5, 3, 5)
    scene.add(sun)

    const globeGroup = new THREE.Group()
    scene.add(globeGroup)
    globeRef.current = globeGroup

    const textureLoader = new THREE.TextureLoader()
    const earthGeo = new THREE.SphereGeometry(1, 64, 64)
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'),
      bumpMap: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-topology.png'),
      bumpScale: 0.02,
    })
    globeGroup.add(new THREE.Mesh(earthGeo, earthMat))

    const cloudGeo = new THREE.SphereGeometry(1.01, 32, 32)
    const cloudMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png'),
      transparent: true,
      opacity: 0.3,
    })
    globeGroup.add(new THREE.Mesh(cloudGeo, cloudMat))

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
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 })))

    let autoRotate = true
    let velocity = { x: 0, y: 0.002 }
    let isDragging3d = false
    let isClicking = false
    let dragStartPos = { x: 0, y: 0 }

    const onDown = (e: MouseEvent) => {
      isDragging3d = true
      isClicking = true
      autoRotate = false
      dragStartPos = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    }
    const onMove = (e: MouseEvent) => {
      if (!isDragging3d) return
      const dx = e.clientX - dragStartPos.x
      const dy = e.clientY - dragStartPos.y
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isClicking = false
      velocity.y = dx * 0.004
      velocity.x = dy * 0.004
      dragStartPos = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => { isDragging3d = false }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const delta = e.deltaY > 0 ? 0.5 : -0.5
      const newZ = Math.max(1.5, Math.min(6, camera.position.z + delta))
      camera.position.z = newZ
    }
    const onClick = (e: MouseEvent) => {
      if (!isClicking) return
      
      const rect = renderer.domElement.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
      const hits = raycaster.intersectObjects(markersRef.current)
      if (hits.length > 0 && onMarkerClick) {
        onMarkerClick(hits[0].object.userData.id)
      }
    }

    renderer.domElement.addEventListener('mousedown', onDown)
    renderer.domElement.addEventListener('mousemove', onMove)
    renderer.domElement.addEventListener('mouseup', onUp)
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false })
    renderer.domElement.addEventListener('click', onClick)

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
      const w = container.clientWidth || 800
      const h = container.clientHeight || 600
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      renderer.domElement.removeEventListener('mousedown', onDown)
      renderer.domElement.removeEventListener('mousemove', onMove)
      renderer.domElement.removeEventListener('mouseup', onUp)
      renderer.domElement.removeEventListener('wheel', onWheel)
      renderer.domElement.removeEventListener('click', onClick)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
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

      // Larger markers for better click detection
      const size = Math.max(0.04, quake.magnitude * 0.025)
      let color = 0x00aaff
      if (quake.magnitude >= 6) color = 0xff2244
      else if (quake.magnitude >= 4.5) color = 0xffaa00

      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(size, 16, 16),
        new THREE.MeshBasicMaterial({ color })
      )
      marker.position.set(x, y, z)
      marker.userData = { id: quake.id }
      globeRef.current!.add(marker)
      markersRef.current.push(marker)
    })
  }, [earthquakes, viewMode])

  // Add red X for selected in 3D
  useEffect(() => {
    if (!globeRef.current || viewMode !== '3d') return
    
    // Remove existing X markers
    const existingX = globeRef.current.children.filter(c => c.userData.isXMarker)
    existingX.forEach(c => globeRef.current!.remove(c))

    if (selectedQuakeId) {
      const quake = earthquakes.find(q => q.id === selectedQuakeId)
      if (quake) {
        const phi = (90 - quake.coordinates.latitude) * Math.PI / 180
        const theta = (quake.coordinates.longitude + 180) * Math.PI / 180
        const r = 1.08
        const x = -r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.cos(phi)
        const z = r * Math.sin(phi) * Math.sin(theta)

        const xGroup = new THREE.Group()
        xGroup.userData = { isXMarker: true }
        
        // Make X face camera (billboard)
        xGroup.lookAt(cameraRef.current?.position || new THREE.Vector3(0, 0, 3))

        const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 })
        
        // Larger X lines
        const line1 = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(-0.08, 0.08, 0), 
            new THREE.Vector3(0.08, -0.08, 0)
          ]),
          lineMat
        )
        const line2 = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0.08, 0.08, 0), 
            new THREE.Vector3(-0.08, -0.08, 0)
          ]),
          lineMat
        )
        
        // Ring
        const ringGeo = new THREE.RingGeometry(0.06, 0.1, 32)
        const ringMat = new THREE.MeshBasicMaterial({ 
          color: 0xff0000, 
          side: THREE.DoubleSide,
          transparent: true, 
          opacity: 0.8 
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        
        xGroup.add(line1, line2, ring)
        xGroup.position.set(x, y, z)
        globeRef.current!.add(xGroup)
      }
    }
  }, [earthquakes, viewMode, selectedQuakeId])

  // 2D handlers
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoom(z => Math.max(0.3, Math.min(5, z * (e.deltaY > 0 ? 0.85 : 1.15))))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y })
  }, [offset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }, [isDragging, dragStart])

  const handleMarkerClick = useCallback((quake: {id: string, coordinates: {latitude: number, longitude: number}}, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedQuakeId(quake.id)
    if (onMarkerClick) onMarkerClick(quake.id)
  }, [onMarkerClick])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
      {/* 3D View */}
      <div
        ref={canvasRef}
        style={{
          display: viewMode === '3d' ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
      />

      {/* 2D View */}
      {viewMode === '2d' && (
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onWheel={handleWheel}
          style={{
            width: '100%', height: '100%', position: 'relative',
            overflow: 'hidden', background: '#0a0e17',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
        >
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            width: `${mapWidth * zoom * 0.45}px`,
            height: `${mapHeight * zoom * 0.45}px`,
            transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}>
            <img
              src="https://unpkg.com/three-globe/example/img/earth-dark.jpg"
              alt="Map"
              onLoad={() => setMapLoaded(true)}
              style={{ width: '100%', height: '100%', objectFit: 'fill', boxShadow: '0 0 30px rgba(6,182,212,0.2)' }}
              draggable={false}
            />
            
            {mapLoaded && earthquakes.map(quake => {
              const coords = latLonToXY(quake.coordinates.latitude, quake.coordinates.longitude)
              const size = Math.max(12, quake.magnitude * 6)
              const color = quake.magnitude >= 6 ? '#ff2244' : quake.magnitude >= 4.5 ? '#ffaa00' : '#00aaff'
              return (
                <div
                  key={quake.id}
                  onClick={(e) => handleMarkerClick(quake, e)}
                  style={{
                    position: 'absolute',
                    left: `${(coords.x / mapWidth) * 100}%`,
                    top: `${(coords.y / mapHeight) * 100}%`,
                    width: `${size}px`, height: `${size}px`,
                    background: color,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    boxShadow: `0 0 15px ${color}`,
                    border: selectedQuakeId === quake.id ? '3px solid white' : 'none',
                    zIndex: 10,
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
                  zIndex: 20,
                }}>
                  <svg width="50" height="50" viewBox="0 0 50 50">
                    <line x1="10" y1="10" x2="40" y2="40" stroke="#ff0000" strokeWidth="4"/>
                    <line x1="40" y1="10" x2="10" y2="40" stroke="#ff0000" strokeWidth="4"/>
                    <circle cx="25" cy="25" r="20" fill="none" stroke="#ff0000" strokeWidth="2" strokeDasharray="6 3"/>
                  </svg>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* View Toggle Buttons */}
      <button
        onClick={() => { setViewMode('3d'); setSelectedQuakeId(null) }}
        style={{
          position: 'absolute', top: 20, right: 20,
          padding: '12px 24px',
          background: viewMode === '3d' ? '#06b6d4' : 'rgba(17,24,39,0.9)',
          border: '1px solid #06b6d4', borderRadius: 8,
          color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          zIndex: 100,
        }}
      >
        3D Globe
      </button>
      <button
        onClick={() => { setViewMode('2d'); setSelectedQuakeId(null) }}
        style={{
          position: 'absolute', top: 20, right: 140,
          padding: '12px 24px',
          background: viewMode === '2d' ? '#06b6d4' : 'rgba(17,24,39,0.9)',
          border: '1px solid #06b6d4', borderRadius: 8,
          color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600,
          zIndex: 100,
        }}
      >
        2D Map
      </button>
      
      <div style={{
        position: 'absolute', top: 20, left: 20,
        background: 'rgba(17,24,39,0.9)', padding: '14px 18px',
        borderRadius: 8, border: '1px solid #1e293b', color: '#94a3b8', fontSize: 13,
        zIndex: 100,
      }}>
        <div style={{ marginBottom: 8, fontWeight: 600, color: '#f8fafc' }}>Controls</div>
        {viewMode === '3d' ? (
          <>
            <div>Drag to rotate</div>
            <div>Scroll to zoom</div>
          </>
        ) : (
          <>
            <div>Drag to pan</div>
            <div>Scroll to zoom</div>
          </>
        )}
        <div style={{ marginTop: 4 }}>Click marker for details</div>
      </div>
    </div>
  )
}
