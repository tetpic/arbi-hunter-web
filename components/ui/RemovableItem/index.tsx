import CrossSvg from 'components/svg/CrossSvg'
import styles from './index.module.scss'
import P from '../P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import classNames from 'classnames'
import { colors } from 'styles/variables'

interface Props {
  text: string
  onClick?: ()=> void
}

export default function RemovableItem(props: Props) {
  const {theme} = useAppContext()
  const isLightTheme = theme === AppTheme.Light



  return (<P styleType={['medium']} useThemeColor className={classNames(styles.item, isLightTheme&&styles.item_light)}>
    <span>{props.text}</span> <CrossSvg className={styles.crossSvg} color={isLightTheme&&colors.black} onClick={props.onClick}/>
  </P>)
}