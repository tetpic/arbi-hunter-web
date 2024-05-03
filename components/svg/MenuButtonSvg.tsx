interface Props {
  color?: string
  className?: string
}

export default function MenuButtonSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6" cy="6" r="3" fill={props.color||'white'}/>
      <circle cx="18" cy="6" r="3" fill={props.color||'white'}/>
      <circle cx="6" cy="18" r="3" fill={props.color||'white'}/>
      <circle cx="18" cy="18" r="3" fill="#6694FA"/>
    </svg>
  )
}

