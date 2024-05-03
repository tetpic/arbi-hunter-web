import classNames from 'classnames'
import ThreeDotsSvg from 'components/svg/ThreeDotsSvg'
import Button from '../Button'
import styles from './index.module.scss'

interface Props {
  className?: string
  onClick?: (e: React.MouseEvent<Element, MouseEvent>)=>void
  onMouseEnter?: (e: React.MouseEvent<Element, MouseEvent>)=>void
}

export default function ThreeDotsButton(props: Props) {

  return (
    <Button 
    className={classNames(styles.threeDots, props.className)} 
    altStyleType={['icon', 'white', 'invertSvg']}
    onClick={(e)=> props.onClick?.(e)} 
    onMouseEnter={(e)=> {props.onMouseEnter?.(e)}}>
      <ThreeDotsSvg/>
    </Button> 
  )
}