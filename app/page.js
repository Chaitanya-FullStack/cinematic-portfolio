'use client'

import { useRef } from 'react'
import Navbar       from '@/components/ui/Navbar'
import VideoIntro   from '@/components/sections/VideoIntro'
import HeroSection  from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'

export default function Home() {
  const heroWrapRef = useRef(null)

  return (
    <>
      <Navbar />
      {/*
        Each wrapper is 100vh tall. The section inside is position:sticky so it
        stays glued to the top while you scroll. Each successive section slides
        over the previous one (increasing z-index).
      */}
      <main style={{ height: '100vh', overflowY: 'scroll' }}>
        <div style={{ height: '100vh', position: 'relative' }}>
          <VideoIntro heroRef={heroWrapRef} />
        </div>

        <div ref={heroWrapRef} style={{ height: '100vh', position: 'relative' }}>
          <HeroSection />
        </div>

        <div style={{ height: '100vh', position: 'relative' }}>
          <AboutSection />
        </div>
      </main>
    </>
  )
}
