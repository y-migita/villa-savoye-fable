import { useMemo } from 'react'
import * as THREE from 'three'
import { BAY, COL_R, FL1, HALF_D } from './dims'
import { white } from './materials'

const colGeo = new THREE.CylinderGeometry(COL_R, COL_R, FL1, 20)

/**
 * 4.75m グリッドのピロティ柱。
 * 北列(アプローチ正面)だけは実物どおり半スパンずらした 4 本で、
 * 玄関の軸線を空けている。
 */
export function Pilotis() {
  const positions = useMemo(() => {
    const p: [number, number][] = []
    for (let j = -2; j <= 2; j++) {
      const z = j * BAY
      if (z === -HALF_D) {
        // 北列: 軸線を挟んで対称の 4 本
        for (const x of [-1.5 * BAY, -0.5 * BAY, 0.5 * BAY, 1.5 * BAY]) p.push([x, z])
      } else {
        for (let i = -2; i <= 2; i++) p.push([i * BAY, z])
      }
    }
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
