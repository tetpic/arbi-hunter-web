import styles from './index.module.scss'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

interface Props<T> {
  activeItem: T
  items: {name: string|number, type: T}[]
  onClick: (n: T) => void
  className?: string
  pClassName?: string 
  bottomStringClass?: string
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

  const itemsRef = useRef<Map<string|number, HTMLParagraphElement>>(new Map())
  const wrapperRef = useRef<HTMLDivElement>()

  useEffect(()=>{
    if(props.activeItem) {
      let box = wrapperRef.current.getBoundingClientRect()
      let activeItem = itemsRef.current.get(props.activeItem)?.getBoundingClientRect()
      setActiveWidth(activeItem?.width)
      setTransition(activeItem?.left - box.left)
    }
  }, [props.activeItem])  

  return (
      <div className={classNames(styles.root, props.className) } > 
        <div className={styles.wrapper} ref={wrapperRef}>
          <div className={styles.items}>
            {props.items.length > 0 && props.items
              .map((el, index)=> {
                return (
                  <p 
                  className={classNames(styles.item, props.pClassName, props.activeItem === el.type&&styles.item_active)} 
                  ref={(r)=> itemsRef.current.set(el.type, r)} 
                  onClick={()=> props.onClick(el.type)}
                  key={index} 
                  >
                  {el.name}
                </p>)
              })
            }
          </div>
          <div className={classNames(styles.bottomString, props.bottomStringClass)}>
            <div className={styles.line} style={{transform: `translateX(${transition}px)`, width: activeWidth}}></div>
          </div>
        </div>
      </div>
  )
}