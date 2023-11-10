interface Props {
  color?: string
  className?: string
}

export default function InformationSmallSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15.6364V11.2727M12 9.09091V9.08364M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="white" stroke-linecap="round"/>
    </svg>

  )
}

