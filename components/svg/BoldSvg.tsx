interface Props {
  color?: string
  className?: string
}

export default function BoldSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12V5.77778C4 4.79594 4.79594 4 5.77778 4H11.5556C13.7647 4 15.5556 5.79086 15.5556 8C15.5556 10.2091 13.7647 12 11.5556 12M4 12V18.2222C4 19.2041 4.79594 20 5.77778 20H15.1111C17.3202 20 19.1111 18.2091 19.1111 16C19.1111 13.7909 17.3202 12 15.1111 12H11.5556M4 12H11.5556" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

