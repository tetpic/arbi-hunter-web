interface Props {
  color?: string
  className?: string
}

export default function CloseTransparentSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M7 7L17.0001 17" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7 17L17.0001 7" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  )
}

