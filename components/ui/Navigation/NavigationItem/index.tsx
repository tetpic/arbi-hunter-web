import ArrowRightSvg from 'components/svg/ArrowRightSvg'
import styles from './index.module.scss'
import { NavigationSet } from 'types/types'
import classnames from 'classnames'
import { useEffect, useState } from 'react'

interface Props<T extends string> {
  onClick: (type: T) => void
  item: NavigationSet<T>
  currentPage: T
  size: boolean
}

export default function NavigationItem<T extends string>(props: Props<T>) {
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
    <p 
    onClick={onClickHandler} 
    className={classnames(styles.navItem, el.type === props.currentPage&&styles.navItem_active)}>
      <span className={styles.icon}>{el.icon}</span> {el.name}
      {props.size&& <ArrowRightSvg className={styles.arrow}/>}
    </p>
    <div className={classnames(styles.subSet, isOpenSubset&&styles.subSet_active)}>
      {el.subSet}
    </div>
  </div>)
}