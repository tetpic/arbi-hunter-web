
import SwiperList from '../SwiperList'
import { useRouter } from 'next/router'
import CategoryItem from './CategoryItem'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import classNames from 'classnames'

interface Props<T> {
  categories: T[]
  hideNav?: boolean
  className?: string
  title?: string
  articlesCounter?:boolean
  link?: string
  itemClassName?: string
  onClick?: (category: T) => void
  watchMoreHref?: string
}


export default function CategoriesList<T extends {[key: string]: any}>(props: Props<T>) {
  const router = useRouter()
  const appContext = useAppContext()
  const isTabletWidth = appContext.size.isTabletWidth
  const onRedirect = (category: T) => {
    if(props.onClick) {
      props.onClick(category)
    }
    else {
      router.push((props.link||'/media/page?page=categories&categories=')+category.id)
    }
  }

  return (
    <SwiperList 
    hideNav={props.hideNav} 
    className={classNames(styles.root, props.className)} 
    swiperProps={{spaceBetween: isTabletWidth?8:16, loop: false, freeMode: {
      // momentum: false,
      // momentumBounce: false,
      sticky: false
    }}}
    watchMoreHref={props.watchMoreHref}
    wrapperClassName={styles.wrapper}
    >
      {props.categories && props.categories.map(category=> {
        return (
          <CategoryItem category={category} onClick={onRedirect} itemClassName={props.itemClassName}/>
        )
      })}
    </SwiperList>   
  )
}