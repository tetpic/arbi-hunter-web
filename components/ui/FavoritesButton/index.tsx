import classnames from 'classnames'
import HeartSvg from 'components/svg/HeartSvg'
import styles from './index.module.scss'
import Button, { ButtonStyle } from '../Button'
import StarSvg from '@/components/svg/StarSvg'
import classNames from 'classnames'

interface Props {
  className?: string
  onClick?: (e: React.MouseEvent) => void
  size?: number
  isActive?: boolean
  styleType?: ButtonStyle[]
  showStar?: boolean
}

/**
 * @param className ?: string
 * @param onClick ?: (e: React.MouseEvent) => void
 * @param size ?: number
 * @param isActive ?: boolean
 */

export default function FavoritesButton(props: Props) {

  return (
    <Button 
    styleType={props.styleType||['icon', 'black']}
    altStyleType={['icon', 'whitePurple', 'borderBlue', 'invertSvg'] }
    onClick={(e)=>props.onClick(e)} 
    className={classnames(styles.heartButton,  props.className)} 
    >
      {props.showStar && 
      <StarSvg size={props.size||24} className={classNames(styles.star, props.isActive&&styles.starYellow)}/>
      ||
      <HeartSvg size={props.size||24} className={classNames(styles.heart, props.isActive&&styles.heartRed)}/>
      }
    </Button>
  )
}