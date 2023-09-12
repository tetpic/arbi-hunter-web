interface Props {
  color?: string
  className?: string
}

export default function OrderListSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M5.22656 4V7.67464" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M6.45117 7.6748H4.00141" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M6.45117 13.3906H4.00141" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M3.9993 10.5327C3.9993 10.5327 5.22418 9.30777 6.04077 10.5327C6.85736 11.7576 3.9993 13.3907 3.9993 13.3907" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M4.00398 16.4527C4.00398 16.4527 4.82057 15.2278 6.04545 16.0444C7.27033 16.8609 6.04546 17.8817 6.04546 17.8817C6.04546 17.8817 7.27033 18.9024 6.04545 19.719C4.82057 20.5356 4.00398 19.3107 4.00398 19.3107" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M6.04297 17.8818H5.22638" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M5.22656 4L4.00168 4.81659" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M10.125 12.166H19.1075" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M10.125 17.8818H19.1075" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
      <path d="M10.125 6.44922H19.1075" stroke="white" strokeLinecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

