interface Props {
  color?: string
  className?: string
}

export default function FolderClosedSvg(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M6 14H26M6 22V10C6 8.89543 6.89543 8 8 8H11.1716C11.702 8 12.2107 8.21071 12.5858 8.58579L13.4142 9.41421C13.7893 9.78929 14.298 10 14.8284 10H24C25.1046 10 26 10.8954 26 12V22C26 23.1046 25.1046 24 24 24H8C6.89543 24 6 23.1046 6 22Z" stroke="white" stroke-linecap="round"/>
    </svg>
  )
}

