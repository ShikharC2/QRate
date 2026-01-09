import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ConfigProvider, theme } from "antd";
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <ConfigProvider
    theme={{algorithm:theme.darkAlgorithm}}>

    <App />

    </ConfigProvider>

)
