import Tag from 'components/ui/Tag'
import styles from './index.module.scss'

interface Props {
  title: string
  tags: string[]
  titleClassName: string
}

export default function TagList(props: Props) {

  return (<div className={styles.root}>
    <p className={props.titleClassName}>{props.title}</p>
    <div className={styles.tagList}>
      {props.tags.map((el, index)=>{
        return (
          <Tag className={styles.tag} text={el}  key={index}/>
        )
      })}
    </div>
  </div>)
}