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
import { useRouter } from 'next/router'
import { PurchaseType } from 'types/enums'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import useTranslation from 'next-translate/useTranslation'
import UserCart from '../UserCart'


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
  const appContext = useAppContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const {categories, setActiveSet, activeSet, variant, setVariant, dataLoaded, init, activeItem, setActiveItem} = characterContext

  const save = () => {
    if(characterContext.currentCharacter?.current?.purchased) {
      characterContext.saveCurrentSet()
    }
    else {     
      router.push({pathname:'/shop', query: {page: 'packets', buy: PurchaseType.Character}}) 
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
      {isTabletWidth?t('ready'):characterContext.currentCharacter?.current?.purchased?t('save'):t('profile_editor_buyCharacter')}
    </Button>
  </>)

  const onNavClick = (n: number) => {
    const key = [...categories.keys()].find(el=> el.id === n)
    setActiveSet([key, categories.get(key)])
  }
  
  useEffect(()=>{
    init()
  }, [])

  return (
    <div className={styles.root}>
    <div className={styles.content}>
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
      {/* {saveCharButton} */}
      <div className={styles.variants}>
       {activeSet[1] && activeSet[1].map(item=> {
        return (
          <div className={styles.variantItem}>
            <UserPic 
            size={80} 
            onClick={()=> {setVariant(item); setActiveItem(state=> state?.id === item.id?null:item)}} 
            active={item.id === activeItem?.id && activeSet[0].id === item.categoryId} 
            image={item.image&&FILES + item.image.source}/>
            {item.price > 0 &&
              <P styleType={['alignCenter', 'w600', 'small']} className={styles.price}><ArbiCoinSvg/> {item.price}</P>
            }
          </div>
        )
       })}
      </div>
    </div>
    {!isTabletWidth &&
      <UserCart onSave={save}/>
    }
    {/* <div className={styles.cart}>
      <div className={styles.balance}>
        <div className={styles.balanceLeft}>
          <P styleType={['w500', 'medium']}>{t('profile_editor_balance')}</P>
          <P styleType={['w800', 'fs20', 'alignCenter']}><ArbiCoinSvg/> {userContext.user.balance}</P>
        </div>
        <Button styleType={['white']}>{t('profile_editor_fill')}</Button>
      </div>
      <div className={styles.choosenItems}>
        <P styleType={['w600', 'large']}>{t('profile_editor_choosenItems')}</P>
        <div className={styles.choosenItemsWrapper}>
          {[...characterContext.choosenItems.values()].map(item=> {
            return (
              <div className={styles.variantItem}>
                <UserPic 
                active
                size={76} 
                image={item.image&&FILES + item.image.source}/>
                {item.price > 0 && item.isLocked === true &&
                  <P styleType={['alignCenter', 'w600', 'small']} className={styles.price}><ArbiCoinSvg/> {item.price}</P>
                }
              </div>
            )
          })}
        </div>
        <Button 
        className={styles.buyButton} 
        styleType={['gradient']}
        isProcess={characterContext.savingProcess}  
        disabled={characterContext.savingProcess?true:Boolean(!characterContext.dataBaseBlob)} 
        onClick={save}  
        >
          {t('profile_editor_buyFor')} {[...characterContext.choosenItems.values()].filter(el=> el.isLocked===true).map(el => el.price).reduce((p, c)=> {return p+c}, 0)} <ArbiCoinSvg />
        </Button>
      </div>
    </div> */}
    </div>

  )
}