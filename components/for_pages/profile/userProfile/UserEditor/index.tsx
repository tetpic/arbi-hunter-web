import styles from './index.module.scss'

import ThreeModelVariant from 'components/for_pages/three'
import UserPic from 'components/ui/UserPic'
import {  useEffect } from 'react'
import classnames from 'classnames'
import Spinner from 'components/ui/Spinner'
import { FILES } from 'types/constants'
import { useCharacterContext } from 'context/character_state'
import { useAppContext } from 'context/state'
import ItemNavigation from '@/components/ui/ItemNavigation'
import Button from '@/components/ui/Button'
import { CharCategoryKey } from 'data/interfaces/ICharacter'
import { useUserContext } from 'context/user_state'

interface Props {
}

export enum ModelActions {
  Action_test = 'Action_test',
  Appearance = 'Appearance',
  Idle = 'Idle',
  Laughter ='Laughter',
  New = 'New',
  No = 'No',  
  Yes = 'Yes',
  Sadness = 'Sadness',
  ShakesHead = 'Shakes_head',
  Shrug = 'Shrug',
  TurnsAway = 'Turns_away',
  LongAnimation = 'Long_animation_test',
} 


export default function UserEditor(props: Props) {
  const characterContext = useCharacterContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const {categories, setActiveSet, activeSet, variant, setVariant, dataLoaded, init, activeItem, setActiveItem} = characterContext

  const save = () => {
    if(characterContext.currentCharacter.current.purchased) {
      characterContext.saveCurrentSet()
    }
    else {
      characterContext.buyCharacter()
      .then(res=> {
        if(res) {
          characterContext.saveCurrentSet()
        }
      })
      
    }
  }

  const saveCharButton = (<>
    <Button 
    isProcess={characterContext.savingProcess}  
    disabled={characterContext.savingProcess?true:Boolean(!characterContext.dataBaseBlob)} 
    onClick={save}  
    styleType={['gradient']}
    className={styles.saveButton}
    >
      {isTabletWidth?'Готово':'Сохранить'}
    </Button>
    </>)

  const onNavClick = (n: number) => {
    const key = [...categories.keys()].find(el=> el.id === n)
    setActiveSet([key, categories.get(key)])
  }
  
  useEffect(()=>{
    init()
  }, [])

  return (<div className={styles.root}>
      {!isTabletWidth &&
      <div className={styles.settings}>
        {[...categories.entries()].map(([el, val])=> {
          return (
            <div key={el.id} onClick={()=> setActiveSet([el, val])} className={classnames(styles.set, (el === activeSet[0])&&styles.set_active)}>
              <UserPic size={64} active={el.id === activeSet[0].id} image={el.key === CharCategoryKey.Model?el.image&&FILES + el.image.source: `/images/charCategories/${el.key}_${variant.model}.webp`}/>
              <p>{el.name}</p>
            </div>
          )
        })}
      </div>
      ||
      activeSet&&activeSet.length > 0 &&
      <ItemNavigation activeItem={activeSet[0]?.id} items={[...categories.keys()].map(el=> {return {name: el.name, type: el.id}})} onClick={(n)=> onNavClick(n)}/>
      }

      <div className={styles.model}> 
        {dataLoaded && variant &&
          <ThreeModelVariant data={variant} r={4} />
          ||
          <Spinner size={32} />
        }
      </div>
      {saveCharButton}
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