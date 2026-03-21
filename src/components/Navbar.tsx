import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Home from './Home'
import Curriculum from './Curriculum'
import Miscellaneous from './Miscellaneous'
import Research from './Research'
import Transfer from './Transfer'

const Navbar = () => {
  const location = useLocation()
  const [scrolledPastHero, setScrolledPastHero] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 420)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = location.pathname === '/'
  const useTransparentNav = isHome && !scrolledPastHero

  return (
    <>
      <>
        <div
          className={`navbar sticky top-0 flex justify-evenly items-center w-full left-0 lg:px-20 z-50 mb-4 transition-all duration-300 ${
            useTransparentNav
              ? 'bg-transparent border border-transparent shadow-none backdrop-blur-sm'
              : 'growth-surface'
          }`}
        >
          <div className="navbar-start  lg:justify-start flex justify-around items-center w-full">
            <div className="dropdown mr-100px">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost margin lg:hidden rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 border border-emerald-100 font-accent"
              >
                <li>
                  <Link to="/transfer">Transfer</Link>
                </li>
                <li>
                  <Link to="/curriculum">Curriculum</Link>
                </li>
                <li>
                  <Link to="/research">Research (UG)</Link>
                </li>
                <li>
                  <Link to="/miscellaneous">Miscellaneous</Link>
                </li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl lg:text-center hidden md:unhidden :block text-emerald-900 font-heading tracking-wide">
              Seedling Education
            </a>

            <a href="/" className="min-w-24 min-h-24 w-24 h-24 ">
              <img src="/final_logo.png" alt="Logo-seedling" width="80px" />
            </a>
            <button className="btn btn-ghost btn-circle lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 text-emerald-900">
              <li className="font-accent font-semibold hover:text-emerald-700">
                <Link to="/transfer">Transfer</Link>
              </li>
              <li className="font-accent font-semibold hover:text-emerald-700">
                <Link to="/curriculum/*">Curriculum</Link>
              </li>
              <li className="font-accent font-semibold hover:text-emerald-700">
                <Link to="/research">Research (UG)</Link>
              </li>
              <li className="font-accent font-semibold hover:text-emerald-700">
                <Link to="/miscellaneous">Miscellaneous</Link>
              </li>
            </ul>
            <button className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/curriculum/*" element={<Curriculum />} />
          <Route path="/research" element={<Research />} />
          <Route path="/miscellaneous" element={<Miscellaneous />} />
        </Routes>
      </>
    </>
  )
}

export default Navbar
