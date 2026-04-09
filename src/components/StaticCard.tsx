//can be used as a base component for the component for the blogs
//guides etc.
//make it seem like a piece of parchment paper

import React, { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import ApiHandler from './ApiHandler'
import LoadingScreen from './LoadingScreen'
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

/** Put intro text before images when CMS order is image-first (e.g. Calc III hub). */
function bodyWithTextBeforeImages(body: any[]): any[] {
  const nonImage = body.filter((b) => b?.type !== 'image')
  const images = body.filter((b) => b?.type === 'image')
  return [...nonImage, ...images]
}

const StaticCard: React.FC<number> = ({ id }) => {
  const [cardProps, setCardProps] = useState()
  const [loading, setLoading] = useState(true)
  console.log('<StaticCard.tsx> The TestCard ID is: ', id)

  const fetchData = async (pageID) => {
    try {
      setLoading(true)
      const data = await ApiHandler.apiFetchPage(pageID)
      console.log('<StaticCard.tsx> The Data is: ', data)
      setCardProps(data)
    } catch (error) {
      console.error('<StaticCard.tsx> Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(id)
    console.log('<StaticCard.tsx> The Card Props are: ', cardProps)
  }, [id])

  const bylineParts = [cardProps?.author, cardProps?.date].filter(Boolean)
  const byline = bylineParts.join(' - ')

  const ref = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useSpring(() => ({ value: 0 }))
  const [hoverProps, setHoverProps] = useSpring(() => ({
    transform: 'scale(1)',
    config: { mass: 1, tension: 200, friction: 60 }, // Adjusted values to reduce bounciness
  }))

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <MathJaxContext config={config}>
      <animated.div
        ref={ref}
        className="growth-surface text-gray-900 max-w-3xl mx-auto mt-5 mb-8 p-8 rounded-2xl"
        style={hoverProps}
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2 font-heading">
            {cardProps?.title}
          </h1>
          {byline && (
            <p className="text-md mb-4 font-accent text-lg">{byline}</p>
          )}
        </div>
        <div className="text-left font-body text-lg">
          {bodyWithTextBeforeImages(
            Array.isArray(cardProps?.body) ? cardProps.body : [],
          ).map((block: any, index: number) => (
            <React.Fragment key={index}>
              {renderStreamBlock(block)}
            </React.Fragment>
          ))}
        </div>
      </animated.div>
    </MathJaxContext>
  )
}

export default StaticCard
