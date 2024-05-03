interface Props {
  color?: string
  className?: string
}

export default function SettingsThreeSlidersSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 6L21 6M3 6L12 6M3 18L12 18M3 12H8M12 12H21M16 18H21M16 4V8M8 10V14M16 16V20" stroke={props.color||'white'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

