import * as THREE from 'three'

export type P = [number, number] // 平面座標 (x, z)

/** 平面ポリゴン(+開口)を厚み t で +Y 方向に押し出すジオメトリ */
export function extrudePlan(outer: P[], holes: P[][], t: number) {
  const shape = new THREE.Shape(outer.map(([x, z]) => new THREE.Vector2(x, -z)))
  for (const h of holes) {
    shape.holes.push(new THREE.Path(h.map(([x, z]) => new THREE.Vector2(x, -z))))
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: false })
  geo.rotateX(-Math.PI / 2) // shape Y → ワールド -Z、押し出し → +Y
  return geo
}

export function circle(cx: number, cz: number, r: number, n = 32): P[] {
  const pts: P[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([cx + r * Math.cos(a), cz + r * Math.sin(a)])
  }
  return pts
}

/**
 * 円弧壁(平面上の中心角 a0→a1、半径 r、厚 t、高さ h)。
 * 平面角の規約: a=0 → +X、a=π/2 → +Z。
 */
export function arcWallGeo(r: number, t: number, a0: number, a1: number, h: number, n = 40) {
  const outer: P[] = []
  const inner: P[] = []
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n
    outer.push([(r + t / 2) * Math.cos(a), (r + t / 2) * Math.sin(a)])
    inner.push([(r - t / 2) * Math.cos(a), (r - t / 2) * Math.sin(a)])
  }
  inner.reverse()
  return extrudePlan([...outer, ...inner], [], h)
}
