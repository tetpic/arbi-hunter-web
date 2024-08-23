import { CSSProperties } from 'react'

interface Props {
  color?: string
  className?: string
  style?: CSSProperties
}

export default function RecordSvg(props: Props) {
  return (
    <svg className={props.className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="32" 
    height="32" 
    viewBox="0 0 32 32" 
    fill="none" 
    style={props.style}
    >
      <circle cx="16" cy="16" r="16" fill="#D9D9D9"/>
      <circle cx="16" cy="16" r="12" fill="#B14E4E"/>
    </svg>
  )
}

