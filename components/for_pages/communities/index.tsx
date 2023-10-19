import Navigation from 'components/ui/Navigation'
import TitleForSection from 'components/ui/TitleForSection'
import { useCallback, useEffect, useState } from 'react'
import { NavigationSet } from 'types/types'
import Communities from './Communities'
import { useResize } from 'components/hooks/useResize'
import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import { useRouter } from 'next/router'
import { ICategory } from 'data/interfaces/Common'
import DocumentDoubleSvg from 'components/svg/DocumentDoubleSvg'
import TableSvg from 'components/svg/TableSvg'
import AppsAddSvg from 'components/svg/AppsAddSvg'
import UserDoubleSvg from 'components/svg/UserDoubleSvg'
import classNames from 'classnames'
import NewsByCategories from './NewsByCategories'
import SearchBar from 'components/ui/SearchBar'

import styles from './index.module.scss'
import { MediaWrapper } from 'context/media_state'

interface Props {
  category?: number
  categories?: ICategory[]
  page?: 'communities'|'categories'
}

export enum CommunitiesNav {
  AllArticles='allArticles',
  Categories='categories',
  Subscriptions='subscriptions',
  Communities='communities',
}

function SubCategories(props: {categories: ICategory[], currentCategory: ICategory, setCurrent: (e: ICategory)=>void}) {
  return (
    props.categories.map(el=> {
      return <p className={classNames(styles.subCategory, el.id === props.currentCategory?.id&&styles.subCategory_active)} onClick={()=> props.setCurrent(el)}>{el.name}</p>
    })
  )
}

export default function CommunitiesPage(props: Props) {
  const [page, pager] = useState<CommunitiesNav>(props.page === 'categories'?CommunitiesNav.Categories:CommunitiesNav.Communities)
  const {isTabletWidth} = useResize()
  const router = useRouter()
  const [currentCategory, setCurrentCategory] = useState<ICategory>(props.categories.find(el=> el.id === +props.category)||props.categories[0])

  const subCategories = <SubCategories categories={props.categories} currentCategory={currentCategory} setCurrent={(e: ICategory) => setCurrentCategory(e)} />

  const navSet = useCallback(((): NavigationSet<CommunitiesNav>[] => {
    let result = Object.values(CommunitiesNav).map(page => {
      switch(page) {
        case CommunitiesNav.AllArticles:
        return {name: 'Все статьи', type: page, icon: <DocumentDoubleSvg/>}

        case CommunitiesNav.Categories:
        return {name: 'Категории', type: page, subSet: subCategories, icon: <TableSvg/>}

        case CommunitiesNav.Subscriptions:
        return {name: 'Мои подписки', type: page, icon: <AppsAddSvg/>}

        case CommunitiesNav.Communities:
        return {name: 'Сообщества', type: page, icon: <UserDoubleSvg/>}
      }
    })
    return result
  } ), [page, currentCategory])

  const body = (()=>{
    switch(page) {
      case CommunitiesNav.AllArticles:
        return <>Раздел &quot;все статьи&quot; в разработке</>
      case CommunitiesNav.Subscriptions:
        return <>мои подписки</>
      case CommunitiesNav.Communities:
        return <Communities/>
      case CommunitiesNav.Categories:
        return <NewsByCategories category={currentCategory}/>
    }
  })()

  const title = (()=> {
    switch(page) {
      case CommunitiesNav.AllArticles:
        return 'Медиа'
      case CommunitiesNav.Subscriptions:
        return 'Мои подписки'
      case CommunitiesNav.Categories:
        return currentCategory.name
      case CommunitiesNav.Communities:
        return 'Сообщества'
    }
  })()

  useEffect(()=>{
      router.replace({query: { ...router.query, page: page, category: currentCategory.id}}, undefined, {shallow: true})
  }, [page, currentCategory])


  return (<div className={styles.root}> 
    <div className={styles.contentWrapper}>
      <TitleForSection title={title} onBackClick={()=>isTabletWidth&&router.push('/')}/>
      {isTabletWidth && 
        <ItemNavigation activeItem={page} items={navSet()} onClick={(p)=> pager(p)}/>
      }
      <div className={styles.bodyWrapper}>
        <SearchBar className={styles.searchBar}/>

        <MediaWrapper>
          {body}
        </MediaWrapper>
        
      </div>
    </div>
    {!isTabletWidth && 
      <Navigation setPage={(p)=> pager(p)} currentPage={page} navSet={navSet()}/>
    }
  </div>)
}