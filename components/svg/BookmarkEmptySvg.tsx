interface Props {
  color?: string
  className?: string
}

export default function BookmarkEmptySvg(props: Props) {
  return (
    <svg className={props.className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.66699 14.6666L2.66699 3.33331C2.66699 2.22874 3.56242 1.33331 4.66699 1.33331H11.3337C12.4382 1.33331 13.3337 2.22874 13.3337 3.33331V14.6666L8.00033 11.9091L2.66699 14.6666Z" stroke="white" strokeLinejoin="round"/>
    </svg>
  )
}

