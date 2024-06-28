import { IPurchase, ITariff, PurchaseForm } from 'data/interfaces/Common'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import Formatter from 'utils/formatter'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { useAppContext } from 'context/state'
import { InterfaceLanguage, ModalType, Preset, PurchaseType, SnackbarType } from 'types/enums'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import { useTariffContext } from 'context/tariff_state'
import { useUserContext } from 'context/user_state'
import CharacterRepository from 'data/repositories/CharacterRepository'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import { clearObject } from 'utils/helpers'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import ImageHelper from 'utils/ImageHelper'
import { AppMetricaEvent, sendToMetrika } from 'utils/sendToMetrics'


interface Props {
  tariff: ITariff
  cvs?: ICV[],
  onCvVcUpdate?: () => void
  vacancies?: IVacancy[],
  type?: 'buy'|'info'
  purchase?: IPurchase
}

export default function PurchaseItem({tariff, cvs, vacancies, ...props}: Props) {
  const {t, lang} = useTranslation()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const tariffContext = useTariffContext()
  const userContext = useUserContext()  
  const router = useRouter()

  const buyHandler = (data: PurchaseForm) => {
    switch (tariff.purchaseType) {
      case PurchaseType.Character : {
        CharacterRepository.createCharacter({gender: 'male'})
        .then(_=> {
          sendToMetrika(AppMetricaEvent.CreateCharacter)
          CharacterRepository.buyCharacter()
          .then(_=> {
            tariffContext.setPacketsState(state=> {
              state.delete(tariff.id)
              return new Map(state)
            })
            appContext.showSnackbar(t('shop_characterBought'), SnackbarType.success)
            userContext.refreshUser()
          })
          .catch(_=> {
            appContext.showSnackbar(t('error'), SnackbarType.error)
          })
        })
      }
      break
      case PurchaseType.CvTariff: {
        const currentCv = cvs&&cvs?.find(el => el.id === data.cvId)
        if(data.cvId && currentCv && currentCv.subscriptions) {
          PurchaseRepository.upgradeSubscription(currentCv.subscriptions.id, {startAt: data.startAt, cvId: data.cvId, tariffId: tariff.id})
          .then(_=>{
            appContext.showSnackbar(t('shop_tariffRefreshed'), SnackbarType.success)
            userContext.refreshUser()
            props.onCvVcUpdate?.()
          })
          return
        }
      }
      break
      case PurchaseType.VacancyTariff: {
        const currentVc = vacancies&&vacancies?.find(el => el.id === data.vacancyId)
        if(data.vacancyId && currentVc && currentVc.subscriptions) {
          PurchaseRepository.upgradeSubscription(currentVc.subscriptions.id, {startAt: data.startAt, vacancyId: data.vacancyId, tariffId: tariff.id})
          .then(_=>{
            appContext.showSnackbar(t('shop_tariffRefreshed'), SnackbarType.success)
            userContext.refreshUser()
            props.onCvVcUpdate?.()
          })
          return
        }
      } 
      break
      case PurchaseType.AddContactsOpen: {
        PurchaseRepository.addContactsOpenToTariff({
          subscriptionId: data.subscriptionId, 
          contactsCanOpenCount: tariff.contactsCanOpenCount
        })
        .then(_=> {
          appContext.showSnackbar(t('shop_tariffRefreshed'), SnackbarType.success)
          userContext.refreshUser()
          tariffContext.setActiveSubscriptions([PurchaseType.ContactsOpen])
        })
        .catch(_ => {
          appContext.showSnackbar(t('error'), SnackbarType.error)
        })
        return
      }     
      break
      default: {
        PurchaseRepository.purchaseItem(clearObject({
          startAt: data.startAt,
          cvId: data.cvId,
          vacancyId: data.vacancyId,
          tariffId: tariff.id
        }))
        .then(_=>{
          appContext.showSnackbar(t('shop_tariffRefreshed'), SnackbarType.success)
        })
        .catch(_ => {
          appContext.showSnackbar(t('error'), SnackbarType.error)
        })
      }
    }
  }


  const showPreviewModal = () => {
    if(tariff.price > userContext.user.balance) {
      appContext.showSnackbar(t('shop_Insufficient_funds'), SnackbarType.error)
      return
    }
    const args:PurchasePreviewModalArgs = {
      tariff: tariff,
      tariffs: tariffContext.packets,
      activeSubscriptions: [...tariffContext.activeSubscriptions.values()],
      cvs,
      vacancies,
      onBuy: buyHandler
    }
    isTabletWidth?
    appContext.showBottomSheet<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, args, 580)
    :
    appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, args)
  }

  useEffect(()=>{
    if(tariff.purchaseType === PurchaseType.Character && router.query.buy === PurchaseType.Character ) {
      showPreviewModal()
    }
  }, [router])

  console.log(props.purchase)


  return (
    <div 
    className={styles.item} 
    key={tariff.id} 
    // @ts-ignore
    style={{'--gradientColor1': '#'+tariff.colors[0], '--gradientColor2': '#'+tariff.colors[1]}}
    >
      {tariff.icon &&
        <Image 
        unoptimized 
        src={ImageHelper.urlFromFile(tariff.icon, Preset.xsCrop)} 
        alt={'item icon'} 
        width={60} 
        height={60} 
        className={styles.icon}/>
      }
      <P styleType={['w500', 'medium']} className={styles.title}>{tariff.name}</P>
      {tariff.price > 0 &&
        <P 
        styleType={['alignCenter', 'w500', 'medium']} 
        className={styles.price}>
          <ArbiCoinSvg/> 
          {tariff.price} {Formatter.pluralize(tariff.price, t('arbicoins1'), t('arbicoins2'), t('arbicoins3'))} / {tariff.period} {Formatter.pluralize(tariff.period, t('day1'), t('day2'), t('day3'))}
        </P>
      }
      {tariff.price === 0 &&
        <P styleType={['alignCenter', 'w500', 'medium']} className={styles.price}>{t('shop_free')}</P>
      } 
      <P>{tariff.description}</P>
      {props.type === 'buy' &&
        <Button styleType={['gradient', 'wide']} className={styles.button} onClick={()=>showPreviewModal()}>{tariff.price > 0? t('shop_buy'):t('save')}</Button>
      }
      {props.type === 'info' &&  props.purchase.purchaseType === PurchaseType.ContactsOpen &&
        <P styleType={['medium', 'w600']}>Осталось {props.purchase.subscription.contactsCanOpenCount} из {props.purchase.subscription.tariff.contactsCanOpenCount}</P>
      }
      {props.type === 'info' &&
        <P 
        className={styles.button}  
        styleType={['medium', 'w500']}
        >
          {t('shop_bought')} {Formatter.formatDate(props.purchase?.createdAt, {timeOptions: {year: 'numeric', hour: 'numeric', minute: 'numeric'}, lang: lang as InterfaceLanguage})}
        </P>
      }
    </div>
  )
}