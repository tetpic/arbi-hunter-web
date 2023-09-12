import classnames from 'classnames'
import HeartSvg from 'components/svg/HeartSvg'
import IconButton from '../IconButton'
import styles from './index.module.scss'

interface Props {
  className?: string
  onClick?: () => void
  size?: number
  isActive?: boolean
}

export default function FavoritesButton(props: Props) {

  return (
    <IconButton 
    onClick={props.onClick} 
    className={classnames(styles.heartButton, props.isActive&&styles.heartButton_active, props.className)} 
    bgColor={'transparent'}>
      <HeartSvg size={props.size||24} className={props.isActive&&styles.heartRed}/>
    </IconButton>
  )
}