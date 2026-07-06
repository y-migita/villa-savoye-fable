import { useMemo } from 'react'
import * as THREE from 'three'
import {
  GF_HALF_W, GF_CURVE_ZC, GF_SOUTH_Z, GF_WALL_H,
} from './dims'
import { green, glass, steel, deck, innerWhite } from './materials'

const R = GF_HALF_W // 曲面半径 4.75(自動車の回転半径に由来)

/** 1階(ピロティ階): 曲面ガラスの玄関ホール+濃緑の壁+車庫 */
export function GroundFloor() {
  // 曲面ガラス(北の半円): θ=π/2 → (+R,0), θ=π → 頂点(0,-R), θ=3π/2 → (-R,0)
  const glassGeo = useMemo(
    () => new THREE.CylinderGeometry(R, R, GF_WALL_H - 0.34, 64, 1, true, Math.PI / 2, Math.PI),
    [],
  )
  // 方立の配置角
  const mullions = useMemo(() => {
    const arr: number[] = []
    const n = 24
    for (let i = 0; i <= n; i++) arr.push(Math.PI / 2 + (Math.PI * i) / n)
    return arr
  }, [])

  // 床(スタジアム形の土間)
  const floorGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(R, -GF_SOUTH_Z)
    // 北側の半円弧(plan z → shape -y)
    for (let i = 0; i <= 32; i++) {
      const th = Math.PI / 2 + (Math.PI * i) / 32
      s.lineTo(R * Math.sin(th), -(GF_CURVE_ZC + R * Math.cos(th)))
    }
    s.lineTo(-R, -GF_SOUTH_Z)
    s.closePath()
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: false })
    g.rotateX(-Math.PI / 2)
    return g
  }, [])

  const flankLen = GF_SOUTH_Z - GF_CURVE_ZC // 10.55
  const flankZC = (GF_SOUTH_Z + GF_CURVE_ZC) / 2

  return (
    <group>
      {/* 土間 */}
      <mesh geometry={floorGeo} material={deck} position={[0, 0, 0]} receiveShadow />

      {/* 曲面ガラス */}
      <mesh
        geometry={glassGeo}
        material={glass}
        position={[0, 0.17 + (GF_WALL_H - 0.34) / 2, GF_CURVE_ZC]}
      />
      {/* 巾木と笠木(曲面に沿う) */}
      {[0.085, GF_WALL_H - 0.06].map((y, i) => (
        <mesh key={i} material={steel} position={[0, y, GF_CURVE_ZC]}>
          <cylinderGeometry args={[R + 0.03, R + 0.03, i === 0 ? 0.17 : 0.12, 64, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
      ))}
      {/* 方立 */}
      {mullions.map((th) => (
        <mesh
          key={th}
          material={steel}
          position={[R * Math.sin(th), GF_WALL_H / 2, GF_CURVE_ZC + R * Math.cos(th)]}
          rotation-y={th}
          castShadow
        >
          <boxGeometry args={[0.07, GF_WALL_H, 0.07]} />
        </mesh>
      ))}
      {/* 玄関扉(曲面の頂点、アプローチ正面) */}
      <group position={[0, 0, GF_CURVE_ZC - R]}>
        <mesh material={steel} position={[0, 1.3, 0.02]} castShadow>
          <boxGeometry args={[2.2, 2.6, 0.1]} />
        </mesh>
        <mesh material={innerWhite} position={[0, 1.28, -0.04]}>
          <boxGeometry args={[2.0, 2.44, 0.06]} />
        </mesh>
      </group>

      {/* 濃緑の側壁(東西) */}
      {[-R, R].map((x) => (
        <mesh key={x} material={green} position={[x, GF_WALL_H / 2, flankZC]} castShadow receiveShadow>
          <boxGeometry args={[0.16, GF_WALL_H, flankLen]} />
        </mesh>
      ))}
      {/* 側壁の横長サービス窓 */}
      {[-R, R].map((x) => (
        <mesh key={x} material={steel} position={[x, 2.15, 4.2]}>
          <boxGeometry args={[0.2, 0.6, 4.4]} />
        </mesh>
      ))}

      {/* 南壁(車庫)+車庫扉 */}
      <mesh material={green} position={[0, GF_WALL_H / 2, GF_SOUTH_Z]} castShadow receiveShadow>
        <boxGeometry args={[2 * R + 0.16, GF_WALL_H, 0.16]} />
      </mesh>
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} material={steel} position={[x, 1.2, GF_SOUTH_Z + 0.1]} castShadow>
          <boxGeometry args={[2.6, 2.4, 0.08]} />
        </mesh>
      ))}

      {/* ホールと車庫の間仕切り */}
      <mesh material={innerWhite} position={[0, GF_WALL_H / 2, 2.0]}>
        <boxGeometry args={[2 * R - 0.2, GF_WALL_H, 0.12]} />
      </mesh>
    </group>
  )
}
