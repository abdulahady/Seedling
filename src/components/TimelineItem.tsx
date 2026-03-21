import React from 'react'
import SlideOutWrapper from './SlideOutWrapper'

interface TimelineItemProps {
  icon: string | React.ReactNode // URL or React component
  content: React.ReactNode // Content of the timeline item
  levelLabel?: string
  showConnectingLine?: boolean // Flag to show connecting line
  colorStart?: string // Start color for gradient
  colorEnd?: string // End color for gradient
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  icon,
  content,
  levelLabel,
  showConnectingLine = false,
  colorStart = 'transparent', // Default colors for gradient
  colorEnd = '#1f8a4d',
}) => {
  const isIconUrl = typeof icon === 'string'

  // Styles for the connecting line
  const lineStyle: React.CSSProperties = {
    background: `linear-gradient(${colorStart}, ${colorEnd}, ${colorStart})`,
    opacity: 0.75, // Adjust as needed
    width: '5px', // Thin line width
    position: 'absolute',
    left: '50%', // Center under the icon
    top: '100%', // Start right below the icon
    bottom: '-1000%',
    transform: 'translateX(-50%)', // Center it horizontally
  }

  return (
    <div className="flex mb-8 items-start">
      {/* Icon and connecting line container */}
      <div className="relative flex flex-col items-center mr-4">
        {' '}
        {/* This needs to be relative */}
        {/* Icon */}
        <div
          className={
            isIconUrl
              ? 'rounded-full p-2 bg-emerald-600 text-white'
              : 'icon-component'
          }
        >
          {isIconUrl ? (
            <img src={icon as string} alt="Timeline Icon" className="h-6 w-6" />
          ) : (
            icon
          )}
        </div>
        {/* Connecting Line */}
        {showConnectingLine && <div style={lineStyle}></div>}
      </div>
      {/* Content */}
      <SlideOutWrapper>
        <div className="w-100 h-50">
          {levelLabel && (
            <div className="mb-3 inline-block rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1 text-sm font-accent font-semibold tracking-wide text-emerald-800">
              {levelLabel}
            </div>
          )}
          {content}
        </div>
      </SlideOutWrapper>
    </div>
  )
}

export default TimelineItem
