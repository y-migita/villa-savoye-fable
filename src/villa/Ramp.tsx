import {
  FL1, ROOF_FL,
  RAMP_X0, RAMP_X1,
  RAMP_START_Z, RAMP_TURN_Z, RAMP_LAND_Z, RAMP_ARRIVE_Z,
} from './dims'
import { white, steel } from './materials'

// 2 レーン(上りと折返し)
const LANE_W: [number, number] = [RAMP_X0, RAMP_X0 + 1.2] // 西レーン
const LANE_E: [number, number] = [RAMP_X1 - 1.2, RAMP_X1] // 東レーン

/** 勾配床(z0→z1 で y0→y1 に上がる斜めの板) */
function Flight({
  x0, x1, z0, z1, y0, y1, t = 0.15,
}: {
  x0: number; x1: number; z0: number; z1: number; y0: number; y1: number; t?: number
}) {
  const run = z1 - z0
  const rise = y1 - y0
  const len = Math.hypot(run, rise)
  const angle = -Math.atan2(rise, run)
  return (
    <mesh
      material={white}
      position={[(x0 + x1) / 2, (y0 + y1) / 2 - t / 2, (z0 + z1) / 2]}
      rotation-x={angle}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[x1 - x0, t, len]} />
    </mesh>
  )
}

/** 勾配に沿う手すりパイプ */
function Pipe({
  x, z0, z1, y0, y1, r = 0.03,
}: {
  x: number; z0: number; z1: number; y0: number; y1: number; r?: number
}) {
  const run = z1 - z0
  const rise = y1 - y0
  const len = Math.hypot(run, rise)
  const angle = Math.atan2(run, rise)
  return (
    <mesh
      material={steel}
      position={[x, (y0 + y1) / 2, (z0 + z1) / 2]}
      rotation-x={angle}
      castShadow
    >
      <cylinderGeometry args={[r, r, len, 10]} />
    </mesh>
  )
}

/** 勾配に沿う立上り壁(屋外スロープのパラペット) */
function Parapet({
  x, z0, z1, y0, y1, h = 1.0, t = 0.12,
}: {
  x: number; z0: number; z1: number; y0: number; y1: number; h?: number; t?: number
}) {
  const run = z1 - z0
  const rise = y1 - y0
  const len = Math.hypot(run, rise)
  const angle = -Math.atan2(rise, run)
  return (
    <mesh
      material={white}
      position={[x, (y0 + y1) / 2 + h / 2 - 0.05, (z0 + z1) / 2]}
      rotation-x={angle}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[t, h, len]} />
    </mesh>
  )
}

const GF_Y = 0.15
const MID_I = (GF_Y + FL1) / 2 // 1.75
const MID_E = (FL1 + ROOF_FL) / 2 // 4.95

/**
 * 建築的プロムナードの核: 中央スロープ。
 * 屋内 2 フライトで主階へ、屋外 2 フライトで屋上庭園へ。
 */
export function Ramp() {
  return (
    <group>
      {/* --- 屋内(1階 → 主階) --- */}
      <Flight x0={LANE_W[0]} x1={LANE_W[1]} z0={RAMP_START_Z} z1={RAMP_TURN_Z} y0={GF_Y} y1={MID_I} />
      <mesh material={white} position={[(RAMP_X0 + RAMP_X1) / 2, MID_I - 0.075, (RAMP_TURN_Z + RAMP_LAND_Z) / 2]} castShadow receiveShadow>
        <boxGeometry args={[RAMP_X1 - RAMP_X0, 0.15, RAMP_LAND_Z - RAMP_TURN_Z]} />
      </mesh>
      <Flight x0={LANE_E[0]} x1={LANE_E[1]} z0={RAMP_TURN_Z} z1={RAMP_ARRIVE_Z} y0={MID_I} y1={FL1} />
      {/* 玄関ホール側の上がり框 */}
      <mesh material={white} position={[(LANE_W[0] + LANE_W[1]) / 2, GF_Y / 2, RAMP_START_Z - 0.25]} receiveShadow>
        <boxGeometry args={[1.2, GF_Y, 0.5]} />
      </mesh>
      {/* 屋内手すり */}
      <Pipe x={LANE_W[0] + 0.06} z0={RAMP_START_Z} z1={RAMP_TURN_Z} y0={GF_Y + 0.9} y1={MID_I + 0.9} />
      <Pipe x={LANE_W[1] - 0.04} z0={RAMP_START_Z} z1={RAMP_TURN_Z} y0={GF_Y + 0.9} y1={MID_I + 0.9} />
      <Pipe x={LANE_E[0] + 0.04} z0={RAMP_TURN_Z} z1={RAMP_ARRIVE_Z} y0={MID_I + 0.9} y1={FL1 + 0.9} />
      <Pipe x={LANE_E[1] - 0.06} z0={RAMP_TURN_Z} z1={RAMP_ARRIVE_Z} y0={MID_I + 0.9} y1={FL1 + 0.9} />

      {/* --- 屋外(主階 → 屋上) --- */}
      <Flight x0={LANE_W[0]} x1={LANE_W[1]} z0={RAMP_START_Z} z1={RAMP_TURN_Z} y0={FL1} y1={MID_E} />
      <mesh material={white} position={[(RAMP_X0 + RAMP_X1) / 2, MID_E - 0.075, (RAMP_TURN_Z + RAMP_LAND_Z) / 2]} castShadow receiveShadow>
        <boxGeometry args={[RAMP_X1 - RAMP_X0, 0.15, RAMP_LAND_Z - RAMP_TURN_Z]} />
      </mesh>
      <Flight x0={LANE_E[0]} x1={LANE_E[1]} z0={RAMP_TURN_Z} z1={RAMP_ARRIVE_Z} y0={MID_E} y1={ROOF_FL} />

      {/* 屋外パラペット(白い立上り) */}
      <Parapet x={LANE_W[0] + 0.06} z0={RAMP_START_Z} z1={RAMP_TURN_Z} y0={FL1} y1={MID_E} />
      <Parapet x={LANE_W[1] - 0.06} z0={RAMP_START_Z} z1={RAMP_TURN_Z} y0={FL1} y1={MID_E} />
      <Parapet x={LANE_E[0] + 0.06} z0={RAMP_TURN_Z} z1={RAMP_ARRIVE_Z} y0={MID_E} y1={ROOF_FL} />
      <Parapet x={LANE_E[1] - 0.06} z0={RAMP_TURN_Z} z1={RAMP_ARRIVE_Z} y0={MID_E} y1={ROOF_FL} />
      {/* 踊り場まわりのパラペット */}
      <mesh material={white} position={[(RAMP_X0 + RAMP_X1) / 2, MID_E + 0.45, RAMP_LAND_Z - 0.06]} castShadow>
        <boxGeometry args={[RAMP_X1 - RAMP_X0, 1.0, 0.12]} />
      </mesh>
      <mesh material={white} position={[RAMP_X0 + 0.06, MID_E + 0.45, (RAMP_TURN_Z + RAMP_LAND_Z) / 2]} castShadow>
        <boxGeometry args={[0.12, 1.0, RAMP_LAND_Z - RAMP_TURN_Z]} />
      </mesh>
      <mesh material={white} position={[RAMP_X1 - 0.06, MID_E + 0.45, (RAMP_TURN_Z + RAMP_LAND_Z) / 2]} castShadow>
        <boxGeometry args={[0.12, 1.0, RAMP_LAND_Z - RAMP_TURN_Z]} />
      </mesh>
    </group>
  )
}
