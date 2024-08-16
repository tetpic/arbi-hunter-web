import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import styles from './index.module.scss'
import { NavigationSet } from 'types/types'
import classnames from 'classnames'
import { useEffect, useState } from 'react'
import P from '../../P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'

interface Props<T extends string|number> {
  onClick: (type: T) => void
  item: NavigationSet<T>
  currentPage: T
  size: boolean
}

export default function NavigationItem<T extends string|number>(props: Props<T>) {
  const appContext = useAppContext()
  const theme = appContext.theme
  const el = props.item
  const [isOpenSubset, setOpenSubset] = useState<boolean>(el.type === props.currentPage)

  const onClickHandler = () => {
    props.onClick(el.type)
    setOpenSubset(!isOpenSubset)
  }

  useEffect(()=>{
    if(props.currentPage === props.item.type) {
      setOpenSubset(true)
    }
    else {
      setTimeout(() => {
        setOpenSubset(false)
      }, 100)
    }
  }, [props.currentPage])

  return (<div className={styles.item}>
    <P 
    onClick={onClickHandler} 
    styleType={['medium', 'w500']}
    useThemeColor
    className={classnames(styles.navItem, el.type === props.currentPage&&styles.navItem_active, el.type === props.currentPage&&theme === AppTheme.Light && styles.navItem_activeLight)}>
      {el.icon&&<span className={styles.icon}>{el.icon}</span>} {el.name}
      {props.size&& <ArrowRightSvg className={styles.arrow}/>}
    </P>
    <div className={classnames(styles.subSet, isOpenSubset&&styles.subSet_active)}>
      {el.subSet}
    </div>
  </div>)
}