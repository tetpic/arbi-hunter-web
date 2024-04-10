interface Props {
  color?: string
  className?: string
}

export default function PlusThinSvg(props: Props) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1V33M33 17L1 17" stroke="white" stroke-width="2" stroke-linecap="round" />
    </svg>
  )
}

