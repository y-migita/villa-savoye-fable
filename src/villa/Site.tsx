import { useMemo } from 'react'
import { GF_CURVE_ZC } from './dims'
import { grass, gravel, trunk, leaf, leaf2 } from './materials'
import { extrudePlan, type P } from './util'

/** 決定的な擬似乱数(コミットごとに絵が変わらないように) */
function rnd(i: number, salt: number) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function Tree({ x, z, s, kind }: { x: number; z: number; s: number; kind: number }) {
  if (kind === 0) {
    // 針葉樹
    return (
      <group position={[x, 0, z]} scale={s}>
        <mesh material={trunk} position={[0, 1.2, 0]} castShadow>
          <cylinderGeometry args={[0.14, 0.2, 2.4, 8]} />
        </mesh>
        <mesh material={leaf} position={[0, 4.4, 0]} castShadow>
          <coneGeometry args={[1.7, 6.4, 10]} />
        </mesh>
      </group>
    )
  }
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh material={trunk} position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 3.0, 8]} />
      </mesh>
      <mesh material={kind === 1 ? leaf : leaf2} position={[0, 4.3, 0]} castShadow>
        <sphereGeometry args={[2.1, 12, 10]} />
      </mesh>
      <mesh material={leaf2} position={[1.1, 3.4, 0.5]} castShadow>
        <sphereGeometry args={[1.3, 10, 8]} />
      </mesh>
    </group>
  )
}

/** ポワシーの敷地: 芝生の台地、砂利の車回し、外周の並木 */
export function Site() {
  // 建物下をまわる車回し(1階の曲面に沿うスタジアム形)
  const apronGeo = useMemo(() => {
    const R = 7.75
    const pts: P[] = []
    for (let i = 0; i <= 40; i++) {
      const th = Math.PI / 2 + (Math.PI * i) / 40
      pts.push([R * Math.sin(th), GF_CURVE_ZC + R * Math.cos(th)])
    }
    pts.push([-R, 12.0], [R, 12.0])
    return extrudePlan(pts, [], 0.02)
  }, [])

  const trees = useMemo(() => {
    const arr: { x: number; z: number; s: number; kind: number }[] = []
    const N = 30
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + rnd(i, 1) * 0.18
      // 北のアプローチ軸は空けておく
      const north = Math.abs(((a + Math.PI / 2) % (Math.PI * 2)) - Math.PI)
      if (north > Math.PI - 0.42) continue
      const r = 40 + rnd(i, 2) * 18
      arr.push({
        x: r * Math.cos(a),
        z: r * Math.sin(a),
        s: 0.8 + rnd(i, 3) * 0.7,
        kind: i % 3,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* 芝生 */}
      <mesh material={grass} rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[95, 64]} />
      </mesh>
      {/* 車回し */}
      <mesh geometry={apronGeo} material={gravel} position={[0, 0.004, 0]} receiveShadow />
      {/* 北からのアプローチ道 */}
      <mesh material={gravel} rotation-x={-Math.PI / 2} position={[0, 0.012, -35]} receiveShadow>
        <planeGeometry args={[4.6, 52]} />
      </mesh>
      {/* 並木 */}
      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
    </group>
  )
}
