import { useEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CameraControls, Sky } from '@react-three/drei'
import type CameraControlsImpl from 'camera-controls'
import * as THREE from 'three'
import { VillaSavoye } from './villa/VillaSavoye'
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

/** 断面表示(スロープを通る東西方向の切断) */
function SectionPlane({ enabled }: { enabled: boolean }) {
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    gl.clippingPlanes = enabled
      ? [new THREE.Plane(new THREE.Vector3(1, 0, 0), 2.15)]
      : []
    return () => {
      gl.clippingPlanes = []
    }
  }, [gl, enabled])
  return null
}

export default function App() {
  const [view, setView] = useState<ViewKey>('nw')
  const [dims, setDims] = useState(false)
  const [section, setSection] = useState(false)

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        camera={{ position: VIEWS.nw.p, fov: 33, near: 0.3, far: 500 }}
      >
        <Sky
          distance={450000}
          sunPosition={[-6, 5.5, -5.5]}
          turbidity={4.5}
          rayleigh={1.1}
          mieCoefficient={0.004}
          mieDirectionalG={0.75}
        />
        <fog attach="fog" args={['#dce7ee', 75, 210]} />
        <hemisphereLight args={['#dff0fa', '#95a17b', 0.6]} />
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
        <directionalLight position={[20, 14, 22]} intensity={0.55} />

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
        onSection={setSection}
      />
    </div>
  )
}
