import styles from './index.module.scss'

import Stories from 'components/ui/Stories'
import MediaCategories from '../../MediaCategories'
import { ICategory } from 'data/interfaces/Common'
import { useMediaContext } from 'context/media_state'
import NewsByCategories from '../NewsByCategories'
import { useEffect } from 'react'

interface Props {
  categories: ICategory[]
}

export default function MainMediaPage(props: Props) {
  const mediaContext = useMediaContext()

  useEffect(()=>{
    if(mediaContext.stories.size === 0) {
      mediaContext.setStories()
    }
  }, [])

  const body = (<>
   {mediaContext.stories.size > 0 &&
      <>
        <p className={styles.title}>Истории</p>
        <Stories stories={[...mediaContext.stories.values()]} />
      </>
    } 
    <p className={styles.title}><span>Рубрики</span> <span>Все</span></p>
    <MediaCategories className={styles.mediaCategories} categories={props.categories} hideNav/>
  </>)

  return (<div className={styles.root}> 
    {body}
    <NewsByCategories hideNav className={styles.news} scrollableTarget='scrollable'/>
      {/* {body}
    </NewsByCategories> */}
  </div>)
}