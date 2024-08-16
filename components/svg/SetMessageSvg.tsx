interface Props {
  color?: string
  className?: string
}

export default function SetMessageSvg(props: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.1111 10.4444L11.4972 14.0583C11.3453 14.2102 11.0991 14.2102 10.9472 14.0583L8.88889 12M19 12C19 15.866 15.866 19 12 19H5V12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" stroke={props.color || 'white'} stroke-linecap="round"/>
    </svg>

  )
}

