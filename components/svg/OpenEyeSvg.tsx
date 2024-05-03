interface Props {
  color?: string
  className?: string
}

export default function OpenEyeSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.0002 20C15.0528 20 17.8392 18.3028 19.957 16.4718C22.7223 14.0811 22.7223 9.91895 19.957 7.52816C17.8392 5.69721 15.0528 4 12.0002 4C8.94767 4 6.1613 5.69721 4.04352 7.52816C1.27821 9.91895 1.27821 14.0811 4.04352 16.4718C6.1613 18.3028 8.94767 20 12.0002 20Z" stroke={props.color||'white'} strokeLinejoin="round"/>
      <path d="M11.9993 15.3332C13.6561 15.3332 14.9993 13.8408 14.9993 11.9998C14.9993 10.1589 13.6561 8.6665 11.9993 8.6665C10.3424 8.6665 8.99927 10.1589 8.99927 11.9998C8.99927 13.8408 10.3424 15.3332 11.9993 15.3332Z" stroke={props.color||'white'} strokeLinejoin="round"/>
    </svg>
  )
}

