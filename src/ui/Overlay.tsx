import type { ViewKey } from '../views'
import { VIEWS } from '../views'

export function Overlay({
  view, onView, dims, onDims, section, onSection,
}: {
  view: ViewKey
  onView: (v: ViewKey) => void
  dims: boolean
  onDims: (v: boolean) => void
  section: boolean
  onSection: (v: boolean) => void
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 select-none">
      {/* タイトルと操作パネル */}
      <div className="pointer-events-auto absolute left-4 top-4 w-[19rem] rounded-2xl bg-white/85 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur-md">
        <p className="text-[10px] font-medium tracking-[0.28em] text-neutral-500">
          LE CORBUSIER · 1928–1931 · POISSY
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-neutral-900">
          サヴォア邸{' '}
          <span className="text-sm font-normal text-neutral-500">Villa Savoye</span>
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-neutral-600">
          ピロティに浮かぶ白い箱。柱スパン 4.75 m、主階 21.5 × 19.0 m。
          「近代建築の五原則」を最も純粋に体現した週末住宅。
        </p>

        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {(Object.keys(VIEWS) as ViewKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onView(k)}
              className={`rounded-lg px-2 py-1.5 text-xs font-medium transition ${
                view === k
                  ? 'bg-neutral-900 text-white shadow'
                  : 'bg-white/70 text-neutral-700 ring-1 ring-neutral-300 hover:bg-white'
              }`}
            >
              {VIEWS[k].label}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onDims(!dims)}
            aria-pressed={dims}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              dims
                ? 'bg-sky-700 text-white shadow'
                : 'bg-white/70 text-neutral-700 ring-1 ring-neutral-300 hover:bg-white'
            }`}
          >
            寸法 {dims ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => onSection(!section)}
            aria-pressed={section}
            className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              section
                ? 'bg-rose-700 text-white shadow'
                : 'bg-white/70 text-neutral-700 ring-1 ring-neutral-300 hover:bg-white'
            }`}
          >
            断面 {section ? 'ON' : 'OFF'}
          </button>
        </div>

        <details className="mt-3 text-xs text-neutral-700">
          <summary className="cursor-pointer font-semibold text-neutral-800">
            近代建築の五原則
          </summary>
          <ol className="mt-1.5 list-decimal space-y-1 pl-4 leading-relaxed">
            <li><b>ピロティ</b> — 細い円柱が主階を大地から持ち上げる</li>
            <li><b>屋上庭園</b> — 奪われた大地を屋根の上に取り戻す</li>
            <li><b>自由な平面</b> — 構造から解放された間仕切り</li>
            <li><b>水平連続窓</b> — 四周をめぐる帯状の窓</li>
            <li><b>自由な立面</b> — 持ち出しスラブがつくる薄い皮膜</li>
          </ol>
        </details>
      </div>

      {/* 操作ヒント */}
      <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/55 px-4 py-1.5 text-[11px] text-white/90 backdrop-blur">
        ドラッグ: 回転 · ホイール: ズーム · 右ドラッグ: 移動
      </div>
    </div>
  )
}
