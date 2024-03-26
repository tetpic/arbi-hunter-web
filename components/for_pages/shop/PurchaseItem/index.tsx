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


interface Props {
  tariff: ITariff
  cvs?: ICV[],
  vacancies?: IVacancy[],
  type?: 'buy'|'info'
  purchase?: IPurchase
}

export default function PurchaseItem({tariff, cvs, vacancies, ...props}: Props) {
  const appContext = useAppContext()
  const tariffContext = useTariffContext()
  const userContext = useUserContext()
  


  const showPreviewModal = (tariff: ITariff) => {
    
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

  // @ts-ignore
  return (<div className={styles.item} key={tariff.id} style={{'--gradientColor1': '#'+tariff.colors[0], '--gradientColor2': '#'+tariff.colors[1]}}>
  {tariff.icon &&
    <Image src={FILES + tariff.icon?.source} alt={'item icon'} width={60} height={60} className={styles.icon}/>
  }
  <P styleType={['w600', 'large']} className={styles.title}>{tariff.name}</P>
  {tariff.price > 0 &&
    <P 
    styleType={['alignCenter', 'w500', 'medium']} 
    className={styles.price}>
      <ArbiCoinSvg/> 
      {tariff.price} {Formatter.pluralize(tariff.price, 'арбикоин', 'арбикоина', 'арбикоинов')} / {tariff.period} {Formatter.pluralize(tariff.period, 'день', 'дня', 'дней')}
    </P>
  }
  {tariff.price === 0 &&
    <P styleType={['alignCenter', 'w500', 'medium']} className={styles.price}>Бесплатно</P>
  } 
  <P>{tariff.description}</P>
  {props.type === 'buy' &&
  <Button styleType={['gradient', 'wide']} className={styles.button} onClick={()=>showPreviewModal(tariff)}>Купить</Button>
  }
  {props.type === 'info' &&
    <P className={styles.button}  styleType={['medium', 'w500']}>Куплено {Formatter.formatDate(props.purchase?.createdAt, {timeOptions: {year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
  }
</div>)
}