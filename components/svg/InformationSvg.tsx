interface Props {
  color?: string
  className?: string
}

export default function InformationSvg(props: Props) {
  return (
    <svg className={props.className} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16.0002 22.6654V14.6654M16.0002 10.6654V10.652M30.6668 15.9987C30.6668 24.0989 24.1003 30.6654 16.0002 30.6654C7.89999 30.6654 1.3335 24.0989 1.3335 15.9987C1.3335 7.89852 7.89999 1.33203 16.0002 1.33203C24.1003 1.33203 30.6668 7.89852 30.6668 15.9987Z" stroke={props.color||'white'} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

