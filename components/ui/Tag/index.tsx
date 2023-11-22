import styles from './index.module.scss'

interface Props {
  onClick?: ()=>void
  text: string
}

export default function Tag(props: Props) {

  return (
    <p className={styles.tag} onClick={props.onClick}>{props.text}</p>
  )
}