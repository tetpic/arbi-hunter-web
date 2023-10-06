interface Props {
  color?: string
  className?: string
}

export default function BookMarkSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M7 7V26.191C7 26.5627 7.39116 26.8044 7.72361 26.6382L14.9056 23.0472C15.4686 22.7657 16.1314 22.7657 16.6944 23.0472L23.8764 26.6382C24.2088 26.8044 24.6 26.5627 24.6 26.191V7C24.6 5.89543 23.7046 5 22.6 5H9C7.89543 5 7 5.89543 7 7Z" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

