import { animated, Spring } from '@react-spring/web'

interface Props {
  children: JSX.Element
}

export default function WithTransition(props: Props) {
  return (
    <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
      {style => <animated.div style={style}>{props.children}</animated.div>}
    </Spring>
  )
}
