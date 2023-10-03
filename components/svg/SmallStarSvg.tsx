

interface Props {
  color?: string
  className?: string
}

export default function SmallStarActiveSvg(props: Props) {
  return (
    // <svg className={props.className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path d="M6 0L7.67166 3.69916L11.7063 4.1459L8.7048 6.87884L9.52671 10.8541L6 8.844L2.47329 10.8541L3.2952 6.87884L0.293661 4.1459L4.32834 3.69916L6 0Z" fill='#F3CE7B'/>
    // </svg>
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
      <path d="M6 0L7.67166 3.69916L11.7063 4.1459L8.7048 6.87884L9.52671 10.8541L6 8.844L2.47329 10.8541L3.2952 6.87884L0.293661 4.1459L4.32834 3.69916L6 0Z" fill="url(#paint0_linear_3107_21581)"/>
      <defs>
      <linearGradient id="paint0_linear_3107_21581" x1="0.941946" y1="-2.34653" x2="9.37835" y2="-1.91948" gradientUnits="userSpaceOnUse">
      <stop stop-color="#AC6CDB"/>
      <stop offset="1" stop-color="#586DE4"/>
      </linearGradient>
      </defs>
    </svg>
  )
}

