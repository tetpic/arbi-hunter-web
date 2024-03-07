import styles from './index.module.scss'

import Title from 'components/ui/TitleForSection'
import MainSearchBar from '@/components/ui/MainSearchBar'

interface Props {
  title: string
  tags?: string[]
}

export default function Search(props: Props) {

  return (<div className={styles.search}>
    <Title title={props.title} className={styles.smallTitle}/>
    <div className={styles.tags}>
      {props.tags.map(el => {
        return <p className={styles.tag}>{el}</p>
      })}
      {/* <p className={styles.tag}>Разработка</p>
      <p className={styles.tag}>Affiliate Manger</p>
      <p className={styles.tag}>Frontented-Разработчик</p>
      <p className={styles.tag}>SMM-менеджер</p> */}
    </div>
    <MainSearchBar placeholder={props.title} className={styles.searchBar}/>
  </div>
  )
}