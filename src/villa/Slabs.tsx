import { useMemo } from 'react'
import {
  FACADE_BOT, FL1, CEIL1, ROOF_FL,
  HALF_W, HALF_D,
  RAMP_X0, RAMP_X1, WELL1_Z0, WELL1_Z1,
  TERR_X1, TERR_Z0, TERR_Z1, SLOT_Z0,
  STAIR_X, STAIR_Z, STAIR_WELL_R,
} from './dims'
import { white } from './materials'
import { extrudePlan, circle, type P } from './util'

const E = 0.02 // 外壁面との Z ファイティング回避のための逃げ

/** 主階床スラブ(スロープ吹抜けと螺旋階段の開口を持つ) */
export function FirstFloorSlab() {
  const geo = useMemo(() => {
    const w = HALF_W - E
    const d = HALF_D - E
    const outer: P[] = [[-w, -d], [w, -d], [w, d], [-w, d]]
    const rampWell: P[] = [
      [RAMP_X0, WELL1_Z0], [RAMP_X1, WELL1_Z0],
      [RAMP_X1, WELL1_Z1], [RAMP_X0, WELL1_Z1],
    ]
    return extrudePlan(outer, [rampWell, circle(STAIR_X, STAIR_Z, STAIR_WELL_R)], FL1 - FACADE_BOT)
  }, [])
  return <mesh geometry={geo} material={white} position={[0, FACADE_BOT, 0]} castShadow receiveShadow />
}

/** 屋上スラブ(空中庭園+スロープスロットの L 字開口、階段開口) */
export function RoofSlab() {
  const geo = useMemo(() => {
    const w = HALF_W - E
    const d = HALF_D - E
    const outer: P[] = [[-w, -d], [w, -d], [w, d], [-w, d]]
    // 空中庭園とスロープスロットの合成 L 字
    const lVoid: P[] = [
      [RAMP_X0, SLOT_Z0], [RAMP_X1, SLOT_Z0],
      [RAMP_X1, TERR_Z0], [TERR_X1, TERR_Z0],
      [TERR_X1, TERR_Z1], [RAMP_X0, TERR_Z1],
    ]
    return extrudePlan(outer, [lVoid, circle(STAIR_X, STAIR_Z, STAIR_WELL_R)], ROOF_FL - CEIL1)
  }, [])
  return <mesh geometry={geo} material={white} position={[0, CEIL1, 0]} castShadow receiveShadow />
}
