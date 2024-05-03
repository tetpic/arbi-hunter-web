interface Props {
  color?: string
  className?: string
}

export default function CloseEyeSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.10752 9.5C4.59949 10.75 3.66675 12 3.66675 12C3.66675 12 7.39771 17 12.0001 17C12.5709 17 13.1282 16.9231 13.6667 16.7884M10.3466 7.20833C10.8811 7.07565 11.434 7 12.0001 7C16.6025 7 20.3334 12 20.3334 12C20.3334 12 19.4007 13.25 17.8926 14.5" stroke={props.color||'white'} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10.4643 10.5923C10.1243 10.963 9.91675 11.4573 9.91675 12.0001C9.91675 13.1507 10.8495 14.0834 12.0001 14.0834C12.5679 14.0834 13.0826 13.8562 13.4584 13.4879" stroke={props.color||'white'} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.5 19.5L4.5 4.5" stroke={props.color||'white'} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

