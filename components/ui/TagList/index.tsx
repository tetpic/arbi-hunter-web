import classNames from 'classnames'
import styles from './index.module.scss'
import Tag from 'components/ui/Tag'
import P from '../P'
import { useAppContext } from 'context/state'

interface Props {
  title?: string
  tags: {name: string, isActive?: boolean, onClick?: (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>)=>void}[]
  titleClassName?: string
  tagClassName?: string
}

export default function TagList(props: Props) {
  const {theme} = useAppContext()

  return (<div className={classNames(styles.root, styles[theme])}>
    {props.title &&
      <P useThemeColor styleType={['large', 'w500']} className={props.titleClassName}>{props.title}</P>
    }
    <div className={styles.tagList}>
      {props.tags.map((el, index)=>{
        return (
          <Tag className={props.tagClassName} isActive={el.isActive} text={el.name} onClick={el.onClick} key={index}/>
        )
      })}
    </div>
  </div>)
}