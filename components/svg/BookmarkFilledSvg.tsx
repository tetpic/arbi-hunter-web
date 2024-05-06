interface Props {
  color?: string
  className?: string
}

export default function BookmarkFilledSvg(props: Props) {
  return (
    <svg className={props.className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.6665 14.6666L2.6665 3.33331C2.6665 2.22874 3.56193 1.33331 4.6665 1.33331H11.3332C12.4377 1.33331 13.3332 2.22874 13.3332 3.33331V14.6666L7.99984 11.9091L2.6665 14.6666Z" fill={props.color||'white'} stroke={props.color||'white'} strokeLinejoin="round"/>
    </svg>
  )
}

