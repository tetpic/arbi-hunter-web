interface Props {
  color?: string
  className?: string
}

export default function ItalicSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.5556 4H17.6667M7 20H14.1111M14.1111 4L10.5556 20" stroke="white" stroke-linecap="round"/>
    </svg>
  )
}

