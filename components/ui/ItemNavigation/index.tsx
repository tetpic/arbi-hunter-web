import styles from './index.module.scss'

import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import P from '../P'
import { useAppContext } from 'context/state'

interface Props<T> {
  activeItem: T
  items: {name: string|number, type: T}[]
  onClick: (n: T) => void
  className?: string
  pClassName?: string 
  bottomStringClass?: string
  onAllWidth?: boolean
}

/**
 * @activeItem T
 * @items {name: string, type: T}[]
 * @onClick (n: T) => void
 * @className : string
 * @bottomStringClass : string
 */
export default function ItemNavigation<T extends string|number>(props: Props<T>) {

  const [transition, setTransition] = useState<number>(0)
  const [activeWidth, setActiveWidth] = useState<number>(0)
  const {theme} = useAppContext()

  const itemsRef = useRef<Map<string|number, HTMLParagraphElement>>(new Map())
  const wrapperRef = useRef<HTMLDivElement>()
  const itemsListRef = useRef<HTMLDivElement>()

  useEffect(()=>{
    if(props.activeItem && itemsRef.current.size > 0) {
      let activeItem = itemsRef.current.get(props.activeItem)
      let activeItemSize = activeItem.getBoundingClientRect()
      let box = wrapperRef.current.getBoundingClientRect()
      if(wrapperRef.current.offsetWidth < itemsListRef.current.offsetWidth) {
        activeItem.scrollIntoView({inline: 'center', behavior: 'smooth', block: 'nearest'})
      }
      setActiveWidth(activeItemSize?.width)
      setTransition(activeItemSize?.left - box.left)
    }
  }, [props.activeItem])  



  return (
      <div className={classNames(styles.root, props.className, styles[theme]) }> 

        <div className={styles.wrapper} ref={wrapperRef} >
          <div className={classNames(styles.items, props.onAllWidth&&styles.itemsWide)} ref={itemsListRef}>
            {props.items.length > 0 && props.items
              .map((el, index)=> {
                return (
                  <P 
                  styleType={['large', 'w600', 'greyLight']}
                  altStyleType={['w600', 'large']}
                  className={classNames(styles.item, props.pClassName, props.activeItem === el.type&&styles.item_active)} 
                  getRef={(r)=> {
                    itemsRef.current.set(el.type, r)
                  }} 
                  onClick={()=> props.onClick(el.type)}
                  key={index} 
                  >
                  {el.name}
                </P>)
              })
            }
          </div>
          <div className={classNames(styles.bottomString, props.bottomStringClass)}  style={{width: itemsListRef.current?.clientWidth}}>
            <div className={styles.line} style={{transform: `translateX(${transition}px)`, width: activeWidth}}></div>
          </div>
        </div>
      </div>
  )
}