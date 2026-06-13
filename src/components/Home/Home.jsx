import About from '../About/About'
import GalleryTeaser from '../GalleryTeaser/GalleryTeaser'
import Hero from '../Hero/Hero'
import BenchInvite from '../BenchInvite/BenchInvite'
import JournalInvite from '../JournalInvite/JournalInvite'

function Home() {
  return (
    <>
      <Hero />
      <GalleryTeaser />
      <BenchInvite />
      <JournalInvite />
      <About />
    </>
  )
}

export default Home
