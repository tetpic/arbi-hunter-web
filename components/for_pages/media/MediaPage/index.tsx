import Navigation from 'components/ui/Navigation'
import TitleForSection from 'components/ui/TitleForSection'
import { useCallback, useState } from 'react'
import { NavigationSet } from 'types/types'
import MediaCommunities from './Communities'
import { useResize } from 'components/hooks/useResize'
import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import { useRouter } from 'next/router'
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
  const {isTabletWidth} = useResize()
  const router = useRouter()

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
      <TitleForSection title={title} onBackClick={()=>isTabletWidth&&router.push('/')}/>
      {isTabletWidth && 
        <ItemNavigation activeItem={page} items={navSet()} onClick={(p)=> pager(p)}/>
      }
      <div className={styles.bodyWrapper}>
        {body}
      </div>
    </div>
    {!isTabletWidth && 
      <Navigation setPage={(p)=> pager(p)} currentPage={page} navSet={navSet()}/>
    }
  </div>)
}