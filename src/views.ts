export type ViewKey = 'nw' | 'front' | 'se' | 'terrace' | 'roof' | 'hall' | 'aerial'

type V3 = [number, number, number]

/** カメラプリセット(位置と注視点) */
export const VIEWS: Record<ViewKey, { p: V3; t: V3; label: string }> = {
  nw: { p: [-34, 10.5, -30], t: [0, 4.2, 0], label: '北西外観' },
  front: { p: [-1.5, 3.6, -34], t: [0, 4.6, 0], label: '正面アプローチ' },
  se: { p: [24, 9, 22], t: [0, 4.6, 0], label: '南東(庭側)' },
  terrace: { p: [9.6, 5.6, 8.7], t: [-3.4, 5.4, -2.5], label: '空中庭園' },
  roof: { p: [10.5, 12.5, 11], t: [-3, 6.9, -3.5], label: '屋上ソラリウム' },
  hall: { p: [0.6, 1.7, -14], t: [-2.2, 2.2, 4], label: '玄関ホール' },
  aerial: { p: [-28, 36, -24], t: [0, 0, 1], label: '俯瞰' },
}
