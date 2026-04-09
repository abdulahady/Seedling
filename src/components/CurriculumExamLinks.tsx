import React, { useEffect, useState } from 'react'
import ApiHandler from './ApiHandler'
import { labelFromFileUrl } from '../utils/fileLabel'

function ExamLinkRow({ pageId }: { pageId: number }) {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    ApiHandler.apiFetchPage(pageId).then((d) => {
      if (!cancelled) {
        setData(d)
      }
    })
    return () => {
      cancelled = true
    }
  }, [pageId])

  const title = data?.title || 'Loading…'
  const urls = (
    Array.isArray(data?.documentUrls) ? data.documentUrls : []
  ).filter(Boolean) as string[]

  return (
    <div className="flex justify-center w-full w-30 lg-w-100">
      <div className="collapse collapse-open bg-base-200 w-3/4 border-b-2 border-black">
        {/* Same shell as Accordion, but no checkbox / peer / expand — static row */}
        <div className="collapse-title text-xl font-medium text-black py-4 min-h-0">
          <i className="fas fa-angle-down mr-2 opacity-80" aria-hidden />
          {!data ? (
            <span className="text-gray-600">{title}</span>
          ) : urls.length === 0 ? (
            <span>
              {title}{' '}
              <span className="text-base font-normal text-gray-600">
                (no file linked)
              </span>
            </span>
          ) : (
            <span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1">
              {urls.map((url, i) => (
                <React.Fragment key={`${pageId}-${i}`}>
                  {i > 0 && (
                    <span
                      className="text-gray-500 px-1 select-none"
                      aria-hidden
                    >
                      |
                    </span>
                  )}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black visited:text-gray-800 underline decoration-emerald-600 underline-offset-4 hover:text-emerald-950"
                  >
                    {urls.length === 1
                      ? title
                      : i === 0
                        ? title
                        : labelFromFileUrl(url)}
                  </a>
                </React.Fragment>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Practice exam links with the old accordion row look (no expand/collapse).
 */
export function CurriculumExamLinks({ pageIds }: { pageIds: number[] }) {
  if (!pageIds.length) {
    return null
  }

  return (
    <div id="curriculum-exams" className="w-full mt-2 mb-10">
      {pageIds.map((pageId) => (
        <ExamLinkRow key={pageId} pageId={pageId} />
      ))}
    </div>
  )
}
