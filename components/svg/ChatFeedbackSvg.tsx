interface Props {
  color?: string
  className?: string
}

export default function ChatFeedbackSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8V15M15 13L12.7071 15.2929C12.3166 15.6834 11.6834 15.6834 11.2929 15.2929L9 13M21 12C21 16.9706 16.9706 21 12 21C10.843 21 9.73701 20.7817 8.72095 20.384C8.33909 20.2345 7.92598 20.1704 7.5216 20.2385L3.69276 20.8833C3.35374 20.9404 3.05957 20.6463 3.11667 20.3072L3.76147 16.4784C3.82957 16.074 3.76547 15.6609 3.61601 15.279C3.21832 14.263 3 13.157 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-linecap="round"/>
    </svg>
  )
}