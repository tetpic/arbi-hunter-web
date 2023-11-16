interface Props {
  color?: string
  className?: string
}

export default function StarFilledSvg(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={props.className} width="32" height="29" viewBox="0 0 32 29" fill="none">
      <path d="M15.8457 0L20.3035 9.86442L31.0626 11.0557L23.0585 18.3436L25.2503 28.9443L15.8457 23.584L6.44114 28.9443L8.63289 18.3436L0.628798 11.0557L11.3879 9.86442L15.8457 0Z" fill={props.color||'#737389'}/>
    </svg>
  )
}

