interface Props {
  color?: string
  className?: string
}

export default function UserSmallSvg(props: Props) {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className={props.className}>
      <path d="M12 6.5C12.7956 6.5 13.5587 6.81607 14.1213 7.37868C14.6839 7.94129 15 8.70435 15 9.5C15 10.2956 14.6839 11.0587 14.1213 11.6213C13.5587 12.1839 12.7956 12.5 12 12.5C11.2043 12.5 10.4413 12.1839 9.87868 11.6213C9.31607 11.0587 9 10.2956 9 9.5C9 8.70435 9.31607 7.94129 9.87868 7.37868C10.4413 6.81607 11.2043 6.5 12 6.5ZM12 14C15.315 14 18 15.3425 18 17V18.5H6V17C6 15.3425 8.685 14 12 14Z" fill={props.color||'#737389'}/>
    </svg>
  )
}

