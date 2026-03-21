import 'daisyui/dist/full.css'
import { useEffect, useRef, useState } from 'react'
import '../App.css'
import '../index.css'
import AnimatedCard from './AnimatedCard'
import ApiHandler from './ApiHandler'
import Card from './Card'
import Carousel from './Carousel'
import Hero from './Hero'
import LoadingScreen from './LoadingScreen'
import StaticCard from './StaticCard'
import Timeline from './Timeline'
import TimelineItem from './TimelineItem'

function Home() {
  const timelineRef = useRef<HTMLDivElement>(null) // Create a ref for the Timeline component
  const [loading, setLoading] = useState(true)
  const [id, setID] = useState(7)
  const [index, setIndex] = useState(0)
  const [pagesIdList, setPagesIdList] = useState()
  // Initialize an array of image URLs

  // function for testing the LoadingScreen component, ex: await delay(3000)
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  // Function for grabbing all the pages
  const fetchAllPages = async () => {
    const testPages = await ApiHandler.apiFetchPages()
    const idList = testPages
      .filter((item) => item.id !== 2)
      .map((item) => item.id)

    console.log('<Home.tsx> The idList is: ', idList)
    // Set the id list to the global state of the component so you can
    // access it anywhere within the component
    setPagesIdList(idList)
    setLoading(false)
  }

  useEffect(() => {
    fetchAllPages()
    console.log(`<Home.tsx> Loading is ${loading}`)
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  // prototype
  const handleNextPage = () => {
    // Increment index and wrap around using modulo if it goes out of bounds
    setIndex((prevIndex) => (prevIndex + 1) % pagesIdList.length)

    // Use a callback in setID to ensure it uses the updated index
    setID((prevState) => pagesIdList[(index + 1) % pagesIdList.length])
    console.log(`<Home.tsx> Next ID: ${id}`)
  }
  // TODO: Fix this function for a next page button
  // const handleNextPage = () => {
  //   setIndex((i) => i + 1)
  //   setID(() => pagesIdList[index % pagesIdList.length])
  //   return <TestCard id={id} />
  //   console.log(
  //     `This is the pagesIdList: ${pagesIdList[index % pagesIdList.length]}`,
  //   )
  //   console.log(`This is the ID: ${id}`)
  // }

  //prototype
  const handlePrevPage = () => {
    // Decrement index, wrap around using modulo to handle negative values
    setIndex((prevIndex) => {
      const newIndex = prevIndex - 1
      return newIndex < 0
        ? pagesIdList.length - 1
        : newIndex % pagesIdList.length
    })

    // Use a callback in setID to ensure it uses the updated index
    // This calculation handles negative index by wrapping to the last element
    setID(
      (prevState) =>
        pagesIdList[(index - 1 + pagesIdList.length) % pagesIdList.length],
    )
    console.log(`<Home.tsx> Previous ID: ${id}`)
  }

  // // TODO: Fix this function for a previous page button
  // const handlePrevPage = () => {
  //   setIndex((i) => i - 1)
  //   setID(() => pagesIdList[index % pagesIdList.length])
  //   return <TestCard id={id} />
  //   console.log(
  //     `This is the pagesIdList: ${pagesIdList[index % pagesIdList.length]}`,
  //   )
  //   console.log(`This is the ID: ${id}`)
  // }

  // Was used to test the Api handler, now same functionality being handled in
  // useEffect
  const testAPIFunction = async () => {
    const testPages = await ApiHandler.apiFetchPages()
    const pagesIDList = testPages.map((i) => i.id)

    // Set the id list to the global state of the component so you can
    // access it anywhere within the component
    setPagesIdList(pagesIDList)

    // for stuff in pagesIDList {
    //     append pagesIDList[i] 'pages/${pagesIDList[i]}'
    // }
    console.log(pagesIDList)
    console.log(testPages)
  }

  const scrollToTimeline = () => {
    if (timelineRef.current) {
      const top = timelineRef.current.offsetTop // Get the top position of the timeline component
      const offset = 100 // Adjust this value to whatever works for your layout
      window.scrollTo({
        top: top - offset, // Subtract the offset from the top position
        behavior: 'smooth',
      })
    }
  }

  const timelineDetails = [
    {
      icon: '/additional-logo.png', // Replace with actual icon paths or import statements
      levelLabel: 'Level 1 - Apprentice',
      content: <AnimatedCard id="32" />,
    },
    {
      icon: '/additional-logo.png', // Replace with actual icon paths or import statements
      levelLabel: 'Level 2 - Explorer',
      content: <AnimatedCard id="33" />,
    },
    {
      icon: '/additional-logo.png', // Replace with actual icon paths or import statements
      levelLabel: 'Level 3 - Scholar',
      content: <AnimatedCard id="34" />,
    },
    {
      icon: '/additional-logo.png', // Replace with actual icon paths or import statements
      levelLabel: 'Level 4 - Journeyman',
      content: <AnimatedCard id="35" />,
    },
  ]

  return (
    <>
      <Hero onButtonClick={scrollToTimeline} />
      <StaticCard id="31" className="pb-10"></StaticCard>
      <Timeline ref={timelineRef}>
        {timelineDetails.map((item, index) => (
          <TimelineItem
            key={index}
            icon={item.icon}
            levelLabel={item.levelLabel}
            content={item.content}
            showConnectingLine={index < timelineDetails.length - 1} // Show connecting line except for the last item
          />
        ))}
      </Timeline>
      {/* Add a button or mechanism to fetch next page or content */}
    </>
  )
}
export default Home
