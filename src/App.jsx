import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="app">
      <Header />
      
      <main className="main">
        <Hero />
        <About />
        <Projects />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
