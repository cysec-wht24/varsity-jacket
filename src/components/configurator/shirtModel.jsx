import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Material.001 → Plane.001 node → left chest area  (norm: -0.173, 0.047, 0.100)
// Material.002 → Plane.002 node → left sleeve area  (norm: -0.150,-0.150, 0.117)
// Material.003 → Plane node     → right chest area  (norm:  0.139,-0.140, 0.122)

export const PLACEMENT_ZONES = [
  {
    id: 'left-chest',
    label: 'Left Chest',
    icon: '◧',
    materialName: 'Material.001',
  },
  {
    id: 'right-chest',
    label: 'Right Bottom',
    icon: '◨',
    materialName: 'Material.003',
  },
  {
    id: 'left-sleeve',
    label: 'Left Bottom',
    icon: '◁',
    materialName: 'Material.002',
  },
]

const PATCH_MAT_NAMES = new Set(PLACEMENT_ZONES.map(z => z.materialName))

// Body material names — anything NOT a patch
const isBodyMat = (name) => !PATCH_MAT_NAMES.has(name)

export default function ShirtModel({ color, autoRotate, selectedZoneId, logoTexture }) {
  const groupRef = useRef()
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'shirt.glb')
  const { camera, controls } = useThree()
  const readyRef = useRef(false)
  const prevMaterialRef = useRef(null)

  // ── Normalize model ───────────────────────────────────────
  useEffect(() => {
    if (!scene || readyRef.current) return
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)
    scene.position.set(-center.x, -center.y, -center.z)
    scene.scale.setScalar(1.0 / Math.max(size.x, size.y, size.z))
    scene.updateMatrixWorld(true)
    const box2 = new THREE.Box3().setFromObject(scene)
    const c2 = new THREE.Vector3()
    box2.getCenter(c2)
    scene.position.y -= c2.y

    camera.position.set(0, 0, 1.8)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    if (controls) { controls.target.set(0, 0, 0); controls.update() }

    // Hide all patches initially
    scene.traverse(obj => {
      if (obj.isMesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(m => {
          if (PATCH_MAT_NAMES.has(m.name)) {
            m.transparent = true
            m.opacity = 0
            m.needsUpdate = true
          }
        })
      }
    })

    readyRef.current = true
  }, [scene, camera, controls])

  // ── Recolor shirt body ────────────────────────────────────
  useEffect(() => {
    scene.traverse(obj => {
      if (obj.isMesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(m => {
          if (isBodyMat(m.name)) {
            m.color.set(color)
            m.needsUpdate = true
          }
        })
      }
    })
  }, [color, scene])

  // ── Apply logo to selected patch ──────────────────────────
  useEffect(() => {
    if (prevMaterialRef.current) {
      prevMaterialRef.current.map = null
      prevMaterialRef.current.opacity = 0
      prevMaterialRef.current.needsUpdate = true
      prevMaterialRef.current = null
    }

    if (!selectedZoneId || !logoTexture) return

    const zone = PLACEMENT_ZONES.find(z => z.id === selectedZoneId)
    if (!zone) return

    scene.traverse(obj => {
      if (obj.isMesh) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach(m => {
          if (m.name === zone.materialName) {
            m.map = logoTexture
            m.transparent = true
            m.opacity = 1
            m.roughness = 0.85
            m.metalness = 0
            m.needsUpdate = true
            prevMaterialRef.current = m
          }
        })
      }
    })
  }, [selectedZoneId, logoTexture, scene])

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate)
      groupRef.current.rotation.y += dt * 0.35
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(import.meta.env.BASE_URL + 'shirt.glb')