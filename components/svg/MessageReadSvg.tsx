interface Props {
  color?: string
  className?: string
}

export default function MessageReadSvg(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className={props.className}>
      <path d="M4.66699 8.0013L5.08366 8.41797M14.667 4.66797L8.00033 11.3346L7.58366 10.918" stroke={props.color||'#6694FA'} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M1.3335 8.0013L4.66683 11.3346L11.3335 4.66797" stroke={props.color||'#6694FA'} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

