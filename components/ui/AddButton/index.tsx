import PlusSvg from 'components/svg/PlusSvg'
import styles from './index.module.scss'

interface Props {
  onClick: ()=>void
  text?: string
  
}

export default function AddButton(props: Props) {

  return ( <>
    <p className={styles.link} onClick={props.onClick}><PlusSvg className={styles.plusSvg} />{props.text?props.text: 'Добавить'}</p>
  </>)
}