interface Props {
  color?: string
  className?: string
}

export default function ArrowRightSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 6.75L15.7378 11.7121C16.0874 12.0782 16.0874 12.6718 15.7378 13.0379L11 18" stroke="white" strokeLinecap="round"/>
    </svg>
  )
}

