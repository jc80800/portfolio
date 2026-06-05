import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import GalleryPage from './pages/Gallery/Gallery'
import JournalPage from './pages/Journal/Journal'
import JournalPost from './pages/JournalPost/JournalPost'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/journal/:slug" element={<JournalPost />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
