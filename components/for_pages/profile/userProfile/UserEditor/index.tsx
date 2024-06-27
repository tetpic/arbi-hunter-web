import styles from './index.module.scss'

import ThreeModelVariant from 'components/for_pages/three'
import UserPic from 'components/ui/UserPic'
import {  useEffect } from 'react'
import Spinner from 'components/ui/Spinner'
import { useCharacterContext } from 'context/character_state'
import { useAppContext } from 'context/state'
import ItemNavigation from '@/components/ui/ItemNavigation'
import Button from '@/components/ui/Button'
import { CharCategoryKey, ICharCategory, ICharItem } from 'data/interfaces/ICharacter'
import { ModalType, Preset} from 'types/enums'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import useTranslation from 'next-translate/useTranslation'
import UserCart from '../UserCart'
import ImageHelper from 'utils/ImageHelper'
import { CharacterCartModalArgs } from '@/components/modals/CharacterCartModal'
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
  const {t} = useTranslation()
  const characterContext = useCharacterContext()
  const userContext = useUserContext()
  const appContext = useAppContext()
  const theme = appContext.theme
  const {isTabletWidth} = appContext.size
  const {categories, setActiveSet, activeSet, variant, setVariant, dataLoaded, init, activeItem, setActiveItem} = characterContext
  const choosenItems = characterContext.choosenItems
  const cost: number = [...choosenItems.values()].filter(el=> el.isLocked===true).map(el => el.price).reduce((p, c)=> {return p+c}, 0)


  const onSaveHandler = () => {
    if(!isTabletWidth || !characterContext.currentCharacter.current?.id) {
      characterContext.saveCurrentSet()
    }
    else {
      appContext.showBottomSheet<CharacterCartModalArgs>(ModalType.CharacterCartModal, {
        onSave: ()=>{
          characterContext.saveCurrentSet()
          appContext.hideBottomSheet()
        },
        choosenItems: characterContext.choosenItems
      }, 0.7)
    }
  }

  const saveCharButton = (<>
    <Button 
    isProcess={characterContext.savingProcess}  
    disabled={!characterContext.currentCharacter.current?.id?false:characterContext.savingProcess?true:Boolean(!characterContext.dataBaseBlob)} 
    onClick={onSaveHandler}  
    styleType={['gradient']}
    className={styles.saveButton}
    >
       {
        !characterContext.currentCharacter.current?.id &&
          t('profile_editor_buyCharacter')
        ||
        cost > 0 && 
          <>
          {t('profile_editor_buyFor')} {cost} <ArbiCoinSvg />
          </>
        ||
          t('save')
        }
    </Button>
  </>)

  const onNavClick = (n: number) => {
    const key = [...categories.keys()].find(el=> el.id === n)
    setActiveSet([key, categories.get(key)])
  }
  
  useEffect(()=>{
    init()
  }, [])

  const sortedVariants = (
    activeSet[1]?.sort((a, b) => {
      if(a.category.key === 'model' && b.category.key === 'model') {
        return a.animationKey === 'man' ? -1:1
      }
      if(a.price === 0 && b.price !== 0) {
        return -1
      }
      else if(a.price !== 0 && b.price === 0) {
        return 1
      }
      else if (a.price !== 0 && !a.isLocked && (b.price !== 0 || b.isLocked)){
        return -1
      }
      else if(b.price !== 0 && !b.isLocked  && (a.price !== 0 || a.isLocked)) {
        return 1
      }
      else {
        return 0
      }
    })
  )

  useEffect(()=>{
    console.log(sortedVariants)
  }, [sortedVariants])

  const commonUser = userContext.currentProfile.id !== Number(process.env.IMNEARID)

  return (
    <div className={styles.root}>
    <div className={styles.content}>
      {!isTabletWidth &&
      <div className={styles.settings}>
        {[...categories.entries()].filter(([el, val])=> commonUser?el.key !== CharCategoryKey.Unic:true ).map(([el, val])=> {
          return (
            <div key={el.id} onClick={()=> setActiveSet([el, val])} className={styles.set}>
              <UserPic 
              className={styles[theme]}
              size={64} 
              active={el.id === activeSet[0].id} 
              image={el.key === CharCategoryKey.Model
                ?el.image&&ImageHelper.urlFromFile(el.image, Preset.xsCrop)
                : `/images/charCategories/${el.key}_${variant.model}.webp`
              }/>
              <P styleType={['medium', 'w500', el === activeSet[0]?'blue':null]} altStyleType={['w500', 'medium', el === activeSet[0]?'blue':null]}  useThemeColor>{el.name}</P>
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
      <div className={styles.variants}>
       {activeSet[1] && sortedVariants.filter(el => commonUser?(el.category.key === CharCategoryKey.Jacket?el.animationKey !== '7':true):true).map(item=> {
        return (
          <div className={styles.variantItem}>
            <UserPic 
            className={styles[theme]}
            size={80} 
            onClick={()=> {setVariant(item); setActiveItem(state=> state?.id === item.id?null:item)}} 
            active={item.id === activeItem?.id && activeSet[0].id === item.categoryId} 
            image={item.image&&ImageHelper.urlFromFile(item.image, Preset.xsCrop)}/>
            {item.price > 0 && item.isLocked &&
              <P styleType={['alignCenter', 'w600', 'small']} className={styles.price}><ArbiCoinSvg/> {item.price}</P>
            }
          </div>
        )
       })}
      </div>
    </div>
    {isTabletWidth && saveCharButton}
    {!isTabletWidth &&
      <UserCart onSave={onSaveHandler} onSet={(charCategoryId: number)=>{
        const category:[ICharCategory, ICharItem[]] = [...characterContext.categories.entries()].find(([k,v])=> {
          return k.id === charCategoryId
        })
        characterContext.setActiveSet(category)
      }}/>
    }  
    </div>

  )
}