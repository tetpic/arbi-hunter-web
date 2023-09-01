interface Props {
  color?: string
  className?: string
}

export default function FolderSvg(props: Props) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.33325 8.6665C5.33325 7.56193 6.22868 6.6665 7.33325 6.6665H13.5685L16.3136 9.96062H25.294C26.3986 9.96062 27.294 10.8561 27.294 11.9606V23.3332C27.294 24.4377 26.3986 25.3332 25.294 25.3332H7.33325C6.22868 25.3332 5.33325 24.4377 5.33325 23.3332V8.6665Z" stroke="white" strokeLinejoin="round"/>
    </svg>
  )
}

