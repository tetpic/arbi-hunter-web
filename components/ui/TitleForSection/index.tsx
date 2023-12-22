import styles from './index.module.scss'

import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import Button from '../Button'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import Link from 'next/link'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'

interface Props {
  title: string|JSX.Element
  emoji?: JSX.Element
  className?: string
  onBackClick?: ()=>void
  showButton?: boolean 
  link?: string
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
  const {isTabletWidth} = useResize()


  return (
    <div className={classNames(styles.root, props.className)}>
      {((isTabletWidth&&props.onBackClick)||props.showButton) &&
        <Button className={styles.backButton} onClick={props.onBackClick}><ArrowLeftSvg/></Button>
      }

      {props.title} {props.emoji}
      {((isTabletWidth&&props.onBackClick)||props.showButton)&&
        props.rightButton||<div className={styles.filler}></div>
      }
      {isTabletWidth && props.link &&
        <Link className={styles.link} href={props.link}>Все <ArrowRightSvg/></Link>
      }
    </div>
  )
}

