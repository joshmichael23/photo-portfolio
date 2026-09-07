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

     
    </Routes>
    </>
  )
}

export default App
