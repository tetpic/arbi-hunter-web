interface Props {
  color?: string
  className?: string
  type: number
}

export default function ColumnLayoutSvg(props: Props) {

  const getImage = () => {
    switch (props.type) {
      case 2: 
      return <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M28 7V49M7 9.33333C7 8.71449 7.24583 8.121 7.68342 7.68342C8.121 7.24583 8.71449 7 9.33333 7H46.6667C47.2855 7 47.879 7.24583 48.3166 7.68342C48.7542 8.121 49 8.71449 49 9.33333V46.6667C49 47.2855 48.7542 47.879 48.3166 48.3166C47.879 48.7542 47.2855 49 46.6667 49H9.33333C8.71449 49 8.121 48.7542 7.68342 48.3166C7.24583 47.879 7 47.2855 7 46.6667V9.33333Z" stroke="#737389" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      case 3:
      return  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 7V49M35 7V49M7 9.33333C7 8.71449 7.24583 8.121 7.68342 7.68342C8.121 7.24583 8.71449 7 9.33333 7H46.6667C47.2855 7 47.879 7.24583 48.3166 7.68342C48.7542 8.121 49 8.71449 49 9.33333V46.6667C49 47.2855 48.7542 47.879 48.3166 48.3166C47.879 48.7542 47.2855 49 46.6667 49H9.33333C8.71449 49 8.121 48.7542 7.68342 48.3166C7.24583 47.879 7 47.2855 7 46.6667V9.33333Z" stroke="#737389" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    }
  }

  return getImage()
}

