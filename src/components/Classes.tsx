import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CurriculumExamLinks } from './CurriculumExamLinks'
import ApiHandler from './ApiHandler'
import LoadingScreen from './LoadingScreen'
import StaticCard from './StaticCard'

export function Classes() {
  const location = useLocation()
  const { id } = useParams() // Provide a fallback object to avoid destructuring undefined
  const courseCode = location.state?.courseCode
  const [loading, setLoading] = useState(true)
  const [idList, setIdList] = useState([])
  const [tag, setTag] = useState(courseCode)

  const fetchAllPages = async (tag: string) => {
    try {
      const response = await ApiHandler.apiFetchTag(tag)
      const list = response?.map((item) => item.id) || []
      console.log('<Classes.tsx> The ID list is: ', list)
      // Warm page cache so StaticCard / exam links load quickly.
      await Promise.allSettled(
        list.map((itemId) => ApiHandler.apiFetchPage(Number(itemId))),
      )
      setIdList(list)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }
  const id_dictionary: { [key: number]: string } = {
    6: 'MATH-172',
    8: 'MATH-161',
    9: 'MATH-171',
    10: 'MATH-173',
    11: 'MATH-191',
    12: 'MATH-193',
    13: 'MATH-134',
    14: 'PHYS-101',
    15: 'PHYS-102',
    16: 'PHYS-103',
    17: 'CHEM-101',
    18: 'CHEM-102',
    19: 'CHEM-112',
    20: 'CHEM-113',
    21: 'BIO-101',
    22: 'BOT-101',
    23: 'ZOOL-101',
    24: 'PHYS-165',
    25: 'ENGR-141',
    26: 'ENGR-135',
    27: 'ENGR-130',
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

  const fallbackId = id ? parseInt(id, 10) : null
  const hasValidFallback = Number.isInteger(fallbackId) && fallbackId > 0

  return (
    <div id="top-of-page">
      {idList.length > 0 ? (
        <>
          <StaticCard id={idList[0]} />
          <CurriculumExamLinks
            pageIds={idList
              .filter((itemId) => itemId !== idList[0])
              .map((x) => Number(x))}
          />
        </>
      ) : hasValidFallback ? (
        <StaticCard id={fallbackId} />
      ) : (
        <div className="growth-surface p-6 text-left">
          <h2 className="font-heading text-2xl text-emerald-900">
            No class content found yet
          </h2>
        </div>
      )}
    </div>
  )
}

export default Classes
