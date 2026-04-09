import { useEffect, useState } from 'react'
import ApiHandler from './ApiHandler'
import StaticCard from './StaticCard'

const CardAccordion: React.FC<number> = ({ id }) => {
  const [cardProps, setCardProps] = useState()

  // grab the data from the API
  const fetchData = async (pageID) => {
    try {
      const data = await ApiHandler.apiFetchPage(Number(pageID))
      console.log('<Accordian.tsx> The Data for the Accordian is: ', data)
      setCardProps(data)
    } catch (error) {
      console.error('Error in fetching data:', error)
    }
  }

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // responsive function
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchData(id)
    console.log('<CardAccordian.tsx> The Card Props are: ', cardProps)
  }, [id])

  return (
    <div className="flex justify-center w-full w-30 lg:w-100">
      <div
        id="accordion"
        className="collapse bg-base-200 w-3/4 border-b-2 border-black"
      >
        <input type="checkbox" className="peer" />

        <div className="collapse-title text-xl font-medium">
          <i className="fas fa-angle-down mr-2"></i>
          {cardProps?.title || 'Loading...'}
        </div>

        {cardProps ? (
          <div className="collapse-content flex items-center justify-center w-full overflow-hidden p-4">
            {/* Render StaticCard with the fetched data */}
            {cardProps?.body.map((block: any, index: number) => (
              <StaticCard key={index} id={id} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CardAccordion
