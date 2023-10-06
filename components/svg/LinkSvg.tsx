interface Props {
  color?: string
  className?: string
}

export default function LinkSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.22874 11L7.28593 11.9428C6.24453 12.9842 6.24453 14.6727 7.28593 15.7141C8.32733 16.7555 10.0158 16.7555 11.0572 15.7141L12 14.7712M12 7.22877L12.9428 6.28596C13.9842 5.24456 15.6726 5.24456 16.714 6.28596C17.7554 7.32736 17.7554 9.0158 16.714 10.0572L15.7712 11M10.1145 12.8858L13.8857 9.11452" stroke="white" strokeLinecap="round"/>
    </svg>
  )
}

