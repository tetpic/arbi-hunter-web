import P from '@/components/ui/P'
import styles from './index.module.scss'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import UserPic from '@/components/ui/UserPic'
import { FILES } from 'types/constants'
import { useCharacterContext } from 'context/character_state'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onSave?: () => void
}

export default function UserCart(props: Props) {
  const userContext = useUserContext()
  const characterContext = useCharacterContext()
  const {t} = useTranslation()



  return (    <div className={styles.cart}>
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
      onClick={props.onSave}  
      >
        {t('profile_editor_buyFor')} {[...characterContext.choosenItems.values()].filter(el=> el.isLocked===true).map(el => el.price).reduce((p, c)=> {return p+c}, 0)} <ArbiCoinSvg />
      </Button>
    </div>
  </div>)
}