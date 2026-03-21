// Import axios to make HTTP requests
import axios from 'axios'

const useSupabaseBackend =
  String(import.meta.env.VITE_USE_SUPABASE_BACKEND || '').toLowerCase() ===
  'true'
const defaultBaseUrl = useSupabaseBackend
  ? 'https://seedlingbackend-production.up.railway.app/api/v3'
  : 'https://seedlingbackend-production.up.railway.app/api/v2'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl

// Create an axios instance with predefined base URL and headers
const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000, // Adjusted timeout for more flexibility
  headers: { 'Content-Type': 'application/json' },
})

interface Page {
  id: number
  tag: string
}

interface ApiResponse {
  data: Page
}

const pageRequestCache = new Map<any, Promise<any>>()
const tagRequestCache = new Map<any, Promise<any>>()
let hasStartedTabPreload = false

// Function to fetch image data based on the provided ID (Value from pages maps
// to the ID of the image or document)
const handleImage = async (id) => {
  try {
    const response = await api.get(`/images/${id}/`)
    // Assuming the URL is directly accessible in the response, adjust based on actual API structure
    return response.data.meta.download_url // Or whatever field holds the URL
  } catch (error) {
    console.error('Error fetching image: ', error)
    return null
  }
}

// Function to fetch document data based on the provided ID (Value from pages maps
// to the ID of the image or document)
const handleDocument = async (id) => {
  try {
    const response = await api.get(`/documents/${id}/`)
    // Adjust the field access as needed based on your API's response structure
    return response.data.meta.download_url // Adjust this path to wherever the document URL is stored
  } catch (error) {
    console.error('Error fetching document: ', error)
    return null
  }
}

