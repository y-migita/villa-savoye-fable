import { Fragment } from 'react'
import {
  FL1, CEIL1, SILL, HEAD,
  RAMP_X0, RAMP_X1, WELL1_Z0,
  TERR_X0, TERR_Z0, TERR_Z1,
} from './dims'
import { glass, steel, innerWhite } from './materials'

/** 空中庭園の北壁: 白い腰壁+横長ガラス帯+スロープ脇の全面ガラス戸 */
function TerraceNorthWall() {
  const z = TERR_Z0
  const x1 = 10.45
  const doorEnd = 0.7 // ガラス戸ゾーンの東端
  const ribbonW = x1 - doorEnd
  const n = Math.round(ribbonW / 1.4)
  return (
    <group>
      {/* ガラス戸ゾーン(スロープ脇) */}
      <mesh material={glass} position={[(RAMP_X1 + doorEnd) / 2, (FL1 + HEAD) / 2, z]}>
        <boxGeometry args={[doorEnd - RAMP_X1, HEAD - FL1, 0.04]} />
      </mesh>
      {[RAMP_X1, -0.1, doorEnd].map((x) => (
        <mesh key={x} material={steel} position={[x, (FL1 + HEAD) / 2, z]} castShadow>
          <boxGeometry args={[0.08, HEAD - FL1, 0.09]} />
        </mesh>
      ))}
      <mesh material={steel} position={[(RAMP_X1 + doorEnd) / 2, HEAD - 0.04, z]}>
        <boxGeometry args={[doorEnd - RAMP_X1, 0.08, 0.09]} />
      </mesh>
      {/* 腰壁 */}
      <mesh material={innerWhite} position={[(doorEnd + x1) / 2, (FL1 + SILL) / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[x1 - doorEnd, SILL - FL1, 0.12]} />
      </mesh>
      {/* ガラス帯 */}
      <mesh material={glass} position={[(doorEnd + x1) / 2, (SILL + HEAD) / 2, z]}>
        <boxGeometry args={[ribbonW, HEAD - SILL, 0.03]} />
      </mesh>
      {[0.03, -0.03].map((dy, i) => (
        <mesh key={i} material={steel} position={[(doorEnd + x1) / 2, i === 0 ? SILL + dy : HEAD + dy, z]}>
          <boxGeometry args={[ribbonW, 0.06, 0.07]} />
        </mesh>
      ))}
      {Array.from({ length: n + 1 }, (_, k) => (
        <mesh key={k} material={steel} position={[doorEnd + (ribbonW * k) / n, (SILL + HEAD) / 2, z]}>
          <boxGeometry args={[0.06, HEAD - SILL, 0.07]} />
        </mesh>
      ))}
      {/* 上部の垂れ壁 */}
      <mesh material={innerWhite} position={[(RAMP_X1 + x1) / 2, (HEAD + CEIL1) / 2, z]} castShadow receiveShadow>
        <boxGeometry args={[x1 - RAMP_X1, CEIL1 - HEAD, 0.12]} />
      </mesh>
    </group>
  )
}

const H = CEIL1 - FL1 // 2.85 内法

function Partition({
  x0, x1, z0, z1,
}: { x0: number; x1: number; z0: number; z1: number }) {
  return (
    <mesh
      material={innerWhite}
      position={[(x0 + x1) / 2, FL1 + H / 2, (z0 + z1) / 2]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[Math.max(x1 - x0, 0.12), H, Math.max(z1 - z0, 0.12)]} />
    </mesh>
  )
}

/** 主階の内部: サロンの大ガラス壁と主要な間仕切り(自由な平面) */
export function Interior() {
  const n = 5
  const w = (TERR_Z1 - TERR_Z0) / n
  return (
    <group>
      {/* サロンと空中庭園を隔てる全面ガラスの引き壁 */}
      <mesh material={glass} position={[TERR_X0, FL1 + H / 2, (TERR_Z0 + TERR_Z1) / 2]}>
        <boxGeometry args={[0.04, H, TERR_Z1 - TERR_Z0]} />
      </mesh>
      {Array.from({ length: n + 1 }, (_, k) => (
        <Fragment key={k}>
          <mesh material={steel} position={[TERR_X0, FL1 + H / 2, TERR_Z0 + k * w]} castShadow>
            <boxGeometry args={[0.09, H, 0.08]} />
          </mesh>
        </Fragment>
      ))}
      <mesh material={steel} position={[TERR_X0, FL1 + 0.04, (TERR_Z0 + TERR_Z1) / 2]}>
        <boxGeometry args={[0.09, 0.08, TERR_Z1 - TERR_Z0]} />
      </mesh>
      <mesh material={steel} position={[TERR_X0, CEIL1 - 0.04, (TERR_Z0 + TERR_Z1) / 2]}>
        <boxGeometry args={[0.09, 0.08, TERR_Z1 - TERR_Z0]} />
      </mesh>

      {/* 寝室ゾーンとの境界壁(スロープスロットで途切れる) */}
      <Partition x0={-10.45} x1={RAMP_X0} z0={TERR_Z0 - 0.06} z1={TERR_Z0 + 0.06} />
      {/* 空中庭園の北壁: 寝室側にも横長のガラス帯と出入口(実物準拠) */}
      <TerraceNorthWall />
      {/* スロープの吹抜けを挟む壁 */}
      <Partition x0={RAMP_X0 - 0.12} x1={RAMP_X0} z0={WELL1_Z0} z1={TERR_Z0} />
      <Partition x0={RAMP_X1} x1={RAMP_X1 + 0.12} z0={WELL1_Z0} z1={TERR_Z0} />
      {/* 北側ゾーンの間仕切り(示唆程度) */}
      <Partition x0={2.95} x1={3.05} z0={-9.2} z1={TERR_Z0} />
      <Partition x0={3.05} x1={10.45} z0={-3.55} z1={-3.45} />
    </group>
  )
}
