interface Props {
  color?: string
  className?: string
  percents?: number
  barClassName?: string 
}

export default function CircleProgressSvg(props: Props) {
  const c = Math.PI*(90*2)
  const pct = ((100-props.percents)/100)*c
  return (
    <svg id="svg" width="200" height="200" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset={pct}></circle>
      <circle  id="bar" r="90" cx="100" cy="100" fill="transparent" stroke-dasharray="565.48" stroke-dashoffset={pct}></circle>
    </svg>
  )
}

