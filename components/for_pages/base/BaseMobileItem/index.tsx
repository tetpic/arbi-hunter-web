import DocumentSvg from 'components/svg/DocumentSvg'
import styles from './index.module.scss'

import { ICategory } from 'data/interfaces/Common'
import { IArticle } from 'data/interfaces/IArticle'
import Link from 'next/link'

interface Props {
  category?: ICategory
  articles?: IArticle[]
}

export default function BaseMobileItem(props: Props) {

  return (<div className={styles.root}> 
    <p className={styles.categoryName}>{props.category.name}</p>
    <div className={styles.items}>
      {props.articles?.map(el=> {
        return (
          <Link href={'/media/article/'+el.id} className={styles.item} key={el.id}><DocumentSvg/> {el.name}</Link>
        )
      })}
    </div>

  </div>)
}