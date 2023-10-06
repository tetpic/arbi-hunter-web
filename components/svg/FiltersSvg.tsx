interface Props {
  color?: string
  className?: string
}

export default function FiltersSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.71429 9.14286H14.2857M14.2857 9.14286C14.2857 10.3263 15.2451 11.2857 16.4286 11.2857C17.612 11.2857 18.5714 10.3263 18.5714 9.14286C18.5714 7.95939 17.612 7 16.4286 7C15.2451 7 14.2857 7.95939 14.2857 9.14286ZM9.28571 14.8571H17.1429M9.28571 14.8571C9.28571 16.0406 8.32632 17 7.14286 17C5.95939 17 5 16.0406 5 14.8571C5 13.6737 5.95939 12.7143 7.14286 12.7143C8.32632 12.7143 9.28571 13.6737 9.28571 14.8571Z" stroke="white" strokeLinecap="round"/>
    </svg>
  )
}

