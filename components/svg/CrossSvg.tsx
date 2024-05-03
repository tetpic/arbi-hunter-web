interface Props {
  color?: string
  className?: string
  onClick?: ()=>void
}

export default function CrossSvg(props: Props) {
  return (
    <svg className={props.className} onClick={props.onClick} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7L17.0001 17" stroke={props.color||'white'} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 17L17.0001 7" stroke={props.color||'white'} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

