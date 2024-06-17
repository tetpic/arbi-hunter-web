interface Props {
  color?: string
  className?: string
}

export default function PlayButtonWhiteSvg(props: Props) {
  return (
    <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <circle cx="22.5" cy="22.5" r="22.5" fill="white"/>
      <path d="M29.361 21.2519C30.3457 21.7932 30.3457 23.2081 29.361 23.7494L19.8615 28.9715C18.9118 29.4936 17.75 28.8065 17.75 27.7227L17.75 17.2786C17.75 16.1949 18.9118 15.5078 19.8615 16.0298L29.361 21.2519Z" fill="#17233F"/>
    </svg>
  )
}

