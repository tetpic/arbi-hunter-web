interface Props {
  color?: string
  className?: string
}

export default function CheckSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.0917 8L10.313 15.7787C10.0179 16.0738 9.5394 16.0738 9.24427 15.7787L6 12.5344" stroke={props.color? props.color: 'white'} stroke-width="2" stroke-linecap="round"/>
    </svg>
  )
}

