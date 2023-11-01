import BackArrowSvg from 'components/svg/BackArrowSvg'
import styles from './index.module.scss'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'

interface Props {
  onClick: ()=>void
  text?: string
  className?: string
}

export default function BackTextButton(props: Props) {
  const {isTabletWidth} = useResize()

  return (<>
  <p className={classNames(styles.backButton, props.className)} onClick={props.onClick}>{isTabletWidth?<BackArrowSvg/>:<ArrowLeftSvg/>}{props.text?props.text: 'Назад'}</p>
  </>)
}