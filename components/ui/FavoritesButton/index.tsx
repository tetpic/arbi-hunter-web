import classnames from 'classnames'
import HeartSvg from 'components/svg/HeartSvg'
import styles from './index.module.scss'
import Button, { ButtonStyle } from '../Button'
import StarSvg from '@/components/svg/StarSvg'
import classNames from 'classnames'
import { colors } from 'styles/variables'

interface Props {
  className?: string
  onClick?: (e: React.MouseEvent) => void
  size?: number
  isActive?: boolean
  styleType?: ButtonStyle[]
  altStyleType?: ButtonStyle[]
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
    title='make it favorite'
    styleType={props.styleType||['icon', 'black']}
    altStyleType={props.altStyleType||props.styleType||['icon', 'whitePurple'] }
    onClick={(e)=>props.onClick(e)} 
    className={classnames(styles.heartButton,  props.className)} 
    >
      {props.showStar && 
      <StarSvg size={props.size||24} color={colors.greyLight}  className={classNames(styles.star, props.isActive&&styles.starYellow)}/>
      ||
      <HeartSvg size={props.size||24} color={colors.greyLight}  className={classNames(styles.heart, props.isActive&&styles.heartRed)}/>
      }
    </Button>
  )
}