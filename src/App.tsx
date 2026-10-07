import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import Semana from './pages/Home/Semana.tsx'
import Hora from './pages/Home/Hora.tsx'
import Maps from './pages/Home/Mapa.tsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/semana" element={<Semana />} />
          <Route path="/hora" element={<Hora />} />
          <Route path="/mapa" element={<Maps />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
