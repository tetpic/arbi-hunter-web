interface Props {
  color?: string
  className?: string
}

export default function ShareSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.50243 12.4402L13.5051 15.3306" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.125 8.56657C16.1605 8.56657 17 7.74576 17 6.73324C17 5.72071 16.1605 4.8999 15.125 4.8999C14.0895 4.8999 13.25 5.72071 13.25 6.73324C13.25 7.74576 14.0895 8.56657 15.125 8.56657Z" stroke="white" strokeLinejoin="round"/>
      <path d="M6.875 13.3332C7.91053 13.3332 8.75 12.5124 8.75 11.4998C8.75 10.4873 7.91053 9.6665 6.875 9.6665C5.83947 9.6665 5 10.4873 5 11.4998C5 12.5124 5.83947 13.3332 6.875 13.3332Z" stroke="white" strokeLinejoin="round"/>
      <path d="M13.2495 7.67743L8.50161 10.4901" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.125 14.4334C16.1605 14.4334 17 15.2542 17 16.2668C17 17.2793 16.1605 18.1001 15.125 18.1001C14.0895 18.1001 13.25 17.2793 13.25 16.2668C13.25 15.2542 14.0895 14.4334 15.125 14.4334Z" stroke="white" strokeLinejoin="round"/>
    </svg>
  )
}

