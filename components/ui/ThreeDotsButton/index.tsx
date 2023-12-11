import classNames from 'classnames'
import ThreeDotsSvg from 'components/svg/ThreeDotsSvg'
import Button from '../Button'
import styles from './index.module.scss'

interface Props {
  className?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>)=>void
  onMouseEnter?: () => void
}

export default function ThreeDotsButton(props: Props) {

  return (
    <Button className={classNames(styles.threeDots, props.className)} onClick={props.onClick} onMouseEnter={props.onMouseEnter}><ThreeDotsSvg/></Button> 
  )
}