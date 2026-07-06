import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import * as THREE from 'three'
import { VillaSavoye } from './villa/VillaSavoye'
import { buildingMaterials } from './villa/materials'
import { Site } from './villa/Site'
import { DimensionLines } from './villa/DimensionLines'
import { Overlay } from './ui/Overlay'
import { VIEWS, type ViewKey } from './views'

/** カメラプリセットへの滑らかな移動 */
function CameraRig({ view }: { view: ViewKey }) {
  const ref = useRef<CameraControlsImpl | null>(null)
  useEffect(() => {
    const v = VIEWS[view]
    ref.current?.setLookAt(v.p[0], v.p[1], v.p[2], v.t[0], v.t[1], v.t[2], true)
  }, [view])
  return (
    <CameraControls
      ref={ref}
      makeDefault
      smoothTime={0.4}
      minDistance={1.2}
      maxDistance={150}
      maxPolarAngle={1.72}
    />
  )
}

/** 断面表示(スロープを通る南北方向の切断)— 建物のマテリアルのみに適用 */
const sectionPlanes = [new THREE.Plane(new THREE.Vector3(1, 0, 0), 2.15)]

function SectionPlane({ enabled }: { enabled: boolean }) {
  const gl = useThree((s) => s.gl)
  // エフェクトのタイミングに依存すると描画エンジン側の再コンパイルと
  // 競合することがあるため、毎フレーム目標状態を保証する
  useFrame(() => {
    gl.localClippingEnabled = true
    const want = enabled ? sectionPlanes : null
    if (buildingMaterials[0].clippingPlanes !== want) {
      for (const m of buildingMaterials) {
        m.clippingPlanes = want
        m.needsUpdate = true
      }
    }
  })
  useEffect(() => {
    return () => {
      for (const m of buildingMaterials) m.clippingPlanes = null
    }
  }, [])
  return null
}

export default function App() {
  const [view, setView] = useState<ViewKey>('nw')
  const [dims, setDims] = useState(false)
  const [section, setSection] = useState(false)

  // 環境によって初回マウント時に ResizeObserver が発火せず
  // Canvas の子がマウントされないことがあるため、明示的に再計測させる
  useEffect(() => {
    const kick = () => window.dispatchEvent(new Event('resize'))
    const t1 = setTimeout(kick, 50)
    const t2 = setTimeout(kick, 400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    // CSS 読込みと初期計測の競合を避けるため、インラインでサイズを確定させる
    <div style={{ position: 'fixed', inset: 0 }}>
      <Canvas
        shadows
        resize={{ debounce: 0 }}
        camera={{ position: VIEWS.nw.p, fov: 33, near: 0.3, far: 500 }}
      >
        <color attach="background" args={['#cfe0eb']} />
        <fog attach="fog" args={['#dce7ee', 75, 210]} />
        <hemisphereLight args={['#e6f0f7', '#b0b0a8', 0.85]} />
        <directionalLight
          position={[-26, 36, -26]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-34}
          shadow-camera-right={34}
          shadow-camera-top={34}
          shadow-camera-bottom={-34}
          shadow-camera-near={2}
          shadow-camera-far={120}
          shadow-bias={-0.0003}
          shadow-normalBias={0.03}
        />
        <directionalLight position={[20, 14, 22]} intensity={0.7} />

        <Site />
        <VillaSavoye />
        {dims && <DimensionLines />}
        <SectionPlane enabled={section} />
        <CameraRig view={view} />
      </Canvas>

      <Overlay
        view={view}
        onView={setView}
        dims={dims}
        onDims={setDims}
        section={section}
        onSection={(v) => {
          setSection(v)
          // 切断面は西向きなので、ON にしたら切り口の見える視点へ
          if (v) setView('nw')
        }}
      />
    </div>
  )
}
