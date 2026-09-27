import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home.tsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes> 
          <Route path="/" element={<Home />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
