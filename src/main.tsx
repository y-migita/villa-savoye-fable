import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// NOTE: StrictMode の二重マウントが WebGL キャンバスの初期描画を
// 不安定にするため、このアプリでは使わない。
createRoot(document.getElementById('root')!).render(<App />)
