import styles from './index.module.scss'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import Button from '../Button'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'

interface Props {
  title: string
  emoji?: JSX.Element
  className?: string
  onBackClick?: ()=>void
  showButton?: boolean 
}

export default function Title(props: Props) {
  const {isTabletWidth} = useResize()


  return (
    <div className={classNames(styles.root, props.className)}>
      {((isTabletWidth&&props.onBackClick)||props.showButton) &&
        <Button className={styles.backButton} onClick={props.onBackClick}><ArrowLeftSvg/></Button>
      }

      {props.title} {props.emoji}
      {((isTabletWidth&&props.onBackClick)||props.showButton)&&
        <div className={styles.filler}></div>
      }
    </div>
  )
}

