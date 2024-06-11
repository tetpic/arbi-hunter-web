import styles from './index.module.scss'
import classNames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { NavigationSet } from 'types/types'
import NavigationItem from './NavigationItem'
import useTranslation from 'next-translate/useTranslation'

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
  const {t} = useTranslation()

  const onClickHandler = (s: T) => {
    props.setPage(s)
    if(isTabletWidth) {
      props.onClickHandler()
    }
  }

  return ( <div className={classNames(styles.root, props.rootClassName) }>
    <div className={classNames(styles.rootWrapper, props.wrapperClassName)}>

    {isTabletWidth && props.title &&
    <TitleForSection title={props.title||t('settings_profile')} onBackClick={()=>{router.back()}}/>
    }
    <nav className={styles.wrapper}>
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
  </div>
  )
}