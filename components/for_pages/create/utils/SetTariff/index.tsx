import Button from '@/components/ui/Button'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import P from '@/components/ui/P'
import classnames from 'classnames'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import { useEffect } from 'react'
import { ModalType, PurchaseType } from 'types/enums'
import Image from 'next/image'
import { FILES } from 'types/constants'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import { ITariff } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { clearObject } from 'utils/helpers'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import { useRouter } from 'next/router'

interface Props {
  onSave?: (replace?: boolean) =>void
  onBack?: () =>void
  onPreview?: ()=>void
  type?: 'cv'|'vacancy'
  setText?: string
}

export default function SetTariff(props: Props) {
  const creationContext = useCreateVcCvContext()
  const tariffs = creationContext.tariffs
  const appContext = useAppContext()
  const router = useRouter()

  useEffect(()=>{
    if(tariffs.size === 0) {
      PurchaseRepository.getTariff(props.type==='cv'? PurchaseType.CvTariff:PurchaseType.VacancyTariff).then(res=>{
        creationContext.setTariffs(state => {
          res.forEach(el => {
            state.set(el.id, el)
          })
          return new Map(state)
        })
      })
    }
  }, [])

  const buyTariff = (tariff: ITariff, ) => {
    const purchaseData = {
      cvId: props.type === 'cv'? creationContext.draftItem.current.id:null,
      vacancyId: props.type === 'vacancy'? creationContext.draftItem.current.id:null
    }

    if(tariff.id === creationContext.currentVc.subscriptions?.tariff?.id) {
      props.onSave()
      return
    }

    if(tariff.price === 0) {
      
      PurchaseRepository.cvVcPurchase({...clearObject(purchaseData), tariffId: tariff.id})
      .then(res => {
        props.onSave()
      })
      return 
    }
    appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, {
      tariff,
      tariffs: tariffs,
      data: purchaseData,
      onBuy: (data) => {
        PurchaseRepository.cvVcPurchase({...clearObject(data), tariffId: tariff.id})
        .then(res=>{
          props.onSave()
        })
        .catch(_=> {
          appContext.hideModal()
          appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, {
            text: 'Недостаточно арбикоинов, хотите пополнить баланс?',
            callback: () => {
              router.push('/shop')
            }
          })
        })
      }
    })
  }


  return (<div className={styles.root}> 
  <P styleType={['huge', 'w600', 'textCenter']}>Выберите тариф</P>
  <div className={styles.tariffItems}>
    {tariffs.size > 0 &&[...tariffs.values()].filter(el => {
      if(creationContext.currentCv?.subscriptions||creationContext.currentVc?.subscriptions) {
        return el.price >= tariffs.get(creationContext.currentCv?.subscriptions?.tariff.id||creationContext.currentVc?.subscriptions?.tariff.id).price
      }
      else {
        return true
      }
    }).map(el => {
      return (
        <div 
        className={classnames(styles.tariff)} 
        /* @ts-ignore */
        style={{'--gradientColor1': '#'+el.colors[0], '--gradientColor2': '#'+el.colors[1]}} 
        key={el.id} 
        onClick={()=>buyTariff(el)}
        >
          <div className={styles.top}>
            <Image src={FILES + el.icon.source} alt={''} width={70} height={70} className={el.key.includes('Vip')?styles.crown:styles.topIcon}/>
            <P styleType={['w500', 'large']} className={styles.tariffType}>{el.name}</P>
            <P styleType={['w500', 'medium', 'alignCenter']}><ArbiCoinSvg/>{el.price === 0? 'Бесплатно': (<><span className={styles.big}>{el.price}</span>/ {el.period} дней</>)}</P>
          </div>
          <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
            {el.description}
          </P>
          <Button 
          styleType={['gradient', 'wide']} 
          title={'save_'+el.key} 
          >
            {
            ((el.id === creationContext.currentCv?.subscriptions?.tariff.id||el.id === creationContext.currentVc?.subscriptions?.tariff.id)&& 'Сохранить')||
            props.setText ||'Разместить'}
          </Button>
        </div>

      )
    })}
  </div>
  <div className={styles.buttonsWrapper}>
    <Button styleType={['black']} onClick={props.onBack}>Назад</Button>
    <Button 
    styleType={['gradient']} 
    title={'preview'} 
    onClick={()=> {
      props.onPreview?.()
    }
    }>
      Предпросмотр {props.type === 'cv'?  'резюме': 'вакансии'}
    </Button>
  </div>
  </div>)
}