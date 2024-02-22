interface Props {
  color?: string
  className?: string
}

export default function MessageDownSvg(props: Props) {
  return (
  <svg width="25" className={props.className} height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.6665 8V15M15.6665 13L13.3736 15.2929C12.9831 15.6834 12.3499 15.6834 11.9594 15.2929L9.6665 13M21.6665 12C21.6665 16.9706 17.6371 21 12.6665 21C11.5095 21 10.4035 20.7817 9.38746 20.384C9.00559 20.2345 8.59248 20.1704 8.1881 20.2385L4.35926 20.8833C4.02024 20.9404 3.72608 20.6463 3.78317 20.3072L4.42798 16.4784C4.49608 16.074 4.43198 15.6609 4.28251 15.279C3.88482 14.263 3.6665 13.157 3.6665 12C3.6665 7.02944 7.69594 3 12.6665 3C17.6371 3 21.6665 7.02944 21.6665 12Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>

  )
}

