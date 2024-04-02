interface Props {
  color?: string
  className?: string
}

export default function MenuHeartSvg(props: Props) {
  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4938 5.91615C10.6944 3.81913 7.69377 3.25504 5.43923 5.17528C3.18468 7.09552 2.86727 10.3061 4.63778 12.5771C6.10984 14.4654 10.5648 18.4478 12.0249 19.7368C12.1882 19.881 12.2699 19.9531 12.3652 19.9815C12.4483 20.0062 12.5393 20.0062 12.6225 19.9815C12.7178 19.9531 12.7994 19.881 12.9628 19.7368C14.4229 18.4478 18.8778 14.4654 20.3499 12.5771C22.1204 10.3061 21.8417 7.07532 19.5484 5.17528C17.2551 3.27524 14.2933 3.81913 12.4938 5.91615Z" stroke="#737389" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  )
}

