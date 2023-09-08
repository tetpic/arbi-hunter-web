interface Props {
  color?: string
  className?: string
}

export default function UnorderedListSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.125 12.166H19.1075" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.125 17.8818H19.1075" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10.125 6.44922H19.1075" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="6.5" cy="6.5" r="1.5" fill="#D9D9D9"/>
      <circle cx="6.5" cy="12.5" r="1.5" fill="#D9D9D9"/>
      <circle cx="6.5" cy="17.5" r="1.5" fill="#D9D9D9"/>
    </svg>
  )
}

