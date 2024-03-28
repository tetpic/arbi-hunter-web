import { IPurchase, ITariff } from 'data/interfaces/Common'
import styles from './index.module.scss'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import Formatter from 'utils/formatter'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { useAppContext } from 'context/state'
import { ModalType, PurchaseType, SnackbarType } from 'types/enums'
import { FILES } from 'types/constants'
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


interface Props {
  tariff: ITariff
  cvs?: ICV[],
  vacancies?: IVacancy[],
  type?: 'buy'|'info'
  purchase?: IPurchase
}

export default function PurchaseItem({tariff, cvs, vacancies, ...props}: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const tariffContext = useTariffContext()
  const userContext = useUserContext()  
  const router = useRouter()


  const showPreviewModal = () => {
    if(tariff.price > userContext.user.balance) {
      appContext.showSnackbar('Недостаточно средств', SnackbarType.error)
      return
    }
    appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, {
      tariff: tariff,
      tariffs: tariffContext.packets,
      cvs,
      vacancies,
      onBuy: (data) => {
        if(tariff.purchaseType === PurchaseType.Character) {
          CharacterRepository.createCharacter({gender: 'male'})
          .then(_=> {
            CharacterRepository.buyCharacter()
            .then(res=> {
              tariffContext.setPacketsState(state=> {
                state.delete(tariff.id)
                return new Map(state)
              })
            })
            .catch(err => {
              appContext.showSnackbar('Ошибка', SnackbarType.error)
            })
          })
          return
        }
        const currentCv = cvs&&cvs?.find(el => el.id === data.cvId)
        
        if(data.cvId && currentCv) {
          PurchaseRepository.upgradeSubscription(currentCv.subscriptions.id, {date: data.date, cvId: data.cvId, tariffId: tariff.id})
          .then(_=>{
            appContext.showSnackbar('Тариф успешно обновлен', SnackbarType.success)
          })
          return
        }
        const currentVc = vacancies&&vacancies?.find(el => el.id === data.vacancyId)
        
        if(data.vacancyId && currentVc) {
          PurchaseRepository.upgradeSubscription(currentVc.subscriptions.id, {date: data.date, vacancyId: data.vacancyId, tariffId: tariff.id})
          .then(_=>{
            appContext.showSnackbar('Тариф успешно обновлен', SnackbarType.success)
          })
          return
        }
        PurchaseRepository.cvVcPurchase(clearObject({
          date: data.date,
          cvId: data.cvId,
          vacancyId: data.vacancyId,
          tariffId: tariff.id
        }))
        .then(_=>{
          appContext.showSnackbar('Тариф успешно приобретен', SnackbarType.success)
        })
        .catch(err => {
          appContext.showSnackbar('Ошибка', SnackbarType.error)
        })
      }
  
    })
  }

  useEffect(()=>{
    if(tariff.purchaseType === PurchaseType.Character && router.query.buy === PurchaseType.Character ) {
      showPreviewModal()
    }
  }, [router])


  return (
    <div 
    className={styles.item} 
    key={tariff.id} 
    // @ts-ignore
    style={{'--gradientColor1': '#'+tariff.colors[0], '--gradientColor2': '#'+tariff.colors[1]}}
    >
      {tariff.icon &&
        <Image src={FILES + tariff.icon?.source} alt={'item icon'} width={60} height={60} className={styles.icon}/>
      }
      <P styleType={['w600', 'large']} className={styles.title}>{tariff.name}</P>
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
        <Button styleType={['gradient', 'wide']} className={styles.button} onClick={()=>showPreviewModal()}>{t('shop_buy')}</Button>
      }
      {props.type === 'info' &&
        <P className={styles.button}  styleType={['medium', 'w500']}>Куплено {Formatter.formatDate(props.purchase?.createdAt, {timeOptions: {year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
      }
    </div>
  )
}