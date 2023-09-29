import Navigation from 'components/ui/Navigation'
import TitleForSection from 'components/ui/TitleForSection'
import { useCallback, useState } from 'react'
import { NavigationSet } from 'types/types'
import MediaCommunities from './Communities'
import styles from './index.module.scss'

interface Props {
}

export enum MediaNav {
  AllArticles='allArticles',
  Subscriptions='subscriptions',
  Communities='communities',
  
}

export default function MediaPage(props: Props) {
  const [page, pager] = useState<MediaNav>(MediaNav.Communities)

  const navSet = useCallback(((): NavigationSet<MediaNav>[] => {
    let result:{name: string, type: MediaNav, icon?: JSX.Element}[]  = []
    result = Object.values(MediaNav).map(page => {
      switch(page) {
        case MediaNav.AllArticles:
        return {name: 'Все статьи', type: page}

        case MediaNav.Subscriptions:
        return {name: 'Мои подписки', type: page}

        case MediaNav.Communities:
        return {name: 'Сообщества', type: page}
      }
    })
    return result
  } ), [page])

  const body = (()=>{
    switch(page) {
      case MediaNav.AllArticles:
        return <>Раздел &quot;все статьи&quot; в разработке</>
      case MediaNav.Subscriptions:
        return <>мои подписки</>
      case MediaNav.Communities:
        return <MediaCommunities/>
    }
  })()

  const title = (()=> {
    switch(page) {
      case MediaNav.AllArticles:
        return 'Медиа'
      case MediaNav.Subscriptions:
        return 'Мои подписки'
      case MediaNav.Communities:
        return 'Сообщества'
    }
  })()


  return (<div className={styles.root}> 
    <div className={styles.contentWrapper}>
      <TitleForSection title={title}/>
      <div className={styles.bodyWrapper}>
        {body}
      </div>
    </div>
    <Navigation setPage={(p)=> pager(p)} currentPage={page} navSet={navSet()}/>
  </div>)
}