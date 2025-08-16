import "./lib/supabase.ts"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import LoadPage from './components/LoadingPage.tsx';
import AuthPage from "./components/AuthPage.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/welcome" element={<LoadPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
