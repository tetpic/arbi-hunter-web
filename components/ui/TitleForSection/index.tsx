import styles from './index.module.scss'

import classNames from 'classnames'
import Button from '../Button'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import Link from 'next/link'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import { useAppContext } from 'context/state'
import P from '../P'
import { AppTheme } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  title: string|JSX.Element
  emoji?: JSX.Element
  className?: string
  itemClassName?: string
  onBackClick?: ()=>void
  showButton?: boolean 
  link?: string
  onAllWatchClick?: ()=>void
  rightButton?: JSX.Element
}

/**
 * @title string|JSX.Element
 * @emoji JSX.Element
 * @className string
 * @onBackClick ()=>void
 * @showButton boolean 
 * @link string
 * @rightButton ?: JSX.Element
 * @onAllWatchClick ?: ()=>void
 */
export default function Title(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()


  return (
    <div className={classNames(styles.root, props.className)}>
      {((isTabletWidth&&props.onBackClick)||props.showButton) &&
        <Button styleType={['icon', 'black']} altStyleType={['icon', 'white',  'invertSvg']} className={classNames(styles.backButton,props.itemClassName)} onClick={props.onBackClick}><ArrowLeftSvg/></Button>
      }

      <P styleType={['huge','w600']} style={{marginLeft: '-1px'}} useThemeColor>{props.title}</P> {props.emoji}
      {((isTabletWidth&&props.onBackClick)||props.showButton)&&!props.rightButton&&
        <div className={styles.filler}></div>
      }
      {isTabletWidth && props.link &&
        <Link className={classNames(styles.link, props.itemClassName)} href={props.link}>{t('watchAllAlt')} <ArrowRightSvg color={isLightTheme&&'black'}/></Link>
      }
      {isTabletWidth && props.onAllWatchClick && 
        <div 
        className={classNames(styles.link, props.itemClassName)} 
        onClick={props.onAllWatchClick}>
          <P useThemeColor>{t('watchAllAlt')}</P> <ArrowRightSvg color={isLightTheme&&'black'}/>
        </div>
      }
      {props.rightButton}
    </div>
  )
}

