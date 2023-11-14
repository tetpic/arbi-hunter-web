import styles from './index.module.scss'

import Navigation from 'components/ui/Navigation'
import TitleForSection from 'components/ui/TitleForSection'
import { useEffect, useState } from 'react'
import { useResize } from 'components/hooks/useResize'
import ItemNavigation from 'components/for_pages/profile/ItemNavigation'
import { useRouter } from 'next/router'
import { ICategory } from 'data/interfaces/Common'
import DocumentDoubleSvg from 'components/svg/DocumentDoubleSvg'
import TableSvg from 'components/svg/TableSvg'
import AppsAddSvg from 'components/svg/AppsAddSvg'
import UserDoubleSvg from 'components/svg/UserDoubleSvg'
import classNames from 'classnames'
import SearchBar from 'components/ui/SearchBar'
import { MediaWrapper } from 'context/media_state'
import MainMediaPage from './MainMediaPage'
import Communities from './Communities'
import AppSvg from 'components/svg/AppSvg'
import { colors } from 'styles/variables'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IMediaCategoryModal } from 'components/modals/MediaCategoryModal'
import dynamic from 'next/dynamic'
import { isMobile } from 'react-device-detect'

const NewsByCategories = dynamic(()=>import('./NewsByCategories'), {ssr: false})



interface Props {
  category?: number
  categories?: ICategory[]
  page?: MediaPageNav
  isModile?: boolean
}

export enum MediaPageNav {
  AllArticles='allArticles',
  Categories='categories',
  Subscriptions='subscriptions',
  Communities='communities',
}

function SubCategories(props: {categories: ICategory[], currentCategory: ICategory, setCurrent: (e: ICategory)=>void}) {
  return (
    props.categories.map(el=> {
      const isCurrent = el.id === props.currentCategory?.id
      return <p  key={el.id} className={classNames(styles.subCategory, isCurrent&&styles.subCategory_active)} onClick={()=> props.setCurrent(el)}><AppSvg color={isCurrent&&colors.yellow} />{el.name}</p>
    })
  )
}



export default function CommunitiesPage(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth, width} = useResize()
  const [page, pager] = useState<MediaPageNav>(!isMobile&&props.page||props.page === MediaPageNav.Categories?MediaPageNav.AllArticles:props.page||MediaPageNav.AllArticles)
  const router = useRouter()
  const [currentCategory, setCurrentCategory] = useState<ICategory>(props.categories.find(el=> el.id === +props.category)||props.categories[0])
  const subCategories = <SubCategories categories={props.categories} currentCategory={currentCategory} setCurrent={(e: ICategory) => setCurrentCategory(e)} />

  const navSet = (()=>{
    let result = Object.values(MediaPageNav).map(page => {
      switch(page) {
        case MediaPageNav.AllArticles:
          return {name: 'Все статьи', type: page, icon: <DocumentDoubleSvg/>}
        case MediaPageNav.Categories:
          return {name: 'Категории', type: page, subSet: subCategories, icon: <TableSvg/>}
        case MediaPageNav.Subscriptions:
          return {name: 'Мои подписки', type: page, icon: <AppsAddSvg/>}
        case MediaPageNav.Communities:
          return {name: 'Сообщества', type: page, icon: <UserDoubleSvg/>}
      }
    })
    result = isTabletWidth?result.filter(el=> el.type !== MediaPageNav.Categories):result
    return result
  })()


  const body = (()=>{
    switch(page) {
      case MediaPageNav.AllArticles:
        return <MainMediaPage categories={props.categories}/>
      case MediaPageNav.Subscriptions:
        return <>мои подписки</>
      case MediaPageNav.Communities:
        return <Communities/>
      case MediaPageNav.Categories:
        return isTabletWidth&&width?<MainMediaPage categories={props.categories}/>:<NewsByCategories category={currentCategory}/>
    }
  })()

  const title = (()=> {
    switch(page) {
      case MediaPageNav.AllArticles:
        return 'Медиа'
      case MediaPageNav.Subscriptions:
        return 'Мои подписки'
      case MediaPageNav.Categories:
        return currentCategory.name
      case MediaPageNav.Communities:
        return 'Сообщества'
    }
  })()

  useEffect(()=>{
    if(width) {
      router.replace({query: { ...router.query, page: page, category: currentCategory?.id}}, undefined, {shallow: true})
    }
  }, [page, currentCategory, width])

  useEffect(()=>{
    const pageFromRouter = router.query.page as MediaPageNav
    const categoryId = router.query.category as string
    const category = props.categories.find(el=> el.id === Number(categoryId))
    if(page && pageFromRouter && page !== pageFromRouter && width ) {
      pager(isTabletWidth&&pageFromRouter===MediaPageNav.Categories?MediaPageNav.AllArticles:pageFromRouter)
    }
    if(currentCategory && categoryId && currentCategory?.id !== Number(categoryId)) {
      setCurrentCategory(category)
    }
    if(pageFromRouter === MediaPageNav.Categories && width && isTabletWidth) {
      appContext.showModal<IMediaCategoryModal>(ModalType.MediaCategoryModal, {
        currentCategory: category,
        title: category.name
      })
    }
  }, [router])

  return (<div className={styles.root}> 
    <div className={styles.contentWrapper}>
      <div className='container'>
        <TitleForSection title={title} onBackClick={()=>isTabletWidth&&router.push('/')}/>
        {isTabletWidth && 
          <ItemNavigation bottomStringClass={styles.bottomString} className={styles.itemNav} activeItem={page} items={navSet} onClick={(p)=> {pager(p)}}/>
        }
      </div>
      <div className={styles.bodyWrapper}>
          <SearchBar className={styles.searchBar}/>
          <MediaWrapper>
          {body}
          </MediaWrapper>
      </div>
    </div>
    {!isTabletWidth && 
      <Navigation setPage={(p)=> pager(p)} currentPage={page} navSet={navSet}/>
    }
  </div>)
}