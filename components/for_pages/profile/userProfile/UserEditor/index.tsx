import styles from './index.module.scss'

import ThreeModelVariant from 'components/for_pages/three'
import UserPic from 'components/ui/UserPic'
import { useEffect } from 'react'
import classnames from 'classnames'
import Spinner from 'components/ui/Spinner'
import { FILES } from 'types/constants'
import { useCharacterContext } from 'context/character_state'

interface Props {
}

export default function UserEditor(props: Props) {
  const characterContext = useCharacterContext()
  const {categories, setActiveSet, activeSet, variant, setVariant, load, init, activeItem, setActiveItem} = characterContext
  
  useEffect(()=>{
    init()
  }, [])

  return (<div className={styles.root}>
      <div className={styles.settings}>
        {[...categories.entries()].map(([el, val])=> {
          return (
            <div onClick={()=> setActiveSet([el, val])} className={classnames(styles.set, (el === activeSet[0])&&styles.set_active)}>
              <UserPic size={64} active={el === activeSet[0]} image={el.image&&FILES + el.image.source}/>
              <p>{el.name}</p>
            </div>
          )
        })}
      </div>

      <div className={styles.model}> 
        {!load && variant &&
          <ThreeModelVariant {...variant} r={4}/>
          ||
          <Spinner size={32} />
        }
      </div>

      <div className={styles.variants}>
       {activeSet[1] && activeSet[1].map(item=> {
        return (
          <UserPic size={80} onClick={()=> {setVariant(item); setActiveItem(state=> state?.id === item.id?null:item)}} active={item.id === activeItem?.id && activeSet[0].id === item.categoryId} image={item.image&&FILES + item.image.source}/>
        )
       })}
      </div>
    </div>
    )
}