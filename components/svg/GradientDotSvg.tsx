interface Props {
  color?: string
  className?: string
}

export default function GradientDotSvg(props: Props) {
  return (
    <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="4" cy="4.5" r="4" fill="url(#paint0_linear_9686_33838)"/>
      <defs>
        <linearGradient id="paint0_linear_9686_33838" x1="0.627964" y1="-1.06435" x2="6.25223" y2="-0.779654" gradientUnits="userSpaceOnUse">
        <stop stop-color="#AC6CDB"/>
        <stop offset="1" stop-color="#586DE4"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

