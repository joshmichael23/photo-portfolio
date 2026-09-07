import './App.css'
import { Routes, Route } from 'react-router-dom';
import Header from './Header'
import Home from './components/Home'
import About from './components/About'

function App() {

 

  return (
    <>
    <div>
      <Header></Header>
    </div>
    <Routes>
      {/* Home Route */}
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/contact"
        element={<div>Contact</div>}
      />  
    </Routes>
    </>
  )
}

export default App
