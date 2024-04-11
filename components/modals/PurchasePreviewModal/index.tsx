import styles from './index.module.scss'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { IPurchase, ITariff, PurchaseForm } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import Formatter from 'utils/formatter'
import Button from '@/components/ui/Button'
import CrossSvg from '@/components/svg/CrossSvg'
import { useRef, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import ArbiCoinGradientSvg from '@/components/svg/ArbiCoinGradientSvg'
import { useUserContext } from 'context/user_state'
import classNames from 'classnames'
import ArrowSvg from '@/components/svg/ArrowSvg'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import RadioListField from '@/components/fields/RadioListField'
import ShopDateTimePicker from '@/components/for_pages/shop/DateTimePicker'
import { Preset, PurchaseType } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import ImageHelper from 'utils/ImageHelper'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

enum PurchaseStep {
  default = 'default',
  calendar = 'calendar',
  purchase = 'purchase',
  confirmation = 'confirmation',
  setItems = 'setItems'
}



export interface PurchasePreviewModalArgs  {
  tariff: ITariff
  tariffs: Map<number, ITariff>
  activeSubscriptions?: IPurchase[] 
  cvs?: ICV[]
  vacancies?: IVacancy[]
  data?: {cvId?: number, vacancyId?: number}
  onBuy: (data: PurchaseForm) => void
}

export default function PurchasePreviewModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const balance = useRef(userContext.user?.balance)
  const args:PurchasePreviewModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments
  const [type, setType] = useState<PurchaseStep>(PurchaseStep.default)
  const [date, setDate] = useState<string|undefined>(undefined)
  const items: ICV[]|IVacancy[] = (args.cvs||args.vacancies)?.filter(el=> {
    const currentTariff = args.tariffs.get(el.subscriptions?.tariff?.id)
    return (currentTariff?.price < args.tariff?.price) && (currentTariff.id !== args.tariff?.id)
  })||[]

  const buy = (data: PurchaseForm) => {
    args.onBuy(data)
    setType(PurchaseStep.purchase)
  }

  const maxDate = ()=>{
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d
  }

  const formik = useFormik<PurchaseForm>({
    initialValues: {
      startAt: date,
      cvId: args.data?.cvId||undefined,
      vacancyId: args.data?.vacancyId||undefined,
      subscriptionId: (args.activeSubscriptions && args.activeSubscriptions.length === 1) ?args.activeSubscriptions[0]?.subscriptionId :undefined,
      tariffId: undefined
    },
    onSubmit: buy
  })


  const purchase = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>{t('shop_purchase')}</P>
        <Button type='button' styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      <P styleType={['w600', 'huge', 'textCenter']}>{t('shop_tariffPurchase')} <br /> {args.tariff.name}</P>
      <div className={styles.balanceLine}>
      <P styleType={['alignCenter', 'w600', 'huge' ]} className={styles.crossed}><ArbiCoinSvg/> {balance.current}</P>
      <ArrowSvg/>
      <P styleType={['alignCenter', 'w600', 'huge' ]} ><ArbiCoinSvg/> {balance.current - args.tariff.price}</P>
      </div>
      <P styleType={['w600', 'fs32', 'alignCenter']} className={styles.balance}><ArbiCoinGradientSvg/>{args.tariff.price}</P>
      <Button type='button' styleType={['gradient']} onClick={props.onClose}>{t('ready')}</Button>
    </div>
  )

  const confirmation = (
    <div className={classNames(styles.root, styles.rootConfirm)}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>{t('shop_purchaseConfirmation')}</P>
        <Button type='button' styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      <div className={styles.balanceLine}>
        <P styleType={['w600', 'huge']}>{t('shop_balance')}</P>
        <P styleType={['alignCenter', 'w600', 'huge' ]} className={styles.balance}><ArbiCoinGradientSvg/> {balance.current}</P>
      </div>

      <div className={styles.confirmInfo}>
        <P styleType={['w600', 'large', 'alignCenter']}>
          {/* @ts-ignore */}
          <div className={styles.imageWrapper} style={{'--gradientColor1': '#'+args.tariff.colors[0], '--gradientColor2': '#'+args.tariff.colors[1]}}>
            {args.tariff.icon &&
              <Image 
              unoptimized 
              src={ImageHelper.urlFromFile(args.tariff.icon, Preset.smallIconCrop)} 
              alt={'tariff icon'} 
              width={24} 
              height={24}/>
            }
          </div>
          {args.tariff.name}
        </P>

        <div className={styles.divider}></div>

        <P styleType={['w500', 'medium', 'alignCenter']}>
          <ArbiCoinSvg/>
          {args.tariff.price} {Formatter.pluralize(args.tariff.price, t('arbicoins1'), t('arbicoins2'), t('arbicoins3'))} / {args.tariff.period} {Formatter.pluralize(args.tariff.period, t('day1'), t('day2'), t('day3'))}
        </P>
      </div>

      <div className={styles.buttonsWrapper}>
        <Button 
        type='button'
        styleType={['grey', 'wide']} 
        onClick={() => {setType(PurchaseStep.default)}}
        >
          {t('cancel')}
        </Button>
        <Button 
        type='button'
        styleType={['gradient', 'wide']} 
        onClick={formik.submitForm} >{t('shop_buy')}</Button> 
      </div>
    </div>
  )

  const calendar = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>{t('shop_setActivationTime')}</P>
        <Button type='button' styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      {formik.values.startAt &&
        <P>{Formatter.formatDate(formik.values.startAt, {timeOptions:{day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
      }
      <div className={styles.calendarField}>
        <ShopDateTimePicker 
        name={'startAt'} 
        maxDate={maxDate()}
        />
      </div>
      <div className={styles.buttonsWrapper}>
        <Button 
        type='button'
        styleType={['grey', 'wide']} 
        onClick={() => {
          formik.setFieldValue('date', undefined)
          setDate(null)
          setType(PurchaseStep.default)
        }}
        >
          {formik.values.startAt?t('delete'):t('cancel')}
        </Button>
        <Button type='button' styleType={['gradient', 'wide']} onClick={() => setType(PurchaseStep.default)}>{t('save')}</Button> 
      </div>
    </div>
  )

  const setItems = (
    <div className={classNames(styles.root, styles.rootConfirm)}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>
          {args.tariff.purchaseType === PurchaseType.AddContactsOpen && t('shop_chooseTariff')
            ||
            args.tariff.purchaseType === PurchaseType.CvTariff && t('shop_chooseCv')
            ||
            args.tariff.purchaseType === PurchaseType.VacancyTariff && t('shop_chooseVacancy')    
          }
        </P>
        <Button type='button' styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      {items.length > 0 && args.tariff.purchaseType !== PurchaseType.AddContactsOpen &&
        <RadioListField 
        rootClass={styles.radioListField}
        options={
          items.map(el=> ({
            label: el.categories[0].name,
            value: el.id
          }))
        } 
        name={args.cvs?'cvId':'vacancyId'}
        />
        ||
        items.length === 0 && args.tariff.purchaseType !== PurchaseType.AddContactsOpen &&
        <P styleType={['w500', 'medium']}>
        {args.tariff.purchaseType === PurchaseType.CvTariff && t('shop_noActiveCvs')}
        {args.tariff.purchaseType === PurchaseType.VacancyTariff && t('shop_noActiveVacancies')}
        </P>
      }
      {args.tariff.purchaseType === PurchaseType.AddContactsOpen && args.activeSubscriptions?.length > 0 &&
        <RadioListField 
        rootClass={styles.radioListField}
        options={
          args.activeSubscriptions.filter(el => el?.purchaseType === PurchaseType.ContactsOpen).map(el => ({
            label: <>
            <P styleType={['w500', 'medium']}>
              {args.tariffs.get(el.subscription.tariffId).name}
            </P>
            <P styleType={['w500', 'medium', 'greyLight']}>
              (истекает {Formatter.formatDate(el.subscription.endAt)}, осталось {el.subscription.contactsCanOpenCount} {Formatter.pluralize(el.subscription.contactsCanOpenCount, 'открытие', 'открытия', 'открытий')})
            </P>
            </>,
            value: el.subscriptionId
          }))
        } 
        name={'subscriptionId'}
        />
        ||
        args.activeSubscriptions&&args.activeSubscriptions?.length === 0 &&
        <P styleType={['w500', 'medium']}>{t('shop_noAvailableTariffs')}</P>
      }
      
      <Button 
      type='button'
      styleType={['gradient']} 
      onClick={()=>setType(PurchaseStep.confirmation)}
      disabled={
        balance.current < args.tariff.price
        ||(args.tariff.purchaseType === PurchaseType.CvTariff&&!formik.values.cvId)
        ||(args.tariff.purchaseType === PurchaseType.VacancyTariff &&!formik.values.vacancyId)
        ||(args.tariff.purchaseType === PurchaseType.AddContactsOpen && !formik.values.subscriptionId)
      }
      >
        {t('continue')}
      </Button>
    </div>
  )

  const body = (
    <div className={styles.root}>
      <Button type='button' styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      {args.tariff.icon &&
        <Image 
        unoptimized
        className={styles.tariffIcon} 
        src={ImageHelper.urlFromFile(args.tariff.icon, Preset.iconCrop)} 
        alt={'tariff icon'} 
        width={96} 
        height={96}/>
      }
      <P styleType={['w600', 'huge']}>{args.tariff.name}</P>
      {args.tariff.price > 0 &&
        <P 
        styleType={['alignCenter', 'w500', 'medium']} 
        className={styles.price}>
          <ArbiCoinSvg/> 
          {args.tariff.price} {Formatter.pluralize(args.tariff.price, t('arbicoins1'), t('arbicoins2'), t('arbicoins3'))} / {args.tariff.period} {Formatter.pluralize(args.tariff.period, t('day1'), t('day2'), t('day3'))}
        </P>
      }
      {args.tariff.price === 0 &&
        <P styleType={['alignCenter', 'w500', 'medium']} className={styles.price}>{t('shop_free')}</P>
      } 
      <P styleType={['medium']}>{args.tariff.description}</P>
      {formik.values.startAt &&
        <P styleType={['w500', 'greyLight', 'small']}>{t('shop_activationTime')}: {Formatter.formatDate(formik.values.startAt, {timeOptions:{day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
      }
      <div className={styles.buttonsWrapper}>
        <Button styleType={['grey', 'wide']} type='button' onClick={() => setType(PurchaseStep.calendar)}>{t('shop_setActivationTimeAlt')}</Button>
        <Button 
        type='button'
        styleType={['gradient', 'wide']} 
        onClick={() => (
          args.tariff.purchaseType === PurchaseType.CvTariff&&!args.data.cvId
          ||args.tariff.purchaseType === PurchaseType.VacancyTariff&&!args.data.vacancyId
          ||(args.tariff.purchaseType === PurchaseType.AddContactsOpen&&args.tariffs.size > 1))
          ?setType(PurchaseStep.setItems)
          :setType(PurchaseStep.confirmation)}
        >
          {t('shop_buy')}
        </Button> 
      </div>
    </div>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          <FormikProvider value={formik}>
          <Form className={styles.form}>
            {type === 'default' && body}
            {type === 'calendar' && calendar}
            {type === 'confirmation' && confirmation}
            {type === 'purchase' && purchase}
            {type === 'setItems' && setItems}
          </Form>
          </FormikProvider>
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout} mobileFullScreen>
    <ModalBody>
      <FormikProvider value={formik}>
      <Form>
        {type === 'default' && body}
        {type === 'calendar' && calendar}
        {type === 'confirmation' && confirmation}
        {type === 'purchase' && purchase}
        {type === 'setItems' && setItems}
      </Form>
      </FormikProvider>
    </ModalBody>
  </ModalLayout>)
}