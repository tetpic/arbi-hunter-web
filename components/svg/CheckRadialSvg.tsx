interface Props {
  color?: string
  className?: string
}

export default function CheckRadialSvg(props: Props) {
  return (
    <svg className={props.className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM17.7759 9.70711C18.1664 9.31658 18.1664 8.68342 17.7759 8.29289C17.3853 7.90237 16.7522 7.90237 16.3617 8.29289L10.834 13.8206L8.70711 11.6937C8.31658 11.3032 7.68342 11.3032 7.29289 11.6937C6.90237 12.0842 6.90237 12.7174 7.29289 13.1079L9.7261 15.5411C10.338 16.153 11.33 16.153 11.9419 15.5411L17.7759 9.70711Z" fill="white"/>
    </svg>

  )
}

