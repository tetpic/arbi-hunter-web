import BackArrowSvg from 'components/svg/BackArrowSvg'
import styles from './index.module.scss'
import classNames from 'classnames'

interface Props {
  onClick: ()=>void
  text?: string
  className?: string
}

export default function BackTextButton(props: Props) {

  return (<>
  <p className={classNames(styles.backButton, props.className)} onClick={props.onClick}><BackArrowSvg/>{props.text?props.text: 'Назад'}</p>
  </>)
}