interface Props {
  color?: string
  className?: string
}

export default function LinkBigSvg(props: Props) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.4576 15.998L6.57198 17.8836C4.48919 19.9664 4.48919 23.3433 6.57198 25.4261C8.65478 27.5089 12.0317 27.5089 14.1145 25.4261L16.0001 23.5405M16.0001 8.45553L17.8857 6.56991C19.9685 4.48711 23.3454 4.48711 25.4282 6.56991C27.511 8.65271 27.511 12.0296 25.4282 14.1124L23.5425 15.998M12.2291 19.7695L19.7716 12.227" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  )
}

