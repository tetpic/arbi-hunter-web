interface Props {
  color?: string
  className?: string
}

export default function ShopSvg(props: Props) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 8.79883V26.7365C5 27.4342 5.54721 27.9998 6.22222 27.9998H25.7778C26.4528 27.9998 27 27.4342 27 26.7365V8.79883H5Z" stroke="white" strokeLinejoin="round"/>
      <path d="M27 8.80023L23.537 4H8.46296L5 8.80023V8.80023" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20.6166 12.9688C20.6166 15.6198 18.5494 17.769 15.9994 17.769C13.4493 17.769 11.3821 15.6198 11.3821 12.9688" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

