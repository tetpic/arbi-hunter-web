interface Props {
  color?: string
  className?: string
}

export default function ArrowDownSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.25 11L12.2879 15.7378C11.9218 16.0874 11.3282 16.0874 10.9621 15.7378L6 11" stroke="white" stroke-linecap="round"/>
    </svg>
  )
}

