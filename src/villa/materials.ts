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
  color: '#39482f',
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
  color: '#e8d9cd',
  roughness: 0.92,
  side: THREE.DoubleSide,
})

// 屋上曲壁の淡いブルーグレー
export const blueGray = new THREE.MeshStandardMaterial({
  color: '#d7dfe3',
  roughness: 0.92,
  side: THREE.DoubleSide,
})

// 芝生
export const grass = new THREE.MeshStandardMaterial({
  color: '#77955a',
  roughness: 1,
})

// 砂利敷きの車路
export const gravel = new THREE.MeshStandardMaterial({
  color: '#c6bfae',
  roughness: 1,
})

// 樹木
export const trunk = new THREE.MeshStandardMaterial({ color: '#5d4a38', roughness: 1 })
export const leaf = new THREE.MeshStandardMaterial({ color: '#4d6b3c', roughness: 1 })
export const leaf2 = new THREE.MeshStandardMaterial({ color: '#5e7d46', roughness: 1 })
