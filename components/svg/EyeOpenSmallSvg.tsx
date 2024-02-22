interface Props {
  color?: string
  className?: string
}

export default function EyeOpenSmallSvg(props: Props) {
  return (
    <svg width="25" height="24" className={props.className} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.24251 13.1718C2.90094 12.4286 2.90094 11.5714 3.24251 10.8282C4.82361 7.38843 8.2996 5 12.3334 5C16.3673 5 19.8432 7.38843 21.4244 10.8282C21.7659 11.5714 21.7659 12.4286 21.4244 13.1718C19.8432 16.6116 16.3673 19 12.3334 19C8.2996 19 4.82361 16.6116 3.24251 13.1718Z" stroke="white" stroke-width="2"/>
      <path d="M15.3334 12C15.3334 13.6569 13.9903 15 12.3334 15C10.6766 15 9.33343 13.6569 9.33343 12C9.33343 10.3431 10.6766 9 12.3334 9C13.9903 9 15.3334 10.3431 15.3334 12Z" stroke="white" stroke-width="2"/>
    </svg>

  )
}

