interface Props {
  color?: string
  className?: string
}

export default function PlayTransparentSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
      <path d="M13 24.5C19.6274 24.5 25 19.1274 25 12.5C25 5.87258 19.6274 0.5 13 0.5C6.37258 0.5 1 5.87258 1 12.5C1 19.1274 6.37258 24.5 13 24.5Z" stroke="#F3CE7B" strokeLinejoin="round"/>
      <path d="M10.5988 12.4997V8.34279L14.1988 10.4212L17.7988 12.4997L14.1988 14.5782L10.5988 16.6566V12.4997Z" stroke="#F3CE7B" strokeLinejoin="round"/>
    </svg>
  )
}

