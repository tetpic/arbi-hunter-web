import Navigation from 'components/ui/Navigation'
import TitleForSection from 'components/ui/TitleForSection'
import { useCallback, useState } from 'react'
import { NavigationSet } from 'types/types'
import Communities from './Communities'
import { useResize } from 'components/hooks/useResize'
import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

interface Props {
}

export enum CommunitiesNav {
  AllArticles='allArticles',
  Subscriptions='subscriptions',
  Communities='communities',
  
}

export default function CommunitiesPage(props: Props) {
  const [page, pager] = useState<CommunitiesNav>(CommunitiesNav.Communities)
  const {isTabletWidth} = useResize()
  const router = useRouter()

  const navSet = useCallback(((): NavigationSet<CommunitiesNav>[] => {
    let result:{name: string, type: CommunitiesNav, icon?: JSX.Element}[]  = []
    result = Object.values(CommunitiesNav).map(page => {
      switch(page) {
        case CommunitiesNav.AllArticles:
        return {name: 'Все статьи', type: page}

        case CommunitiesNav.Subscriptions:
        return {name: 'Мои подписки', type: page}

        case CommunitiesNav.Communities:
        return {name: 'Сообщества', type: page}
      }
    })
    return result
  } ), [page])

  const body = (()=>{
    switch(page) {
      case CommunitiesNav.AllArticles:
        return <>Раздел &quot;все статьи&quot; в разработке</>
      case CommunitiesNav.Subscriptions:
        return <>мои подписки</>
      case CommunitiesNav.Communities:
        return <Communities/>
    }
  })()

  const title = (()=> {
    switch(page) {
      case CommunitiesNav.AllArticles:
        return 'Медиа'
      case CommunitiesNav.Subscriptions:
        return 'Мои подписки'
      case CommunitiesNav.Communities:
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