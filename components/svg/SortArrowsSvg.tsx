interface Props {
  color?: string
  className?: string
}

export default function SortArrowsSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3.99985L16 18.9998M8 19.9998L8 4.99985M13 17.9998L15.2929 20.2927C15.6834 20.6833 16.3166 20.6833 16.7071 20.2927L19 17.9998M5 5.99985L7.29289 3.70696C7.68342 3.31643 8.31658 3.31643 8.70711 3.70696L11 5.99985" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>  
)
}

