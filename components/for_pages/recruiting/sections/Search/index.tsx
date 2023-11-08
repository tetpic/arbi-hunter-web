import styles from './index.module.scss'

import Title from 'components/ui/TitleForSection'
import SearchBar from 'components/ui/SearchBar'

interface Props {
  title: string
}

export default function Search(props: Props) {

  return (<div className={styles.search}>
    <Title title={props.title} className={styles.smallTitle}/>
    <div className={styles.tags}>
      <p className={styles.tag}>Разработка</p>
      <p className={styles.tag}>Маркетинг</p>
      <p className={styles.tag}>Разработка</p>
      <p className={styles.tag}>SMM</p>
    </div>
    <SearchBar/>
  </div>
  )
}