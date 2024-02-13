import styles from './index.module.scss'

import classNames from 'classnames'
import Button from '../Button'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import Link from 'next/link'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import { useAppContext } from 'context/state'

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
 */
export default function Title(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size


  return (
    <div className={classNames(styles.root, props.className)}>
      {((isTabletWidth&&props.onBackClick)||props.showButton) &&
        <Button styleType={['icon', 'black']} className={props.itemClassName} onClick={props.onBackClick}><ArrowLeftSvg/></Button>
      }

      {props.title} {props.emoji}
      {((isTabletWidth&&props.onBackClick)||props.showButton)&&!props.rightButton&&
        <div className={styles.filler}></div>
      }
      {isTabletWidth && props.link &&
        <Link className={classNames(styles.link, props.itemClassName)} href={props.link}>Все <ArrowRightSvg/></Link>
      }
      {isTabletWidth && props.onAllWatchClick && 
        <div className={classNames(styles.link, props.itemClassName)} onClick={props.onAllWatchClick}>Все <ArrowRightSvg/></div>
      }
      {props.rightButton}
    </div>
  )
}

