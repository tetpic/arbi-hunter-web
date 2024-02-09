interface Props {
  color?: string
  className?: string
}

export default function SettingsTwoSlidersSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.73138 9.14286H14.3028M14.3028 9.14286C14.3028 10.3263 15.2622 11.2857 16.4457 11.2857C17.6291 11.2857 18.5885 10.3263 18.5885 9.14286C18.5885 7.95939 17.6291 7 16.4457 7C15.2622 7 14.3028 7.95939 14.3028 9.14286ZM9.3028 14.8571H17.1599M9.3028 14.8571C9.3028 16.0406 8.34341 17 7.15995 17C5.97648 17 5.01709 16.0406 5.01709 14.8571C5.01709 13.6737 5.97648 12.7143 7.15995 12.7143C8.34341 12.7143 9.3028 13.6737 9.3028 14.8571Z" stroke="white" stroke-linecap="round"/>
    </svg>
  )
}

