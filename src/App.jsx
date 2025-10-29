import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import BackendHandbook from './components/BackendHandbook/BackendHandbook'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/handbook" element={<BackendHandbook />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App
