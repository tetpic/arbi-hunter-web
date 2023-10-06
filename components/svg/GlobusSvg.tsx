interface Props {
  color?: string
  className?: string
}

export default function GlobusSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
      <path d="M12 23.9688C18.0751 23.9688 23 19.0439 23 12.9688C23 6.89362 18.0751 1.96875 12 1.96875M12 23.9688C5.92487 23.9688 1 19.0439 1 12.9688C1 6.89362 5.92487 1.96875 12 1.96875M12 23.9688C14.2091 23.9688 16 19.0439 16 12.9688C16 6.89362 14.2091 1.96875 12 1.96875M12 23.9688C9.79086 23.9688 8 19.0439 8 12.9688C8 6.89362 9.79086 1.96875 12 1.96875M2 8.96875H22M2 15.9688H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

