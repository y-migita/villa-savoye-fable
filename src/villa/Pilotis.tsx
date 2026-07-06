import { useMemo } from 'react'
import * as THREE from 'three'
import { BAY, COL_R, FL1 } from './dims'
import { white } from './materials'

const colGeo = new THREE.CylinderGeometry(COL_R, COL_R, FL1, 20)

/** 4.75m グリッドの 5×5 ピロティ柱(1階から主階床まで通し) */
export function Pilotis() {
  const positions = useMemo(() => {
    const p: [number, number][] = []
    for (let i = -2; i <= 2; i++)
      for (let j = -2; j <= 2; j++) p.push([i * BAY, j * BAY])
    return p
  }, [])
  return (
    <group>
      {positions.map(([x, z]) => (
        <mesh
          key={`${x},${z}`}
          geometry={colGeo}
          material={white}
          position={[x, FL1 / 2, z]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  )
}
