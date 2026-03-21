import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import ApiHandler from './ApiHandler'
import LoadingScreen from './LoadingScreen'
import MiscCard from './MiscCard'

const Research = () => {
  const location = useLocation()
  const { id } = useParams() // Provide a fallback object to avoid destructuring undefined
  const courseCode = location.state?.courseCode
  const [loading, setLoading] = useState(true)
  const [idList, setIdList] = useState([])
  const [tag, setTag] = useState(courseCode)

  const fetchAllPages = async (tag: string) => {
    try {
      const response = await ApiHandler.apiFetchTag(tag)
      const list = response?.map((item) => item.id)
      console.log('<Classes.tsx> The ID list is: ', list)
      setIdList(list)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }
  const id_dictionary: { [key: number]: string } = {
    39: 'miscellaneous',
  }

  useEffect(() => {
    let effectiveTag = courseCode
    if (!effectiveTag && id) {
      // Convert id from URL to number and look up tag in dictionary
      const numericId = parseInt(id, 10)
      effectiveTag = id_dictionary[numericId]
    }
    console.log('<Classes.tsx> The effective tag is: ', effectiveTag)
    if (effectiveTag) {
      fetchAllPages(effectiveTag) // Use effectiveTag instead of courseCode
    } else {
      console.log('No effective tag found for fetching.')
      setLoading(false) // Ensure loading is set to false if there's no tag to fetch data for
    }
  }, [id, courseCode])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <div className="research-article-layout">
      <section className="growth-surface rounded-3xl px-6 py-8 md:px-10 mb-8 text-left">
        <p className="font-accent text-sm tracking-[0.16em] uppercase text-emerald-700 mb-2">
          Undergraduate Research
        </p>
        <h1 className="font-heading text-4xl md:text-5xl text-emerald-950 mb-4">
          Research Playbook
        </h1>
        <p className="font-body text-lg text-emerald-900/90 max-w-3xl">
          A curated, article-style guide to finding research mentors, preparing
          outreach, and building a strong path from first contact to active lab
          involvement.
        </p>
      </section>

      <div id="row" className="flex flex-col items-center w-full gap-6">
        <div id="leftCol" className="w-full max-w-4xl">
          <MiscCard id="25" />
        </div>
        <div id="middleCol" className="w-full max-w-4xl">
          <MiscCard id="27" />
        </div>
        <div id="rightCol" className="w-full max-w-4xl">
          <MiscCard id="36" />
        </div>
        <div id="leftCol" className="w-full max-w-4xl">
          <MiscCard id="37" />
        </div>
        <div id="middleCol" className="w-full max-w-4xl">
          <MiscCard id="38" />
        </div>
      </div>
    </div>
  )
}

export default Research
