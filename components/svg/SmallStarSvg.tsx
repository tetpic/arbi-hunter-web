

interface Props {
  color?: string
  className?: string
}

export default function SmallStarActiveSvg(props: Props) {
  return (
    <svg className={props.className} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 0L7.67166 3.69916L11.7063 4.1459L8.7048 6.87884L9.52671 10.8541L6 8.844L2.47329 10.8541L3.2952 6.87884L0.293661 4.1459L4.32834 3.69916L6 0Z" fill='#F3CE7B'/>
    </svg>
  )
}

