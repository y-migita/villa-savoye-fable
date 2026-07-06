import { useMemo } from 'react'
import {
  FL1, ROOF_FL, SOL_TOP,
  RAMP_X0, RAMP_X1, SLOT_Z0,
  TERR_X1, TERR_Z0, TERR_Z1,
} from './dims'
import { white, rose, blueGray, deck, leaf, leaf2 } from './materials'
import { arcWallGeo } from './util'

const H_SOL = SOL_TOP - ROOF_FL // 2.75

/** 白い立上りパラペット */
function Guard({ x0, x1, z0, z1 }: { x0: number; x1: number; z0: number; z1: number }) {
  return (
    <mesh
      material={white}
      position={[(x0 + x1) / 2, ROOF_FL + 0.475, (z0 + z1) / 2]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[Math.max(x1 - x0, 0.12), 0.95, Math.max(z1 - z0, 0.12)]} />
    </mesh>
  )
}

/** 植栽帯(白い箱+刈込み) */
function Planter({
  x, z, w, d, y = ROOF_FL, dark = false,
}: { x: number; z: number; w: number; d: number; y?: number; dark?: boolean }) {
  return (
    <group position={[x, y, z]}>
      <mesh material={white} position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.44, d]} />
      </mesh>
      <mesh material={dark ? leaf : leaf2} position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[w - 0.16, 0.5, d - 0.16]} />
      </mesh>
    </group>
  )
}

/** 屋上庭園とソラリウム: 曲面の風除け壁、額縁の開口、パラペット */
export function RoofGarden() {
  // 大きな曲壁(ロゼ): 西→北→東へ半円
  const bigArc = useMemo(() => arcWallGeo(3.0, 0.14, Math.PI, Math.PI * 2, H_SOL), [])
  // 小さな曲壁(ブルーグレー): 北→東の 1/4 円
  const smallArc = useMemo(() => arcWallGeo(2.6, 0.12, Math.PI * 1.5, Math.PI * 2, 1.95), [])

  return (
    <group>
      {/* デッキ仕上げ */}
      <mesh material={deck} position={[-7.08, ROOF_FL + 0.006, -0.15]} receiveShadow>
        <boxGeometry args={[7.24, 0.012, 18.58]} />
      </mesh>
      <mesh material={deck} position={[3.49, ROOF_FL + 0.006, -4.3]} receiveShadow>
        <boxGeometry args={[13.88, 0.012, 10.28]} />
      </mesh>
      {/* 空中庭園の床仕上げ */}
      <mesh material={deck} position={[(TERR_X1 - 0.9) / 2 + 0.03, FL1 + 0.006, (TERR_Z0 + TERR_Z1) / 2]} receiveShadow>
        <boxGeometry args={[TERR_X1 + 0.9 - 0.12, 0.012, TERR_Z1 - TERR_Z0 - 0.12]} />
      </mesh>

      {/* ソラリウムの曲壁 */}
      <mesh geometry={bigArc} material={rose} position={[-6.9, ROOF_FL, -4.6]} castShadow receiveShadow />
      <mesh geometry={smallArc} material={blueGray} position={[4.6, ROOF_FL, -3.2]} castShadow receiveShadow />
      {/* 北の低い直線壁 */}
      <mesh material={white} position={[1.15, ROOF_FL + 0.65, -8.3]} castShadow receiveShadow>
        <boxGeometry args={[8.7, 1.3, 0.12]} />
      </mesh>

      {/* スロープ到着点の「額縁」壁(北の風景を切り取る開口) */}
      <group position={[0, 0, -5.75]}>
        <mesh material={white} position={[-3.375, (ROOF_FL + 9.0) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 9.0 - ROOF_FL, 0.25]} />
        </mesh>
        <mesh material={white} position={[-0.925, (ROOF_FL + 9.0) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.65, 9.0 - ROOF_FL, 0.25]} />
        </mesh>
        <mesh material={white} position={[-2.15, (ROOF_FL + 7.3) / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 7.3 - ROOF_FL, 0.25]} />
        </mesh>
        <mesh material={white} position={[-2.15, 8.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.7, 0.25]} />
        </mesh>
      </group>

      {/* 開口まわりのパラペット */}
      <Guard x0={RAMP_X0 - 0.12} x1={RAMP_X0} z0={SLOT_Z0} z1={TERR_Z1} />
      <Guard x0={RAMP_X1} x1={RAMP_X1 + 0.12} z0={SLOT_Z0} z1={TERR_Z0} />
      <Guard x0={RAMP_X1} x1={TERR_X1} z0={TERR_Z0 - 0.12} z1={TERR_Z0} />

      {/* 植栽・点景 */}
      <Planter x={8.6} z={-7.6} w={3.4} d={1.1} />
      <Planter x={-8.9} z={6.2} w={1.1} d={4.2} dark />
      <Planter x={9.7} z={4.6} w={1.2} d={5.6} y={FL1} />
      <Planter x={2.4} z={8.4} w={2.6} d={1.0} y={FL1} dark />

      {/* 空中庭園の白いテーブル */}
      <group position={[4.6, FL1, 7.4]}>
        <mesh material={white} position={[0, 0.72, 0]} castShadow>
          <boxGeometry args={[2.0, 0.09, 0.85]} />
        </mesh>
        {[-0.75, 0.75].map((dx) => (
          <mesh key={dx} material={white} position={[dx, 0.34, 0]} castShadow>
            <boxGeometry args={[0.09, 0.68, 0.7]} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
