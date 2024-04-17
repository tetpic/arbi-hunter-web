import styles from './index.module.scss'

import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import PersonalHeader from './PersonalHeader'
import PersonalBody from './PersonalBody'
import PersonalCard from './PersonalCard'
import { usePersonalContext } from 'context/personal_state'
import ContentItem from 'components/ui/Content/ContentItem'
import EditToolbar from './EditToolbar'
import classNames from 'classnames'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { ModalType, PurchaseType, SnackbarType} from 'types/enums'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { useTariffContext } from 'context/tariff_state'
import { useRouter } from 'next/router'
import { ShopPages } from '../shop'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import { clearObject } from 'utils/helpers'
import Spacer from '@/components/ui/Spacer'

interface Props {
  id?: number
}

export default function PersonalPage(props: Props) {
  const {t} = useTranslation()
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const tariffContext = useTariffContext()
  const [isEditing, setIsEditing] = useState(false)
  const userContext = useUserContext()
  const router = useRouter()

  const saveBranding = () => {
    personalContext.updatePersonalPage()
    .then(res => {
      const personalTariff = [...tariffContext.packets.values()][0]
      if(res === null && personalTariff.price < userContext.user.balance) {
        appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, {
          tariff: [...tariffContext.packets.values()][0], 
          onBuy: (data) => {
            PurchaseRepository.purchaseItem({...clearObject(data), tariffId: personalTariff.id})
            .then(res => {
              personalContext.updatePersonalPage()
              .then(_ => {
                setIsEditing(!isEditing)
                appContext.showSnackbar(t('shop_tariffPurchased'), SnackbarType.success)
              })
              .catch(e=> {
                return null
              })
            })
          },
          tariffs: tariffContext.packets,
        })
        return
      }
      else if(res === null && personalTariff.price > userContext.user.balance) {
        appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, {
          text: t('shop_insufficientBalance'),
          maxWidth: 320,
          callback: () => {
            router.push({pathname: '/shop', query: {page: ShopPages.Balance}})
          }
        })
        return
      }
      else {
        setIsEditing(!isEditing)
      }
    })
  }

  useEffect(()=>{
    personalContext.setPersonalPage({profileId: props.id}) 
    .then(res => {
      personalContext.setBackgrounds(res)
    })
    tariffContext.setActiveSubscriptions([PurchaseType.PersonalPage])
    tariffContext.setPackets([PurchaseType.PersonalPage])
  }, [])

  if(personalContext.loading) {
    return <Spinner size={24} />
  }

  if(personalContext.personalPage === null) {
    return <div className={styles.root}>
      <Spinner size={24} />
    </div>
  }

  const isHeaderExist = (
    (personalContext.currentProfile?.profileType === ProfileType.Hirer && personalContext.backgrounds?.get(BackgroundCategoryType.Places) && personalContext.currentProfile?.logo)
    ||
    (personalContext.currentProfile?.profileType === ProfileType.Employee && personalContext.backgrounds?.get(BackgroundCategoryType.Places)) 
  )

  return (<div className={styles.root}> 
    {!isEditing && isHeaderExist
      &&
      <PersonalHeader isEditing={!props.id&&isEditing}/>
      ||
      isEditing && <PersonalHeader isEditing={!props.id&&isEditing}/>
    }
    <PersonalCard 
    save={() => personalContext.updatePersonalPage()} 
    isEditable={!props.id} 
    noHeader={!isHeaderExist}
    isEditing={!props.id&&isEditing} 
    switchMode={() => !props.id&&setIsEditing(!isEditing)}
    />

    {isEditing && 
      <ContentItem className={classNames(styles.bodyItem, isEditing&&styles.bodyItem_edit)}>
        <EditToolbar/>
      </ContentItem>
    }
    <ContentItem  className={styles.bodyItem}>
      {tariffContext.activeSubscriptions.size === 0 && !isEditing &&
      <>
        <P styleType={['grey', 'medium', 'w500']}>Подписка на брендирование не оформлена.</P>
        <Spacer basis={24}/>
      </>
      }
      {personalContext.blocks.size > 0 &&
      <PersonalBody isEditing={!props.id&&isEditing}/>
      ||
      <div className={styles.emptyWrapper}>
        <P styleType={['w500', 'medium']}>Нет информации</P>
      </div>
      }
    </ContentItem>
    {isEditing &&
      <Button 
      styleType={['gradient']} 
      onClick={saveBranding} 
      className={styles.saveButton}>{t('save')}</Button>
    }
  </div>)
}