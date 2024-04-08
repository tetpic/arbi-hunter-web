interface Props {
  color?: string
  className?: string
}

export default function AlignRightSvg(props: Props) {
  return (
    <svg className={props.className} width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* <rect x="1.5" y="1.5" width="23" height="23" rx="5.5" stroke="white"/> */}
      <line x1="5" y1="7" x2="21" y2="7" stroke="white" stroke-width="2"/>
      <line x1="9" y1="13" x2="21" y2="13" stroke="white" stroke-width="2"/>
      <line x1="13" y1="19" x2="21" y2="19" stroke="white" stroke-width="2"/>
    </svg>
  )
}

