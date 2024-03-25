interface Props {
  color?: string
  className?: string
}

export default function ArrowSvg(props: Props) {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5H18M13 6.5L18.2929 11.7929C18.6834 12.1834 18.6834 12.8166 18.2929 13.2071L13 18.5" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  )
}

