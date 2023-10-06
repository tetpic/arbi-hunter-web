interface Props {
  color?: string
  className?: string
}

export default function EducationSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M22 9.96875L12 5.96875L2 9.96875L12 13.9688L22 9.96875ZM22 9.96875V15.9688M6 11.5688V16.9688C6 17.7644 6.63214 18.5275 7.75736 19.0901C8.88258 19.6527 10.4087 19.9688 12 19.9688C13.5913 19.9688 15.1174 19.6527 16.2426 19.0901C17.3679 18.5275 18 17.7644 18 16.9688V11.5688" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

