import P from '@/components/ui/P'
import styles from './index.module.scss'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import UserPic from '@/components/ui/UserPic'
import { useCharacterContext } from 'context/character_state'
import useTranslation from 'next-translate/useTranslation'
import {  ICharItem } from 'data/interfaces/ICharacter'
import { useRouter } from 'next/router'
import { useAppContext } from 'context/state'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'

interface Props {
  onSave?: () => void
  onSet?: (categoryId: number) => void
  choosenItems?: Map<number, ICharItem>
}

export default function UserCart(props: Props) {
  const userContext = useUserContext()
  const characterContext = useCharacterContext()
  const appContext = useAppContext()
  const router = useRouter()
  const {t} = useTranslation()
  const choosenItems = props.choosenItems||characterContext.choosenItems

  const cost: number = [...choosenItems.values()].filter(el=> el.isLocked===true).map(el => el.price).reduce((p, c)=> {return p+c}, 0)

  const onAddMoney = () => {
    if(appContext.bottomSheetArguments) {
      appContext.hideBottomSheet()
    }
    router.push('/shop')
  }

  return (    
  <div className={styles.cart}>
    <div className={styles.balance}>
      <div className={styles.balanceLeft}>
        <P styleType={['w500', 'medium']}>{t('profile_editor_balance')}</P>
        <P styleType={['w800', 'fs20', 'alignCenter']}><ArbiCoinSvg/> {userContext.user.balance}</P>
      </div>
      <Button styleType={['white']} onClick={onAddMoney}>{t('profile_editor_fill')}</Button>
    </div>
    <div className={styles.choosenItems}>
      <P styleType={['w600', 'large']}>{t('profile_editor_choosenItems')}</P>
      <div className={styles.choosenItemsWrapper}>
        {[...choosenItems.values()].map(item=> {
          return (
            <div className={styles.variantItem}>
              <UserPic 
              active
              size={76} 
              onClick={()=>props.onSet(item.categoryId)}
              image={item.image&&ImageHelper.urlFromFile(item.image, Preset.xsCrop)}/>
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
      isProcess={!props.choosenItems?characterContext.savingProcess:false}  
      onClick={props.onSave}  
      >
        {cost > 0 &&
        <>
        {t('profile_editor_buyFor')} {cost} <ArbiCoinSvg />
        </>
        ||
        t('save')
        }
      </Button>
    </div>
  </div>)
}