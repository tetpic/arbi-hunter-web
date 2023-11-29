import styles from './index.module.scss'

interface Props {
}

export default function MainLanding(props: Props) {


  return ( 
    <div className={styles.root}>
      <p className={styles.test1}>Test</p>
      <p className={styles.test2}>Test</p>
    </div>
  )
}