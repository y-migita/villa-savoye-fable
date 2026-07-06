import { Fragment } from 'react'
import {
  FACADE_BOT, FACADE_TOP, SILL, HEAD,
  HALF_W, HALF_D, WALL_T, PIER,
  TERR_X0, TERR_Z0,
} from './dims'
import { white, glass, steel } from './materials'

type Seg = { type: 'solid' | 'glass' | 'open'; from: number; to: number }

const BAND_BOT_H = SILL - FACADE_BOT // 下帯 1.4
const BAND_TOP_H = FACADE_TOP - HEAD // 上帯 1.3
const RIBBON_H = HEAD - SILL // 連続窓 1.2
const MULLION = 0.07

/**
 * 水平連続窓をもつ自由なファサードの 1 面。
 * ローカル +X 方向が壁の長手。segs はローカル X 区間で
 * solid(袖壁)/ glass(ガラス)/ open(空中庭園の無ガラス開口)を指定。
 */
function RibbonWall({
  position, rotationY = 0, length, segs,
}: {
  position: [number, number, number]
  rotationY?: number
  length: number
  segs: Seg[]
}) {
  return (
    <group position={position} rotation-y={rotationY}>
      {/* 下帯・上帯(全長) */}
      <mesh material={white} position={[0, FACADE_BOT + BAND_BOT_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, BAND_BOT_H, WALL_T]} />
      </mesh>
      <mesh material={white} position={[0, HEAD + BAND_TOP_H / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, BAND_TOP_H, WALL_T]} />
      </mesh>
      {segs.map((s, i) => {
        const w = s.to - s.from
        const cx = (s.from + s.to) / 2
        const cy = SILL + RIBBON_H / 2
        if (s.type === 'solid') {
          return (
            <mesh key={i} material={white} position={[cx, cy, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, RIBBON_H, WALL_T]} />
            </mesh>
          )
        }
        if (s.type === 'open') return null
        // glass: ガラス面+上下枠+方立
        const n = Math.max(1, Math.round(w / 1.13))
        const mullions = Array.from({ length: n + 1 }, (_, k) => s.from + (w * k) / n)
        return (
          <Fragment key={i}>
            <mesh material={glass} position={[cx, cy, 0]}>
              <boxGeometry args={[w, RIBBON_H, 0.02]} />
            </mesh>
            <mesh material={steel} position={[cx, SILL + 0.03, 0]} castShadow>
              <boxGeometry args={[w, 0.06, MULLION]} />
            </mesh>
            <mesh material={steel} position={[cx, HEAD - 0.03, 0]} castShadow>
              <boxGeometry args={[w, 0.06, MULLION]} />
            </mesh>
            {mullions.map((mx) => (
              <mesh key={mx} material={steel} position={[mx, cy, 0]} castShadow>
                <boxGeometry args={[MULLION, RIBBON_H, MULLION]} />
              </mesh>
            ))}
          </Fragment>
        )
      })}
    </group>
  )
}

/** 主階の 4 面のファサード */
export function Facade() {
  const sideLen = 2 * (HALF_D - WALL_T) + 0.6 // 東西面は南北壁の内側に納める
  return (
    <group>
      {/* 北面(アプローチ側): 全面ガラスのリボン */}
      <RibbonWall
        position={[0, 0, -HALF_D + WALL_T / 2]}
        length={2 * HALF_W}
        segs={[
          { type: 'solid', from: -HALF_W, to: -HALF_W + PIER },
          { type: 'glass', from: -HALF_W + PIER, to: HALF_W - PIER },
          { type: 'solid', from: HALF_W - PIER, to: HALF_W },
        ]}
      />
      {/* 南面(庭側): 西=サロンのガラス、東=空中庭園の開口 */}
      <RibbonWall
        position={[0, 0, HALF_D - WALL_T / 2]}
        length={2 * HALF_W}
        segs={[
          { type: 'solid', from: -HALF_W, to: -HALF_W + PIER },
          { type: 'glass', from: -HALF_W + PIER, to: TERR_X0 },
          { type: 'solid', from: TERR_X0, to: TERR_X0 + 0.3 },
          { type: 'open', from: TERR_X0 + 0.3, to: HALF_W - PIER },
          { type: 'solid', from: HALF_W - PIER, to: HALF_W },
        ]}
      />
      {/* 西面 */}
      <RibbonWall
        position={[-HALF_W + WALL_T / 2, 0, 0]}
        rotationY={-Math.PI / 2}
        length={sideLen}
        segs={[
          { type: 'solid', from: -sideLen / 2, to: -8.0 },
          { type: 'glass', from: -8.0, to: 8.0 },
          { type: 'solid', from: 8.0, to: sideLen / 2 },
        ]}
      />
      {/* 東面: 北=寝室のガラス、南=空中庭園の開口 */}
      <RibbonWall
        position={[HALF_W - WALL_T / 2, 0, 0]}
        rotationY={-Math.PI / 2}
        length={sideLen}
        segs={[
          { type: 'solid', from: -sideLen / 2, to: -8.0 },
          { type: 'glass', from: -8.0, to: TERR_Z0 - 0.3 },
          { type: 'solid', from: TERR_Z0 - 0.3, to: TERR_Z0 },
          { type: 'open', from: TERR_Z0, to: 8.0 },
          { type: 'solid', from: 8.0, to: sideLen / 2 },
        ]}
      />
    </group>
  )
}
