interface Props {
  color?: string
  className?: string
}

export default function TimerSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M12 6.96875C7.58172 6.96875 4 10.5505 4 14.9688C4 19.387 7.58172 22.9688 12 22.9688C16.4183 22.9688 20 19.387 20 14.9688C20 10.5505 16.4183 6.96875 12 6.96875ZM12 6.96875V3.96875M12 10.9688V14.9688M10 3.96875H14M17.6569 9.3119L19 7.96875" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