// Main object/class with methods to fetch data based on what data is needed
// TODO: Define a way to not try to map a document and image to every page, even
// if the page doesn't have a document and/or image
const ApiHandler = {
  apiFetchPage: async (id) => {
    if (!pageRequestCache.has(id)) {
      const request = (async () => {
        try {
          // Define the type of content block to fetch, in this case
          // 'core.ContentBlock' is the page type
          const type = 'core.ContentBlock'
          // Fetch page data
          const response = await api.get(`/pages/${id}/`)
          const pageData = response.data

          // Check if pageData.body exists
          if (!pageData?.body) {
            console.log('<ApiHandler.tsx> apiFetchPage no body in pageData')
            return
          }

          // Filter and map image IDs from pageData.body
          const imageIds = pageData.body
            .filter((item: any) => item.type === 'image')
            .map((item: any) => item.value)

          // Filter and map document IDs from pageData.body
          const documentIds = pageData.body
            .filter((item: any) => item.type === 'document')
            .map((item: any) => item.value)

          // Process image/document IDs concurrently to reduce fetch time
          const [imageUrls, documentUrls] = await Promise.all([
            imageIds.length > 0 ? Promise.all(imageIds.map(handleImage)) : [],
            documentIds.length > 0
              ? Promise.all(documentIds.map(handleDocument))
              : [],
          ])

          const safeImageUrls = imageUrls.filter(Boolean)
          const safeDocumentUrls = documentUrls.filter(Boolean)

          if (imageIds.length > 0) {
            console.log(
              `<ApiHandler.tsx> apiFetchPage The image URLs are ${imageUrls}`,
            )
          } else {
            console.log(
              '<ApiHandler.tsx> apiFetchPage no images found in pageData',
            )
          }

          if (documentIds.length > 0) {
            console.log(
              `<ApiHandler.tsx> apiFetchPage the document URLs are ${documentUrls}`,
            )
          } else {
            console.log(
              '<ApiHandler.tsx> apiFetchPage no documents found in pageData',
            )
          }

          // Enrich the original page data with the fetched URLs
          const enrichedPageData = {
            ...pageData,
            imageUrls: safeImageUrls,
            documentUrls: safeDocumentUrls,
          }

          return enrichedPageData
        } catch (error) {
          pageRequestCache.delete(id)
          console.error('apiFetchPage: Error fetching data: ', error)
          throw error
        }
      })()

      pageRequestCache.set(id, request)
    }

    return pageRequestCache.get(id)
  },
  // Fetch all the page data at the /pages endpoint
  apiFetchPages: async () => {
    try {
      const response = await api.get('/pages')
      console.log(
        '<ApiHandler.tsx> apiFetchPages fetched items: ',
        response.data.items,
      )
      return response.data.items
    } catch (error) {
      console.log(
        `<ApiHandler.tsx> apiFetchPages error retrieving pages: ${error}`,
      )
    }
  },

  // Fetch specific pages based on a tag (e.g. 'MATH-172')
  apiFetchSpecificPages: async (tag: any) => {
    try {
      // initial fetch to get all pages from the api
      const response = await api.get('/pages')
      console.log(
        '<ApiHandler.tsx> apiFetchSpecificPages fetched items: ',
        response.data.items,
      )
      const pageIds = response.data.items.map((item) => item.id)
      // Fetch all pages concurrently
      const fetchPromises: Promise<ApiResponse>[] = pageIds.map((pageId) =>
        api.get(`/pages/${pageId}/`),
      )

      // Wait for all fetch operations to complete
      const responses = await Promise.all(fetchPromises)
      console.log(
        '<ApiHandler.tsx> apiFetchSpecificPages responses are: ',
        responses,
      )

      // Extract pages from responses
      const pages: Page[] = responses.map((response) => response.data)
      console.log(
        '<ApiHandler.tsx> apiFetchSpecificPages the pages are: ',
        pages,
      )

      // Filter pages based on the subtitle
      const filteredPages = pages.filter((page) => page.tag === tag)

      console.log(
        '<ApiHandler.tsx> apiFetchSpecificPages filtered Pages: ',
        filteredPages,
      )

      return filteredPages
    } catch (error) {
      console.log(
        `<ApiHandler.tsx> apiFetchSpecificPages error retrieving pages: ${error}`,
      )
    }
  },

  // make a new endpoint to grab requeats
  apiFetchTag: async (tag: any) => {
    if (!tagRequestCache.has(tag)) {
      const request = (async () => {
        try {
          const response = await api.get(
            `/pages/?type=core.ContentBlock&tag=${tag}`,
          )
          console.log('<ApiHandler.tsx> apiFetchTag returned: ', response)
          return response.data.items
        } catch (error) {
          tagRequestCache.delete(tag)
          console.log(
            '<ApiHandler.txt> apiFetchTag failed to retrieve data: ',
            error,
          )
        }
      })()

      tagRequestCache.set(tag, request)
    }

    return tagRequestCache.get(tag)
  },

  preloadTabsData: async () => {
    if (hasStartedTabPreload) {
      return
    }
    hasStartedTabPreload = true

    try {
      const tabTags = [
        'transfer',
        'miscellaneous',
        'MATH-161',
        'MATH-171',
        'MATH-172',
        'MATH-173',
        'MATH-191',
        'MATH-193',
        'MATH-134',
        'PHYS-101',
        'PHYS-102',
        'PHYS-103',
        'PHYS-165',
        'CHEM-101',
        'CHEM-102',
        'CHEM-112',
        'CHEM-113',
        'BIO-101',
        'BOT-101',
        'ZOOL-101',
        'ENGR-141',
        'ENGR-135',
        'ENGR-130',
      ]

      const staticPageIds = [
        25, 27, 36, 37, 38, 39, 50, 103, 28, 31, 32, 33, 34, 35,
      ]
      const tagResults = await Promise.allSettled(
        tabTags.map((tag) => ApiHandler.apiFetchTag(tag)),
      )
      const idsFromTags = tagResults
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result: any) =>
          Array.isArray(result.value) ? result.value : [],
        )
        .map((item: any) => item?.id)
        .filter(Boolean)

      const pageIdsToWarm = Array.from(
        new Set([...staticPageIds, ...idsFromTags]),
      )
      await Promise.allSettled(
        pageIdsToWarm.map((id) => ApiHandler.apiFetchPage(id)),
      )
      console.log('<ApiHandler.tsx> preloadTabsData warmed tab data')
    } catch (error) {
      console.log('<ApiHandler.tsx> preloadTabsData failed: ', error)
    }
  },
}

export default ApiHandler
