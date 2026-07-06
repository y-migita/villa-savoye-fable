/**
 * サヴォア邸 寸法定数(単位: m)
 *
 * 出典とする実測値:
 * - 構造グリッド(柱スパン): 4.75 m
 * - 主階平面: 約 21.5 m × 19.0 m(長手方向は両側 1.25 m の持ち出し)
 * - ピロティ内法: 約 3.0 m、全高: 約 9.4 m
 * - 水平連続窓(fenêtre en longueur)の帯高: 約 1.2 m
 */

// ---- 平面 ----
export const BAY = 4.75 // 柱スパン
export const N_BAY = 4 // 4×4 スパン
export const CANT = 1.25 // 長手(X)方向の持ち出し
export const BOX_W = BAY * N_BAY + CANT * 2 // 21.5  X方向(東西)
export const BOX_D = BAY * N_BAY // 19.0  Z方向(南北)
export const HALF_W = BOX_W / 2 // 10.75
export const HALF_D = BOX_D / 2 // 9.5

export const WALL_T = 0.3 // 外壁厚
export const PIER = 1.5 // 連続窓の両端に残る袖壁幅

// ---- 高さ ----
export const COL_R = 0.145 // ピロティ柱半径(φ290)
export const FACADE_BOT = 3.0 // 箱の下端(=1階スラブ底、ピロティ内法)
export const FL1 = 3.35 // 主階 FL
export const SILL = 4.4 // 連続窓 下端
export const HEAD = 5.6 // 連続窓 上端
export const CEIL1 = 6.2 // 主階天井(=屋上スラブ底)
export const ROOF_FL = 6.55 // 屋上 FL
export const FACADE_TOP = 6.9 // 箱の上端(屋上パラペット)
export const SOL_TOP = 9.3 // ソラリウム曲壁 頂部(建物最高部)

// ---- 1階(ピロティ階)ボリューム ----
export const GF_HALF_W = 4.75 // 曲面ガラスの半径 = 中央2スパンの半分
export const GF_CURVE_ZC = -2.25 // 曲面の中心 Z
export const GF_APEX_Z = GF_CURVE_ZC - GF_HALF_W // -7.0 曲面頂点(北端)
export const GF_SOUTH_Z = 8.3 // 直線部 南端(南面から1.2mセットバック)
export const GF_WALL_H = FACADE_BOT // 1階壁の高さ

// ---- 中央スロープ(幅 2.5m の直進×折返し) ----
export const RAMP_X0 = -3.4
export const RAMP_X1 = -0.9
export const RAMP_W = RAMP_X1 - RAMP_X0 // 2.5
export const RAMP_START_Z = -6.0 // 各フライトの北端
export const RAMP_TURN_Z = 3.4 // 各フライトの南端(踊り場手前)
export const RAMP_LAND_Z = 4.4 // 踊り場 南端
export const RAMP_RISE = (FL1 - 0.15) / 2 // 1フライトの上昇 1.6
export const WELL1_Z0 = -5.0 // 1階スラブの吹抜け(北端)
export const WELL1_Z1 = RAMP_LAND_Z // 同(南端)
export const RAMP_ARRIVE_Z = -5.0 // 屋上到着位置

// ---- 屋上の開口(空中庭園+スロープスロット) ----
export const TERR_X0 = -0.9 // 空中庭園 西端(サロンのガラス壁)
export const TERR_X1 = HALF_W - WALL_T // 10.45 東端(外壁内面)
export const TERR_Z0 = 0.9 // 北端(寝室ゾーン壁)
export const TERR_Z1 = HALF_D - WALL_T // 9.2 南端(外壁内面)
export const SLOT_Z0 = RAMP_ARRIVE_Z // スロープ上部スロット 北端
export const SLOT_Z1 = TERR_Z1 // 同 南端

// ---- 螺旋階段 ----
export const STAIR_X = -5.6
export const STAIR_Z = -3.0
export const STAIR_R = 1.05 // 段の半径
export const STAIR_WELL_R = 1.2 // 床開口の半径
