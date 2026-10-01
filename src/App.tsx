import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import Previsao from './pages/Home/Previsao.tsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes> 
          <Route path="/" element={<Home />} />
          <Route path="/previsao" element={<Previsao />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
