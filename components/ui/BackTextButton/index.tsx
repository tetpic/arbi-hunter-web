import BackArrowSvg from 'components/svg/BackArrowSvg'
import styles from './index.module.scss'

interface Props {
  onClick: ()=>void
  text?: string
}

export default function BackTextButton(props: Props) {

  return (<>
  <p className={styles.backButton} onClick={props.onClick}><BackArrowSvg/>{props.text?props.text: 'Назад'}</p>
  </>)
}