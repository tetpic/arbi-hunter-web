interface Props {
  color?: string
  className?: string
  onClick?: ()=>void
}

export default function CrossSvg(props: Props) {
  return (
    <svg className={props.className} onClick={props.onClick} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_3245_32714)">
        <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#24242C"/>
        <path d="M7 7L17.0001 17" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7 17L17.0001 7" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_3245_32714">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  )
}

