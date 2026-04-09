//can be used as a base component for the component for the blogs
//guides etc.
//make it seem like a piece of parchment paper

import React, { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import ApiHandler from './ApiHandler'
import { renderStreamBlock } from './StreamBlock'

const config = {
  loader: { load: ['input/asciimath', 'output/chtml'] },
  asciimath: { delimiters: [['$$', '$$']] },
}

declare global {
  interface Window {
    MathJax: any // You can replace 'any' with a more specific type if available
  }
}
const calc = (x: number, y: number, rect: DOMRect) => {
  // Normalize the cursor coordinates to be from -0.5 to 0.5
  const xRel = (x - (rect.left + rect.width / 2)) / rect.width // -0.5 when cursor at left edge, 0.5 at right edge
  const yRel = (y - (rect.top + rect.height / 2)) / rect.height // -0.5 when cursor at top edge, 0.5 at bottom edge
  const tiltMax = 7 // The maximum tilt angle

  // Inverting the signs for tiltX and tiltY to reverse the tilt direction
  const tiltY = -xRel * tiltMax // Tilt on Y-axis changes with horizontal movement
  const tiltX = yRel * tiltMax // Tilt on X-axis changes with vertical movement

  return {
    xys: [tiltX, tiltY, 1.07] as [number, number, number], // Adjust scale if necessary
  }
}

const MiscCard: React.FC<number> = ({ id }) => {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth < 1280)
  const [cardProps, setCardProps] = useState()
  console.log('<AnimatedCard.tsx> The ID is: ', id)

  const fetchData = async (pageID) => {
    try {
      const data = await ApiHandler.apiFetchPage(pageID)
      console.log('<AnimatedCard.tsx> The Data is: ', data)
      setCardProps(data)
    } catch (error) {
      console.error('<AnimatedCard.tsx> Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData(id)
    console.log('<AnimatedCard.tsx> The Card Props are: ', cardProps)
  }, [id])

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      const newWidth = window.innerWidth

      setIsExpanded(newWidth < 1280)
    }

    // responsive function
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const ref = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useSpring(() => ({ value: 0 }))
  const [spotlightStyle, setSpotlightStyle] = useSpring(() => ({
    opacity: 0,
    background:
      'radial-gradient(circle at 0px 0px, rgba(255, 255, 240, 0.5), transparent 50%)',
    config: { duration: 1800 },
  }))
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 1, tension: 50, friction: 40 },
  }))
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setSpotlightStyle({
        opacity: 1,
        background: `radial-gradient(circle at ${e.clientX - rect.left}px ${
          e.clientY - rect.top
        }px, rgba(255, 255, 240, 0.25), transparent 50%)`,
      })

      set(calc(e.clientX, e.clientY, rect))
    }
    const createMarkup = (htmlString) => {
      return { __html: htmlString }
    }
  }

  const toggleExpand = () => {
    if (windowWidth >= 1280) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div
      onClick={toggleExpand}
      className={`card-container ${isExpanded ? 'expanded' : ''}`}
    >
      <div className={`content ${isExpanded ? '' : 'truncate'}`}>
        <MathJaxContext config={config}>
          <animated.div
            ref={ref}
            className="growth-surface text-gray-900 max-w-3xl mx-auto my-8 p-8 rounded-2xl"
            style={{
              transform: props.xys.interpolate(
                (x, y, s) =>
                  `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`,
              ),
              zIndex: 1,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity({ value: 1 })}
            onMouseLeave={() => {
              set({ xys: [0, 0, 1] })
              setSpotlightStyle({ opacity: 0 })
            }}
          >
            <animated.div
              className="absolute top-0 left-0 right-0 bottom-0 rounded-lg pointer-events-none"
              style={spotlightStyle}
            />
            <div className="text-left font-body">
              <h1 className="text-xl font-bold mb-2 font-heading">
                {cardProps?.title}
              </h1>
              {cardProps?.author && (
                <p className="text-sm font-bold mb-4 font-accent">
                  {cardProps?.author}
                </p>
              )}
              {(Array.isArray(cardProps?.body) ? cardProps.body : []).map(
                (block: any, index: number) => (
                  <React.Fragment key={index}>
                    {renderStreamBlock(block)}
                  </React.Fragment>
                ),
              )}
            </div>
          </animated.div>
        </MathJaxContext>
      </div>
      {!isExpanded && <div className="card-fade"></div>}
    </div>
  )
}

export default MiscCard
