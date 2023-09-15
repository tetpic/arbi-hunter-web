import classnames from 'classnames'
import { useResize } from 'components/hooks/useResize'
import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import TitleForSection from 'components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { NavigationSet, ProfilePages } from '..'
import styles from './index.module.scss'

interface Props {
  setPage: (p: ProfilePages) => void
  currentPage: ProfilePages
  navSet?: NavigationSet[]
  onClickHandler?: ()=>void
}

export default function ProfileNavigation(props: Props) {

  const {isTabletWidth} = useResize()
  const router = useRouter()

  const onClickHandler = (s: ProfilePages) => {
    props.setPage(s)
    if(isTabletWidth) {
      props.onClickHandler()
    }
  }

  return ( <div className={styles.root}>
    {isTabletWidth &&
    <TitleForSection title={'Настройка профиля'} onBackClick={()=>{router.back()}}/>
    }
    <nav className={styles.wrapper}>
      {props.navSet.length > 0&&props.navSet.map((el, index)=> {
        return (
          <p 
          key={index} 
          onClick={()=>onClickHandler(el.type)} 
          className={classnames(styles.navItem, el.type === props.currentPage&&styles.navItem_active)}>
            {el.icon} {el.name}
            {isTabletWidth&& <ArrowRightSvg className={styles.arrow}/>}
          </p>

        )
      })}
    </nav>
  </div>
  )
}