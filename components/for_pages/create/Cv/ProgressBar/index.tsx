import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

interface Props {
  progress: number
  pointsCount: number
  rootClassName?: string
  itemClassName?: string
  onClick: (p: number)=> void
}

interface ProgressItem {
  active: boolean,
  key: string,
  title: string
}

export default function ProgressBar(props: Props) {

  const [progressItems, setProgressItems] = useState<ProgressItem[]>([])

  const titles = ['Специализация', 'Доход', 'Опыт', 'Образование', 'О себе', 'Навыки', 'Занятость']

  const progressHandler = (p: number, max: number):ProgressItem[] => {
    let arr:ProgressItem[] = []
    for(let i = 0; i < max; i++) {
      if(i < p) {
        arr.push({active: true, key: uuidv4(), title: titles[i]})
      }
      else {
        arr.push({active: false, key: uuidv4(), title: titles[i]})
      }
    }
    return arr
  }

  useEffect(()=>{
    setProgressItems(progressHandler(props.progress, props.pointsCount))
  }, [props.progress])


  return ( 
    <div className={classNames(props.rootClassName?props.rootClassName:styles.root)}>
      {progressItems.map((el, index)=> {
        return <div key={el.key} title={el.title} onClick={()=>props.onClick(index+1)} style={{width: 100/props.pointsCount-1+'%'}} className={classNames(styles.item, el.active&&styles.item_active, props.itemClassName)}></div>
      })}
      
    </div>

  )
}