import { CSSProperties } from 'react'
import styles from './index.module.scss'

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
        el.onClick&&el.onClick(e)
      }}
      >
        {el.icon} {el.title}
      </p>
    })
  }
</div> )
}