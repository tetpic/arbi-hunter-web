import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { ITariff } from 'data/interfaces/Common'
import { useAppContext } from 'context/state'
import Image from 'next/image'
import { FILES } from 'types/constants'
import P from '@/components/ui/P'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import Formatter from 'utils/formatter'
import Button from '@/components/ui/Button'
import CrossSvg from '@/components/svg/CrossSvg'
import { useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import ArbiCoinGradientSvg from '@/components/svg/ArbiCoinGradientSvg'
import { useUserContext } from 'context/user_state'
import classNames from 'classnames'
import ArrowSvg from '@/components/svg/ArrowSvg'
import { IVacancy } from 'data/interfaces/IVacancy'
import { ICV } from 'data/interfaces/ICV'
import RadioListField from '@/components/fields/RadioListField'
import ShopDateTimePicker from '@/components/for_pages/shop/DateTimePicker'
import { PurchaseType } from 'types/enums'

interface Props {
  onClose: () => void
}

enum PurchaseStep {
  default = 'default',
  calendar = 'calendar',
  purchase = 'purchase',
  confirmation = 'confirmation',
  setItems = 'setItems'
}

interface PurchaseForm {
  date: string|undefined,
  cvId: number|undefined,
  vacancyId: number|undefined
}

export interface PurchasePreviewModalArgs  {
  tariff: ITariff
  tariffs: Map<number, ITariff>
  cvs?: ICV[]
  vacancies?: IVacancy[]
  data?: {cvId?: number, vacancyId?: number}
  onBuy: (data: PurchaseForm) => void
}

export default function PurchasePreviewModal(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const balance = userContext.user?.balance
  const args:PurchasePreviewModalArgs = appContext.modalArguments
  const [type, setType] = useState<PurchaseStep>(PurchaseStep.default)
  const [date, setDate] = useState<string|undefined>(undefined)
  const items: ICV[]|IVacancy[] = (args.cvs||args.vacancies)?.filter(el=> {
    const currentTariff = args.tariffs.get(el.subscriptions?.tariff?.id)
    return (currentTariff.price < args.tariff?.price) && (currentTariff.id !== args.tariff?.id)
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
      date: date,
      cvId: args.data?.cvId||undefined,
      vacancyId: args.data?.vacancyId||undefined
    },
    onSubmit: buy
  })


  const purchase = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>Покупка</P>
        <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      <P styleType={['w600', 'huge', 'textCenter']}>Покупка тарифа <br /> {args.tariff.name}</P>
      <div className={styles.balanceLine}>
      <P styleType={['alignCenter', 'w600', 'huge' ]} className={styles.crossed}><ArbiCoinSvg/> {userContext.user.balance}</P>
      <ArrowSvg/>
      <P styleType={['alignCenter', 'w600', 'huge' ]} ><ArbiCoinSvg/> {userContext.user.balance - args.tariff.price}</P>
      </div>
      <P styleType={['w600', 'fs32', 'alignCenter']} className={styles.balance}><ArbiCoinGradientSvg/>{args.tariff.price}</P>
      <Button styleType={['gradient']} onClick={props.onClose}>Готово</Button>
    </div>
  )

  const confirmation = (
    <div className={classNames(styles.root, styles.rootConfirm)}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>Подтверждение покупки</P>
        <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      <div className={styles.balanceLine}>
        <P styleType={['w600', 'huge']}>Баланс</P>
        <P styleType={['w600', 'huge', 'alignCenter']} className={styles.balance}><ArbiCoinGradientSvg/>{balance}</P>
      </div>

      <div className={styles.confirmInfo}>
        <P styleType={['w600', 'large', 'alignCenter']}>
          {/* @ts-ignore */}
          <div className={styles.imageWrapper} style={{'--gradientColor1': '#'+args.tariff.colors[0], '--gradientColor2': '#'+args.tariff.colors[1]}}>
            {args.tariff.icon &&
              <Image src={FILES+ args.tariff.icon.source} alt={'tariff icon'} width={24} height={24}/>
            }
          </div>
          {args.tariff.name}
        </P>

        <div className={styles.divider}></div>

        <P styleType={['w500', 'medium', 'alignCenter']}>
          <ArbiCoinSvg/>
          {args.tariff.price} {Formatter.pluralize(args.tariff.price, 'арбикоин', 'арбикоина', 'арбикоинов')} / {args.tariff.period} {Formatter.pluralize(args.tariff.period, 'день', 'дня', 'дней')}
        </P>
      </div>

      <div className={styles.buttonsWrapper}>
        <Button 
        styleType={['grey', 'wide']} 
        onClick={() => {setType(PurchaseStep.default)}}
        >
          Отменить
        </Button>
        <Button 
        styleType={['gradient', 'wide']} 
        onClick={formik.submitForm} >Купить</Button> 
      </div>
    </div>
  )

  const calendar = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>Выбрать дату и время активации</P>
        <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      {formik.values.date &&
        <P>{Formatter.formatDate(formik.values.date, {timeOptions:{day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
      }
      <div className={styles.calendarField}>
        <ShopDateTimePicker 
        name={'date'} 
        maxDate={maxDate()}
        />
      </div>
      <div className={styles.buttonsWrapper}>
        <Button 
        styleType={['grey', 'wide']} 
        onClick={() => {
          formik.setFieldValue('date', undefined)
          setDate(null)
          setType(PurchaseStep.default)
        }}
        >
          {formik.values.date?'Удалить':'Отменить'}
        </Button>
        <Button styleType={['gradient', 'wide']} onClick={() => setType(PurchaseStep.default)}>Сохранить</Button> 
      </div>

    </div>
  )

  const setItems = (
    <div className={classNames(styles.root, styles.rootConfirm)}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>Выберите {args.vacancies?'вакансию':'резюме'}</P>
        <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      {items.length > 0 &&
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
      }
      <Button 
      styleType={['gradient']} 
      onClick={()=>setType(PurchaseStep.confirmation)}
      disabled={balance < args.tariff.price||(args.cvs?.length > 0&&!formik.values.cvId)||(args.vacancies?.length > 0&&!formik.values.vacancyId)}
      >
        Продолжить
      </Button>
    </div>
  )

  const body = (
    <div className={styles.root}>
      <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      {args.tariff.icon &&
        <Image className={styles.tariffIcon} src={FILES+ args.tariff.icon.source} alt={'tariff icon'} width={96} height={96}/>
      }
      <P styleType={['w600', 'huge']}>{args.tariff.name}</P>
      {args.tariff.price > 0 &&
        <P 
        styleType={['alignCenter', 'w500', 'medium']} 
        className={styles.price}>
          <ArbiCoinSvg/> 
          {args.tariff.price} {Formatter.pluralize(args.tariff.price, 'арбикоин', 'арбикоина', 'арбикоинов')} / {args.tariff.period} {Formatter.pluralize(args.tariff.period, 'день', 'дня', 'дней')}
        </P>
      }
      {args.tariff.price === 0 &&
        <P styleType={['alignCenter', 'w500', 'medium']} className={styles.price}>Бесплатно</P>
      } 
      <P styleType={['medium']}>{args.tariff.description}</P>
      {formik.values.date &&
        <P styleType={['w500', 'greyLight', 'small']}>Дата активации: {Formatter.formatDate(formik.values.date, {timeOptions:{day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric'}})}</P>
      }
      <div className={styles.buttonsWrapper}>
        <Button styleType={['grey', 'wide']} onClick={() => setType(PurchaseStep.calendar)}>Выбрать дату активации</Button>
        <Button styleType={['gradient', 'wide']} onClick={() => (args.tariff.purchaseType === PurchaseType.CvTariff||args.tariff.purchaseType === PurchaseType.VacancyTariff)?setType(PurchaseStep.setItems):setType(PurchaseStep.confirmation)}>Купить</Button> 
      </div>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
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