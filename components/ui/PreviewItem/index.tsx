import styles from './index.module.scss'

import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import Button from '../Button'
import P from '../P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import { colors } from 'styles/variables'

interface Props {
  title?: string
  titleElement?: JSX.Element|JSX.Element[]
  children?: JSX.Element|JSX.Element[]|string|null|any
  wrapperClassName?: string
  disableLink?: boolean
  onClick?: ()=>void
}

export default function PreviewItem(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light

  return (
  <div className={styles.root}>
    <div className={styles.top}>
      {props.title &&
        <P styleType={['w600', 'large']} useThemeColor>{props.title}</P>
      }
      {props.titleElement}
      {!props.disableLink &&
        <Button onClick={props.onClick} styleType={['icon', 'backTransparent']}><ArrowRightSvg color={isLightTheme&&colors.black}/></Button>
      } 
    </div> 
    <div className={props.wrapperClassName}>
    {props.children}
    </div>
  </div>)
}