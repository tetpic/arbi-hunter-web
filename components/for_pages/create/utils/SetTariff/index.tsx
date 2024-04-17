import styles from './index.module.scss'

import Button from '@/components/ui/Button'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import P from '@/components/ui/P'
import classnames from 'classnames'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import { useEffect } from 'react'
import { ModalType, Preset, PurchaseType } from 'types/enums'
import Image from 'next/image'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import { ITariff } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import { PurchasePreviewModalArgs } from '@/components/modals/PurchasePreviewModal'
import { clearObject } from 'utils/helpers'
import { IConfirmModalProps } from '@/components/modals/ConfirmModal'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  onSave?: (replace?: boolean) =>void
  onBack?: () =>void
  onPreview?: ()=>void
  type?: 'cv'|'vacancy'
  setText?: string
}

export default function SetTariff(props: Props) {
  const {t} = useTranslation()
  const creationContext = useCreateVcCvContext()
  const tariffs = creationContext.tariffs
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
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

    if(tariff.id === creationContext.currentVc?.subscriptions?.tariff?.id||tariff.id === creationContext.currentCv?.subscriptions?.tariff?.id) {
      props.onSave()
      return
    }

    if(tariff.price === 0) {      
      PurchaseRepository.purchaseItem({...clearObject(purchaseData), tariffId: tariff.id})
      .then(res => {
        props.onSave()
      })
      return 
    }
    const args:PurchasePreviewModalArgs = {
      tariff,
      tariffs: tariffs,      
      data: purchaseData,
      onBuy: (data) => {
        PurchaseRepository.purchaseItem({...clearObject(data), tariffId: tariff.id})
        .then(res=>{
          props.onSave()
        })
        .catch(_=> {
          appContext.hideModal()
          appContext.showModal<IConfirmModalProps>(ModalType.ConfirmModal, {
            text: t('shop_insufficientBalance'),
            callback: () => {
              router.push('/shop')
            }
          })
        })
      }
    }
    isTabletWidth?
    appContext.showBottomSheet<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, args, 600)
    :
    appContext.showModal<PurchasePreviewModalArgs>(ModalType.PurchasePreviewModal, args)

  }


  return (<div className={styles.root}> 
  <P styleType={['huge', 'w600', 'textCenter']}>{t('shop_chooseTariff')}</P>
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
            <Image 
            alt={''} 
            width={70} 
            height={70} 
            src={ImageHelper.urlFromFile(el.icon, Preset.xsCrop)} 
            className={el.key.includes('Vip')?styles.crown:styles.topIcon}
            />
            <P styleType={['w500', 'large']} className={styles.tariffType}>{el.name}</P>
            <P styleType={['w500', 'medium', 'alignCenter']}><ArbiCoinSvg/>{el.price === 0? t('shop_free'): (<><span className={styles.big}>{el.price}</span>/ {el.period} {t('day3')}</>)}</P>
          </div>
          <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
            {el.description}
          </P>
          <Button 
          styleType={['gradient', 'wide']} 
          title={'save_'+el.key} 
          >
            {
            ((el.id === creationContext.currentCv?.subscriptions?.tariff.id||el.id === creationContext.currentVc?.subscriptions?.tariff.id)&& t('save'))||
            props.setText ||'Разместить'}
          </Button>
        </div>

      )
    })}
  </div>
  <div className={styles.buttonsWrapper}>
    <Button styleType={['black']} onClick={props.onBack}>{t('back')}</Button>
    <Button 
    styleType={['gradient']} 
    title={'preview'} 
    onClick={()=> {
      props.onPreview?.()
    }
    }>
      {props.type === 'cv'?  t('create_cv_preview'): t('create_vacancy_preview')}
    </Button>
  </div>
  </div>)
}