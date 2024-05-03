import BackArrowSvg from 'components/svg/BackArrowSvg'
import styles from './index.module.scss'
import classNames from 'classnames'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import { colors } from 'styles/variables'

interface Props {
  onClick: ()=>void
  text?: string
  className?: string
}

export default function BackTextButton(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light

  return (<>
  <p className={classNames(styles.backButton, props.className)} onClick={props.onClick}>{isTabletWidth?<BackArrowSvg/>:<ArrowLeftSvg color={isLightTheme&&colors.black}/>}{props.text?props.text: 'Назад'}</p>
  </>)
}