interface Props {
  color?: string
  className?: string
}

export default function ArrowLeftSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 17.25L8.26218 12.2879C7.91261 11.9218 7.91261 11.3282 8.26218 10.9621L13 6" stroke={props.color||'white'} strokeLinecap="round"/>
    </svg>
  )
}

