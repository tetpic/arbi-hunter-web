import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

interface Props {
  children: JSX.Element,
  body: JSX.Element
  isActive: boolean
  classNames?: {
    root?: string,
    content?: string
  }
}

export default function Accordeon(props: Props) {

  const contentRef = useRef<HTMLDivElement>(null!)

  const [contentHeight, setContentHeight] = useState<number>(0)
 
  useEffect(()=>{
    const height = contentRef.current.getBoundingClientRect().height
    setContentHeight(height)
  }, [])

  return (
  <div className={classNames(styles.root, props.classNames?.root)}> 
  {props.body}
  <div className={styles.wrapper} style={{maxHeight: props.isActive&&8000||0, minHeight: props.isActive&&contentHeight||0}}>
    <div className={classNames(styles.content, props.classNames?.content) } ref={contentRef}>
      {props.children}
    </div>
  </div>

  </div>)
}