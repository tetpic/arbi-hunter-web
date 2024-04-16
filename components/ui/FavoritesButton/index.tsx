import classnames from 'classnames'
import HeartSvg from 'components/svg/HeartSvg'
import styles from './index.module.scss'
import Button from '../Button'

interface Props {
  className?: string
  onClick?: (e: React.MouseEvent) => void
  size?: number
  isActive?: boolean
}

export default function FavoritesButton(props: Props) {

  return (
    <Button 
    styleType={['icon', 'black']}
    altStyleType={['icon', 'whitePurple', 'borderBlue', 'invertSvg'] }
    onClick={(e)=>props.onClick(e)} 
    className={classnames(styles.heartButton, props.isActive&&styles.heartButton_active, props.className)} 
    >
      <HeartSvg size={props.size||24} className={props.isActive&&styles.heartRed}/>
    </Button>
  )
}