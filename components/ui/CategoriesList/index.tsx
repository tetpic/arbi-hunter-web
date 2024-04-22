
import SwiperList from '../SwiperList'
import { useRouter } from 'next/router'
import CategoryItem from './CategoryItem'

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

  const onRedirect = (category: T) => {
    if(props.onClick) {
      props.onClick(category)
    }
    else {
      router.push((props.link||'/media/page?page=categories&categories=')+category.id)
    }
  }

  return (
    <SwiperList hideNav={props.hideNav} className={props.className} swiperProps={{freeMode: false}} watchMoreHref={props.watchMoreHref}>
      {props.categories && props.categories.map(category=> {
        return (
          <CategoryItem category={category} onClick={onRedirect} itemClassName={props.itemClassName}/>
        )
      })}
    </SwiperList>   
  )
}