import CrossSvg from 'components/svg/CrossSvg'
import styles from './index.module.scss'

interface Props {
  text: string
  onClick?: ()=> void
}

export default function RemovableItem(props: Props) {

  return (<p className={styles.item}>
    {props.text} <CrossSvg className={styles.crossSvg} onClick={props.onClick}/>
  </p>)
}