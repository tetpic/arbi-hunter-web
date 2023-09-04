import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

interface Props<T> {
  activeItem: T
  items: T[]
  onClick: (n: T) => void
}

export default function ItemNavigation<T extends string>(props: Props<T>) {

  const [transition, setTransition] = useState<number>(0)
  const [activeWidth, setActiveWidth] = useState<number>(0)

  const itemsRef = useRef<Map<string, HTMLParagraphElement>>(new Map())
  const wrapperRef = useRef<HTMLDivElement>()

  useEffect(()=>{
    let box = wrapperRef.current.getBoundingClientRect()
    let activeItem = itemsRef.current.get(props.activeItem).getBoundingClientRect()
    setActiveWidth(activeItem.width)
    setTransition(activeItem.left - box.left)
  }, [props.activeItem])  

  return (<div className={styles.root} ref={wrapperRef}> 
    <div className={styles.items}>
      {props.items.length > 0 && props.items
        .map((el, index)=> {
          return (
          <p 
          className={classNames(styles.item, props.activeItem === el&&styles.item_active)} 
          ref={(r)=> itemsRef.current.set(el, r)} 
          onClick={()=> props.onClick(el)}
          key={index} 
          >
            {el}
          </p>)
        })
      }
    </div>
    <div className={styles.bottomString}>
      <div className={styles.line} style={{transform: `translateX(${transition}px)`, width: activeWidth}}></div>
    </div>
  </div>)
}