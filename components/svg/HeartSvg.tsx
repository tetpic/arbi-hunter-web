interface Props {
  color?: string
  className?: string
  size?: number
}

export default function HeartSvg(props: Props) {
  return (
    <svg style={{width: props.size, height: props.size}} className={props.className} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M15.9918 7.88837C13.5926 5.09234 9.59169 4.34022 6.58563 6.90054C3.57957 9.46086 3.15636 13.7416 5.51704 16.7697C7.47978 19.2873 13.4197 24.5973 15.3665 26.3159C15.5843 26.5082 15.6932 26.6043 15.8203 26.6421C15.9311 26.6751 16.0524 26.6751 16.1633 26.6421C16.2903 26.6043 16.3992 26.5082 16.617 26.3159C18.5638 24.5973 24.5038 19.2873 26.4665 16.7697C28.8272 13.7416 28.4557 9.43393 25.3979 6.90054C22.3402 4.36715 18.391 5.09234 15.9918 7.88837Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

