import CrossSvg from 'components/svg/CrossSvg'
import styles from './index.module.scss'
import P from '../P'

interface Props {
  text: string
  onClick?: ()=> void
}

export default function RemovableItem(props: Props) {

  return (<P className={styles.item}>
    <span>{props.text}</span> <CrossSvg className={styles.crossSvg} onClick={props.onClick}/>
  </P>)
}