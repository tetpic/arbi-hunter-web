import classNames from 'classnames'
import classnames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { NavigationSet } from 'types/types'
import styles from './index.module.scss'

interface Props<T extends string> {
  setPage: (p: T) => void
  currentPage: T
  navSet?: NavigationSet<T>[]
  onClickHandler?: ()=>void
  rootClassName?: string
}

export default function Navigation<T extends string>(props: Props<T>) {

  const {isTabletWidth} = useResize()
  const router = useRouter()

  const onClickHandler = (s: T) => {
    props.setPage(s)
    if(isTabletWidth) {
      props.onClickHandler()
    }
  }

  return ( <div className={classNames(styles.root, props.rootClassName) }>
    {isTabletWidth &&
    <TitleForSection title={'Настройка профиля'} onBackClick={()=>{router.back()}}/>
    }
    <nav className={styles.wrapper}>
      {props.navSet.length > 0&&props.navSet.map((el, index)=> {
        return (
          <div className={styles.item}>
            <p 
            key={index} 
            onClick={()=>onClickHandler(el.type)} 
            className={classnames(styles.navItem, el.type === props.currentPage&&styles.navItem_active)}>
              <span className={styles.icon}>{el.icon}</span> {el.name}
              {isTabletWidth&& <ArrowRightSvg className={styles.arrow}/>}
            </p>
            <div className={classNames(styles.subSet, el.type === props.currentPage&&styles.subSet_active)}>
              {el.subSet}
            </div>
          </div>
        )
      })}
    </nav>
  </div>
  )
}