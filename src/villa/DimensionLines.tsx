import { Line, Html } from '@react-three/drei'
import { HALF_W, HALF_D, FACADE_BOT, FACADE_TOP, SOL_TOP } from './dims'

const C = '#3a4148'
const C2 = '#8a949c'

function Chip({ pos, text, small = false }: { pos: [number, number, number]; text: string; small?: boolean }) {
  return (
    <Html position={pos} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`dim-chip ${small ? 'dim-chip-sm' : ''}`}>{text}</div>
    </Html>
  )
}

/** 実測寸法の表示(トグル) */
export function DimensionLines() {
  const y = 0.06
  const bays = [-HALF_W, -HALF_W + 1.25, -4.75, 0, 4.75, HALF_W - 1.25, HALF_W]
  return (
    <group>
      {/* ---- 全幅 21.50 m(北側) ---- */}
      <Line points={[[-HALF_W, y, -13.5], [HALF_W, y, -13.5]]} color={C} lineWidth={1.5} />
      {[-HALF_W, HALF_W].map((x) => (
        <Line key={x} points={[[x, y, -9.7], [x, y, -13.9]]} color={C2} lineWidth={1} />
      ))}
      {bays.slice(1, -1).map((x) => (
        <Line key={x} points={[[x, y, -13.1], [x, y, -13.9]]} color={C2} lineWidth={1} />
      ))}
      <Chip pos={[0, y, -14.6]} text="21.50 m" />
      <Chip pos={[-7.125, y, -12.35]} text="4.75" small />
      <Chip pos={[-2.375, y, -12.35]} text="4.75" small />

      {/* ---- 奥行 19.00 m(西側) ---- */}
      <Line points={[[-14.5, y, -HALF_D], [-14.5, y, HALF_D]]} color={C} lineWidth={1.5} />
      {[-HALF_D, HALF_D].map((z) => (
        <Line key={z} points={[[-11.0, y, z], [-14.9, y, z]]} color={C2} lineWidth={1} />
      ))}
      <Chip pos={[-15.6, y, 0]} text="19.00 m" />

      {/* ---- 高さ(北西隅) ---- */}
      <Line points={[[-13.2, 0, -HALF_D], [-13.2, SOL_TOP, -HALF_D]]} color={C} lineWidth={1.5} />
      {[0, FACADE_BOT, FACADE_TOP, SOL_TOP].map((h) => (
        <Line key={h} points={[[-11.0, h, -HALF_D], [-13.6, h, -HALF_D]]} color={C2} lineWidth={1} />
      ))}
      <Chip pos={[-13.2, FACADE_BOT / 2, -HALF_D]} text="3.00" small />
      <Chip pos={[-13.2, (FACADE_BOT + FACADE_TOP) / 2, -HALF_D]} text="3.90" small />
      <Chip pos={[-13.2, (FACADE_TOP + SOL_TOP) / 2, -HALF_D]} text="2.40" small />
      <Chip pos={[-13.2, SOL_TOP + 0.7, -HALF_D]} text="▲ 最高部 9.30 m" />
    </group>
  )
}
