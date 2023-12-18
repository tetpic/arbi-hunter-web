import styles from './index.module.scss'

import ThreeModelVariant from 'components/for_pages/three'
import UserPic from 'components/ui/UserPic'
import { useEffect, useState } from 'react'
import classnames from 'classnames'
import Spinner from 'components/ui/Spinner'
import { FILES } from 'types/constants'
import { useCharacterContext } from 'context/character_state'

interface Props {
}

export enum Emotions {
  Idle= 'Idle',
  Action_test = 'Action_test',
  Joy ='Joy',
  Laughter='Laughter',
  Sadness='Sadness',
  Shrug='Shrug',
  LongAnimation='Long_animation_test'
} 


export default function UserEditor(props: Props) {
  const characterContext = useCharacterContext()
  const {categories, setActiveSet, activeSet, variant, setVariant, dataLoaded, init, activeItem, setActiveItem} = characterContext
  const [action, setAction] = useState<Emotions>(Emotions.LongAnimation)

  const actionsAllowedMap: {type: Emotions, duration: number}[] = [
    {type: Emotions.Joy, duration: 1600},
    {type: Emotions.Sadness, duration: 3000},
    {type: Emotions.Shrug, duration: 1600},
    {type: Emotions.Action_test, duration: 4800},
  ]
  const [temporaryAnimation, setTemporaryAnimation] = useState<{type: Emotions, duration: number}>(actionsAllowedMap[0])
  const [disableClick, setDisableClick] = useState<boolean>(false)



  const showNextAnimation = () => {
    setDisableClick(true)
    setAction(temporaryAnimation.type)
    setTimeout(()=> {
      setAction(Emotions.LongAnimation)
      setTemporaryAnimation((actionsAllowedMap[actionsAllowedMap.map(el=> el.type).indexOf(temporaryAnimation.type)+1]||actionsAllowedMap[0]))
      setDisableClick(false)      
    }, temporaryAnimation.duration)
  }
  
  useEffect(()=>{
    init()
  }, [])


  return (<div className={styles.root}>
      <div className={styles.settings}>
      {/* <div className={styles.actions}>
        {Object.values(Emotions).map((el) => {
          return  (<p key={el} onClick={()=>setAction(el)} className={styles.action}>{el}</p>)
        })}
      </div> */}
        {[...categories.entries()].map(([el, val])=> {
          return (
            <div key={el.id} onClick={()=> setActiveSet([el, val])} className={classnames(styles.set, (el === activeSet[0])&&styles.set_active)}>
              <UserPic size={64} active={el === activeSet[0]} image={el.image&&FILES + el.image.source}/>
              <p>{el.name}</p>
            </div>
          )
        })}
      </div>
      <div className={classnames(styles.model, disableClick&&styles.model_disabled)} onClick={()=> showNextAnimation()} > 
        {dataLoaded && variant &&
          <ThreeModelVariant data={variant} r={4} actions={action}/>
          ||
          <Spinner size={32} />
        }
      </div>
      <div className={styles.variants}>
       {activeSet[1] && activeSet[1].map(item=> {
        return (
          <UserPic 
          size={80} 
          onClick={()=> {setVariant(item); setActiveItem(state=> state?.id === item.id?null:item)}} 
          active={item.id === activeItem?.id && activeSet[0].id === item.categoryId} 
          image={item.image&&FILES + item.image.source}/>
        )
       })}
      </div>
    </div>
    )
}