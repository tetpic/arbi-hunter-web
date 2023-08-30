interface Props {
  color?: string
  className?: string
}

export default function PlusSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="white"/>
      <path d="M12.0164 6.46094L12.0019 17.5267" stroke="#24242C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.45782 11.9935L17.5236 11.9935" stroke="#24242C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

