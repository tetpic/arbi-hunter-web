import styles from './index.module.scss'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { NavigationSet } from 'types/types'
import NavigationItem from './NavigationItem'

interface Props<T extends string|number> {
  setPage: (p: T) => void
  currentPage: T
  navSet?: NavigationSet<T>[]
  onClickHandler?: ()=>void
  rootClassName?: string,
  wrapperClassName?: string
  bottomItem?: JSX.Element
  title?: string
}


/**
 * @setPage (p: T) => void
 * @currentPage T
 * @navSet  NavigationSet<T>[]
 * @onClickHandler  ()=>void
 * @rootClassName  string,
 * @wrapperClassName  string
 * @bottomItem  JSX.Element
 */
export default function Navigation<T extends string|number>(props: Props<T>) {
  const {isTabletWidth} = useResize()
  const router = useRouter()

  const onClickHandler = (s: T) => {
    props.setPage(s)
    if(isTabletWidth) {
      props.onClickHandler()
    }
  }

  return ( <div className={classNames(styles.root, props.rootClassName) }>
    {isTabletWidth && props.title &&
    <TitleForSection title={props.title||'Настройка профиля'} onBackClick={()=>{router.back()}}/>
    }
    <nav className={classNames(styles.wrapper, props.wrapperClassName)}>
      {props.navSet.length > 0&&props.navSet.map((el, index)=> {
        return (
          <NavigationItem 
          key={index} 
          size={isTabletWidth} 
          item={el} 
          onClick={(t)=> onClickHandler(t)} 
          currentPage={props.currentPage}/>
        )
      })}
    </nav>
    {props.bottomItem &&
      <div className={styles.bottom}>
        {props.bottomItem}
      </div>
    }
  </div>
  )
}