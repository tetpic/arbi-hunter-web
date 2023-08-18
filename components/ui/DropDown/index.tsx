import styles from './index.module.scss'
import classNames from 'classnames'
import Scrollbars from 'react-custom-scrollbars-2'
import InfiniteScroll from 'react-infinite-scroll-component'
import Spinner from '../Spinner'
import { useRef } from 'react'

interface Props {
  options: any[],
  classNames?: {
    rootClassName?: string
    optionClassName?: string,
  }
  onClick: (el: any)=>void
  onNext: ()=>void
  nameField: string
  loading: boolean
}

export default function DropDown(props: Props) {

  const dropDownContainer = useRef<HTMLDivElement>(null!)

  return ( <div className={classNames(styles.root, props.classNames.rootClassName)} >

    {props.options.length > 0 &&
    <div className={styles.dropdownContainer} ref={dropDownContainer}>
      <InfiniteScroll 
      className={styles.list} 
      next={props.onNext} 
      hasMore={true} 
      dataLength={props.options.length}
      height={dropDownContainer.current?.clientHeight ?? 300}
      loader={props.loading ? <Spinner size={50} color="#fff" secondaryColor="rgba(255,255,255,0.4)" /> : null}
      scrollableTarget='scrollableDiv'
      >
        {props.options.map(el => {
          return <p className={classNames(styles.option, props.classNames.optionClassName)} onClick={()=>props.onClick(el)}>{el[props.nameField]}</p>
        })}
      </InfiniteScroll>
    </div>
    }   
  </div>
  )
}