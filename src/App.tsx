import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Classes from './components/Classes'
import Research from './components/Research'
import TimelinePages from './components/TimelinePages'
import ApiHandler from './components/ApiHandler'

import { Link, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import StaticCard from './components/StaticCard'
const App = () => {
  useEffect(() => {
    ApiHandler.preloadTabsData()
  }, [])

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/classes" element={<Classes />} />
        <Route path="/classes/:id" element={<Classes />} />
        <Route path="/timeline" element={<TimelinePages />} />
        <Route path="/timeline/:id" element={<TimelinePages />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
