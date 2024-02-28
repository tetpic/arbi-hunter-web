import styles from './index.module.scss'
import Tag from 'components/ui/Tag'

interface Props {
  title?: string
  tags: {name: string, isActive?: boolean, onClick?: (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>)=>void}[]
  titleClassName?: string
}

export default function TagList(props: Props) {

  return (<div className={styles.root}>
    {props.title &&
      <p className={props.titleClassName}>{props.title}</p>
    }
    <div className={styles.tagList}>
      {props.tags.map((el, index)=>{
        return (
          <Tag className={styles.tag} isActive={el.isActive} text={el.name} onClick={el.onClick} key={index}/>
        )
      })}
    </div>
  </div>)
}