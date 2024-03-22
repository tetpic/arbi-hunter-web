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
import DateField from '@/components/fields/DateField'
import { Form, FormikProvider, useFormik } from 'formik'

interface Props {
  onClose: () => void
}

export interface PurchasePreviewModalArgs  {
  tariff: ITariff
}

export default function PurchasePreviewModal(props: Props) {
  const appContext = useAppContext()
  const args:PurchasePreviewModalArgs = appContext.modalArguments
  const [type, setType] = useState<'calendar'|'default'>('default')
  const [date, setDate] = useState<Date|null>(null)

  const formik = useFormik({
    initialValues: {
      date: date
    },
    onSubmit: () => {}
  })

  

  const calendar = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P styleType={['w600', 'large']}>Выбрать дату и время активации</P>
        <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      </div>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <DateField 
          styleType={'default'} 
          showTimeInput
          openDefault
          hideInput
          name={'date'}/>
        </Form>
      </FormikProvider>

      <div className={styles.buttonsWrapper}>
        <Button 
        styleType={['grey', 'wide']} 
        onClick={() => {
          setDate(null)
          setType('default')
        }}
        >
          Отменить
        </Button>
        <Button styleType={['gradient', 'wide']} onClick={() => setType('default')}>Сохранить</Button> 
      </div>

    </div>
  )

  const body = (
    <div className={styles.root}>
      <Button styleType={['icon', 'backTransparent']} onClick={props.onClose} className={styles.closeButton}><CrossSvg/></Button>
      {args.tariff.icon &&
        <Image src={FILES+ args.tariff.icon.source} alt={'tariff icon'} width={96} height={96}/>
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
      <div className={styles.buttonsWrapper}>
        <Button styleType={['grey', 'wide']} onClick={() => setType('calendar')}>Выбрать дату активации</Button>
        <Button styleType={['gradient', 'wide']}>Купить</Button> 
      </div>
      
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {type === 'default' && body}
      {type === 'calendar' && calendar}
    </ModalBody>
  </ModalLayout>)
}