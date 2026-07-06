import { useMemo } from 'react'
import * as THREE from 'three'
import { ROOF_FL, STAIR_X, STAIR_Z, STAIR_R } from './dims'
import { white, steel, innerWhite, blueGray } from './materials'

const STEPS = 31
const RISE = ROOF_FL / STEPS
const SWEEP = THREE.MathUtils.degToRad(22.5) // 1段あたりの回転角
const A0 = Math.PI * 0.75 // 始まりの向き

/** 1階から屋上まで貫く螺旋階段 */
export function SpiralStair() {
  const railGeo = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= STEPS; i++) {
      const a = A0 + i * SWEEP + SWEEP / 2
      pts.push(
        new THREE.Vector3(
          0.97 * Math.sin(a),
          i * RISE + 1.0,
          0.97 * Math.cos(a),
        ),
      )
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    return new THREE.TubeGeometry(curve, 120, 0.03, 8)
  }, [])

  return (
    <group position={[STAIR_X, 0, STAIR_Z]}>
      {/* 中心の支柱 */}
      <mesh material={steel} position={[0, (ROOF_FL + 1.0) / 2, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, ROOF_FL + 1.0, 16]} />
      </mesh>
      {/* 段板(扇形) */}
      {Array.from({ length: STEPS }, (_, i) => (
        <mesh
          key={i}
          material={white}
          position={[0, (i + 1) * RISE - 0.03, 0]}
          rotation-y={A0 + i * SWEEP}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[STAIR_R, STAIR_R, 0.06, 10, 1, false, 0, SWEEP * 1.05]} />
        </mesh>
      ))}
      {/* 螺旋の手すり */}
      <mesh geometry={railGeo} material={steel} castShadow />

      {/* 1階の袖壁(曲面) */}
      <mesh material={innerWhite} position={[0, 1.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 2.6, 40, 1, true, Math.PI * 0.9, Math.PI * 0.85]} />
      </mesh>
      {/* 屋上の階段室(曲面の立上り) */}
      <mesh material={blueGray} position={[0, (ROOF_FL + 8.7) / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.4, 8.7 - ROOF_FL, 40, 1, true, Math.PI * 0.6, Math.PI * 1.55]} />
      </mesh>
      <mesh material={white} position={[0, 8.72, 0]} castShadow>
        <cylinderGeometry args={[1.48, 1.48, 0.1, 40]} />
      </mesh>
    </group>
  )
}
