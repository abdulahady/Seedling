import React from 'react'
import { MathJax } from 'better-react-mathjax'
import { labelFromFileUrl } from '../utils/fileLabel'

/**
 * Renders one Wagtail streamfield block. Expects `image` / `document` blocks to
 * carry a resolved `url` from ApiHandler (same order as in the CMS).
 */
export function renderStreamBlock(block: any): React.ReactNode {
  if (!block || typeof block !== 'object') {
    return null
  }
  switch (block.type) {
    case 'math':
      return <MathJax>{block.value}</MathJax>
    case 'paragraph':
      return <p dangerouslySetInnerHTML={{ __html: block.value }} />
    case 'list-item':
      return <li dangerouslySetInnerHTML={{ __html: block.value }} />
    case 'unordered-list':
      return (
        <ul className="list-disc pl-6 my-2">
          {(block.children || []).map((child: any, i: number) => (
            <React.Fragment key={i}>{renderStreamBlock(child)}</React.Fragment>
          ))}
        </ul>
      )
    case 'image':
      if (!block.url) {
        return null
      }
      return (
        <img
          src={block.url}
          alt=""
          referrerPolicy="no-referrer"
          className="max-w-full h-auto my-4 rounded-lg border border-emerald-900/10"
        />
      )
    case 'document':
      if (!block.url) {
        return null
      }
      return (
        <p className="my-3">
          <a
            href={block.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-800 underline decoration-emerald-600 underline-offset-2 hover:text-emerald-950"
          >
            {labelFromFileUrl(block.url)}
          </a>
        </p>
      )
    case 'embed':
      return null
    default:
      return null
  }
}
