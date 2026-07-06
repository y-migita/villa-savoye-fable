import * as THREE from 'three'

/** 共有マテリアル(全ジオメトリで使い回す) */

// 白い漆喰(躯体・ファサード)
export const white = new THREE.MeshStandardMaterial({
  color: '#f2f1ea',
  roughness: 0.92,
  side: THREE.DoubleSide,
})

// 1階の濃緑(ピロティ階の壁 — 芝生の影に溶けるための色)
export const green = new THREE.MeshStandardMaterial({
  color: '#4b5c40',
  roughness: 0.9,
  side: THREE.DoubleSide,
})

// サッシ・建具の濃色スチール
export const steel = new THREE.MeshStandardMaterial({
  color: '#22262a',
  roughness: 0.55,
  metalness: 0.35,
})

// ガラス
export const glass = new THREE.MeshPhysicalMaterial({
  color: '#a8c4cc',
  roughness: 0.12,
  metalness: 0,
  transparent: true,
  opacity: 0.32,
  side: THREE.DoubleSide,
  depthWrite: false,
})

// 内装の白
export const innerWhite = new THREE.MeshStandardMaterial({
  color: '#f7f6f0',
  roughness: 0.95,
  side: THREE.DoubleSide,
})

// 床・デッキ(明るいグレーのタイル)
export const deck = new THREE.MeshStandardMaterial({
  color: '#cfcdc2',
  roughness: 0.95,
})

// 屋上曲壁の淡いロゼ(歴史的ポリクロミーの名残)
export const rose = new THREE.MeshStandardMaterial({
  color: '#ede6dd',
  roughness: 0.92,
  side: THREE.DoubleSide,
})

// 屋上曲壁の淡いブルーグレー
export const blueGray = new THREE.MeshStandardMaterial({
  color: '#d7dfe3',
  roughness: 0.92,
  side: THREE.DoubleSide,
})

/** 決定的な乱数によるまだら模様の CanvasTexture(芝・砂利の質感) */
function noiseTexture(base: string, dots: string[], repeat: number, density = 1600) {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.fillStyle = base
  g.fillRect(0, 0, size, size)
  let s = 42
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < density; i++) {
    g.fillStyle = dots[i % dots.length]
    g.globalAlpha = 0.14 + rnd() * 0.22
    const r = 0.8 + rnd() * 2.2
    g.beginPath()
    g.arc(rnd() * size, rnd() * size, r, 0, Math.PI * 2)
    g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.repeat.set(repeat, repeat)
  return t
}

// 芝生
export const grass = new THREE.MeshStandardMaterial({
  map: noiseTexture('#7d9a62', ['#6a8a50', '#8fa96f', '#5d7c46', '#87a468'], 60),
  roughness: 1,
})

// 砂利敷きの車路
export const gravel = new THREE.MeshStandardMaterial({
  map: noiseTexture('#c8c1b0', ['#b7b0a0', '#d6cfbf', '#a9a294', '#cfc9b9'], 24, 2400),
  roughness: 1,
})

// 樹木
export const trunk = new THREE.MeshStandardMaterial({ color: '#5d4a38', roughness: 1 })
export const leaf = new THREE.MeshStandardMaterial({ color: '#4d6b3c', roughness: 1 })
export const leaf2 = new THREE.MeshStandardMaterial({ color: '#5e7d46', roughness: 1 })

/** 断面表示の対象になる建物側のマテリアル */
export const buildingMaterials = [
  white, green, steel, glass, innerWhite, deck, rose, blueGray,
]
