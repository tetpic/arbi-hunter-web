interface Props {
  color?: string
  className?: string
}

export default function LockSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.5 15C14.5 16.11 13.61 17 12.5 17C11.39 17 10.5 16.1 10.5 15C10.5 13.89 11.39 13 12.5 13C13.61 13 14.5 13.9 14.5 15ZM13.59 20C13.71 20.72 13.96 21.39 14.31 22H6.5C5.39 22 4.5 21.1 4.5 20V10C4.5 8.89 5.39 8 6.5 8H7.5V6C7.5 3.24 9.74 1 12.5 1C15.26 1 17.5 3.24 17.5 6V8H18.5C19.61 8 20.5 8.9 20.5 10V13.09C20.17 13.04 19.84 13 19.5 13C19.16 13 18.83 13.04 18.5 13.09V10H6.5V20H13.59ZM9.5 8H15.5V6C15.5 4.34 14.16 3 12.5 3C10.84 3 9.5 4.34 9.5 6V8ZM21.84 15.84L18.25 19.43L16.66 17.84L15.5 19L18.25 22L23 17.25L21.84 15.84Z" fill="white"/>
    </svg>
  )
}

