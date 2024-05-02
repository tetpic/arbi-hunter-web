import styles from './index.module.scss'

import Navigation from 'components/ui/Navigation'
import TitleForSection from 'components/ui/TitleForSection'
import { useEffect, useState } from 'react'
import { useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/router'
import { ICategory } from 'data/interfaces/Common'
import DocumentDoubleSvg from 'components/svg/DocumentDoubleSvg'
import TableSvg from 'components/svg/TableSvg'
import AppsAddSvg from 'components/svg/AppsAddSvg'
import UserDoubleSvg from 'components/svg/UserDoubleSvg'
import { MediaWrapper } from 'context/media_state'
import MainMediaPage from './MainMediaPage'
import Communities from './Communities'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IMediaCategoryModal } from 'components/modals/MediaCategoryModal'
import dynamic from 'next/dynamic'
import Subscriptions from './Subscriptions'
import SubCategories from 'components/ui/SubNavigationSet'
import { useUserContext } from 'context/user_state'
import { CommunityWrapper } from 'context/community_state'
import ItemNavigation from '@/components/ui/ItemNavigation'
import useTranslation from 'next-translate/useTranslation'

const NewsByCategories = dynamic(()=>import('./NewsByCategories'), {ssr: false})



interface Props {
  category?: number
  categories?: ICategory[]
  page?: MediaPageNav
  isMobile?: boolean

}

export enum MediaPageNav {
  AllArticles='allArticles',
  Categories='categories',
  Subscriptions='subscriptions',
  Communities='communities',
}


export default function MediaPage(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const {isTabletWidth, width} = useResize()

  const [page, pager] = useState<MediaPageNav>((!props.isMobile&&props.page)||(props.page === MediaPageNav.Categories?MediaPageNav.AllArticles:props.page)||MediaPageNav.AllArticles)
  const router = useRouter()
  const [currentCategory, setCurrentCategory] = useState<ICategory>(props.categories.find(el=> el.id === +props.category)||props.categories[0])
  const subCategories = <SubCategories categories={props.categories} currentCategory={currentCategory} setCurrent={(e: ICategory) => setCurrentCategory(e)} />

  const navSet = (()=>{
    const obj = userContext.currentProfile?Object.values(MediaPageNav):[MediaPageNav.AllArticles, MediaPageNav.Categories, MediaPageNav.Communities]
    let result = obj.map(page => {
      switch(page) {
        case MediaPageNav.AllArticles:
          return {name: t('media_page_allArticles'), type: page, icon: <DocumentDoubleSvg/>}
        case MediaPageNav.Categories:
          return {name: t('media_page_categories'), type: page, subSet: subCategories, icon: <TableSvg/>}
        case MediaPageNav.Subscriptions:
          return {name: t('media_page_mySubscriptions'), type: page, icon: <AppsAddSvg/>}
        case MediaPageNav.Communities:
          return {name: t('media_page_communities'), type: page, icon: <UserDoubleSvg/>}
      }
    })
    result = isTabletWidth?result.filter(el=> el.type !== MediaPageNav.Categories):result
    return result
  })()


  const body = (()=>{
    switch(page) {
      case MediaPageNav.AllArticles:
        return <MediaWrapper key={'mainMediaWrapper'} id={1}><MainMediaPage categories={props.categories}/></MediaWrapper>
      case MediaPageNav.Subscriptions:
        return <Subscriptions/>
      case MediaPageNav.Communities:
        return <CommunityWrapper><Communities/></CommunityWrapper>
      case MediaPageNav.Categories:
        return <MediaWrapper  key={'categoriesMediaWrapper'} id={2}>{isTabletWidth&&width?<MainMediaPage categories={props.categories}/>:<NewsByCategories  category={currentCategory}/>}</MediaWrapper>
    }
  })()

  const title = (()=> {
    switch(page) {
      case MediaPageNav.AllArticles:
        return t('media_page_media')
      case MediaPageNav.Subscriptions:
        return t('media_page_mySubscriptions')
      case MediaPageNav.Categories:
        return currentCategory?.name||props.categories[0].name
      case MediaPageNav.Communities:
        return t('media_page_communities')
    }
  })()

  useEffect(()=>{
    if(width) {
      router.replace({query: { ...router.query, page: page, category: currentCategory?.id}}, undefined, {shallow: true})
    }
  }, [page, currentCategory, width])

  useEffect(()=>{
    if(props.isMobile && router.query.page === MediaPageNav.Categories) {
      pager(MediaPageNav.AllArticles)
      const categoryId = router.query.category as string
      const category = props.categories.find(el=> el.id === Number(categoryId))
      appContext.showModal<IMediaCategoryModal>(ModalType.MediaCategoryModal, {
        currentCategory: category,
        title: category?.name
      })
    }
    else if(!props.isMobile && router.query.page === MediaPageNav.Categories) {
      pager(MediaPageNav.Categories)
      setCurrentCategory(props.categories.find(el=> el.id === +router.query.category))
    }
  }, [router])
  

  return (<div className={styles.root}> 
    <div className={styles.contentWrapper}>
      <div className='container'>
        <TitleForSection title={title} onBackClick={()=>isTabletWidth&&router.back()}/>
        {isTabletWidth && 
          <ItemNavigation bottomStringClass={styles.bottomString} className={styles.itemNav} activeItem={page} items={navSet} onClick={(p)=> {pager(p)}}/>
        }
      </div>
      <div className={styles.bodyWrapper}>
        {body}
      </div>
    </div>
    {!isTabletWidth && 
      <Navigation wrapperClassName={styles.nav} setPage={(p)=> pager(p)} currentPage={page} navSet={navSet}/>
    }
  </div>)
}