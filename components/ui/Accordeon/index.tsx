import classNames from 'classnames'
import {  useRef } from 'react'
import styles from './index.module.scss'

interface Props {
  children: JSX.Element,
  body?: JSX.Element
  isActive: boolean
  getRef?: (r: HTMLDivElement) => void
  classNames?: {
    root?: string,
    content?: string,
    wrapper?: string
  }
}

export default function Accordeon(props: Props) {

  const contentRef = useRef<HTMLDivElement>(null!)

  return (
  <div className={classNames(styles.root, props.classNames?.root)} ref={((r)=> props.getRef&&props.getRef(r))}> 
  {props.body}
  <div className={classNames(styles.wrapper, props.classNames?.wrapper, props.isActive&&styles.wrapper_active)} style={{maxHeight: props.isActive&&contentRef.current?.getBoundingClientRect()?.height||0}}>
    <div className={classNames(styles.content, props.classNames?.content) } ref={contentRef}>
      {props.children}
    </div>
  </div>

  </div>)
}