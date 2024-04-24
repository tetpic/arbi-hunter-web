interface Props {
  color?: string
  className?: string
}

export default function ShopSmallSvg(props: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7.44434V18.6548C4 19.0908 4.39797 19.4443 4.88889 19.4443H19.1111C19.602 19.4443 20 19.0908 20 18.6548V7.44434H4Z" stroke={props.color||'#ffffff'} stroke-linejoin="round"/>
      <path d="M20 7.44432L17.4815 4.44434H6.51852L4 7.44432V7.44432" stroke={props.color||'#ffffff'} stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.3586 10.0498C15.3586 11.7066 13.8552 13.0498 12.0006 13.0498C10.146 13.0498 8.64258 11.7066 8.64258 10.0498"stroke={props.color||'#ffffff'}  stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

  )
}