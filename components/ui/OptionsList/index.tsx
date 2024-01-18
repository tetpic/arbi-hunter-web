import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import { CSSProperties } from 'react'

export interface IOptionList {
  title: string, 
  icon?: JSX.Element, 
  onClick?: (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void
  style?: CSSProperties
}

interface Props {
  options: IOptionList[]
  onMouseLeave: () => void
}

export default function OptionsList(props: Props) {
  const appContext = useAppContext()

  return (<div className={styles.options} onMouseLeave={()=>props.onMouseLeave&&props.onMouseLeave()} >
  {props.options &&
    props.options.map((el, index) => {
      return <p 
      className={styles.option} 
      key={index} 
      style={el.style} 
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        appContext.hideBottomSheet()
        el.onClick&&el.onClick(e)
      }}
      >
        {el.icon} {el.title}
      </p>
    })
  }
</div> )
}