import { useEffect, useState } from 'react'
import ApiHandler from './ApiHandler'
import StaticCard from './StaticCard'

const Accordion: React.FC<number> = ({ id }) => {
  const [cardProps, setCardProps] = useState()

  // grab the data from the API
  const fetchData = async (pageID) => {
    try {
      const data = await ApiHandler.apiFetchPage(pageID)
      console.log('<Accordian.tsx> The Data for the Accordian is: ', data)
      setCardProps(data)
    } catch (error) {
      console.error('Error in fetching data:', error)
    }
  }
  // // responsive function
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  //end of func

  useEffect(() => {
    fetchData(id)
    console.log('<Accordian.tsx> The Card Props are: ', cardProps)
  }, [id])

  const title = cardProps?.title || 'Loading...'
  const rawDocumentUrls = cardProps?.documentUrls
  const documentUrl = Array.isArray(rawDocumentUrls)
    ? rawDocumentUrls[0]
    : rawDocumentUrls

  return (
    <div className="flex justify-center w-full  w-30 lg-w-100 ">
      <div
        id="accordian"
        className="collapse bg-base-200 w-3/4  border-b-2 border-black "
      >
        <input type="checkbox" className="peer" />

        {windowWidth <= 1200 ? (
          documentUrl ? (
            <a
              id="classDocumentLink"
              href={documentUrl}
              target="_blank"
              className=" text-black visited:text-gray-800 mb-10"
            >
              <div className="collapse-title text-xl font-medium ">
                <i className="fas fa-angle-down mr-2"></i>
                {title}
              </div>
            </a>
          ) : (
            <div className="collapse-title text-xl font-medium ">
              <i className="fas fa-angle-down mr-2"></i>
              {title}
            </div>
          )
        ) : (
          <div className="collapse-title text-xl font-medium">
            <i className="fas fa-angle-down mr-2"></i>
            {title}
          </div>
        )}

        {windowWidth >= 1201 && documentUrl ? (
          <div className="collapse-content flex items-center w-full overflow-hidden ">
            <iframe
              src={documentUrl}
              title={title}
              className=" w-full h-full min-h-[75vh] min-w-full border-none aspect-video "
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Accordion
