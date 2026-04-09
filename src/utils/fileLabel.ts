/** Human-readable label from a document URL (filename without extension, spaces). */
export function labelFromFileUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const seg = pathname.split('/').filter(Boolean).pop() || ''
    const decoded = decodeURIComponent(seg)
    const withoutExt = decoded.replace(/\.[^.]+$/, '')
    const spaced = withoutExt.replace(/[_-]+/g, ' ').trim()
    return spaced || 'Open document'
  } catch {
    return 'Open document'
  }
}
