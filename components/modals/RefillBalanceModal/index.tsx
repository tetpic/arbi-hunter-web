import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import { RefillBalanceData } from 'data/interfaces/Common'
import { Currency, PaymentType, SnackbarType } from 'types/enums'
import InputField from '@/components/fields/InputField'
import TagsRadioList from '@/components/for_pages/create/utils/TagsRadioList'
import Button from '@/components/ui/Button'
import CrossSvg from '@/components/svg/CrossSvg'
import Validator from 'utils/Validator'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import P from '@/components/ui/P'
import { useEffect } from 'react'
import { useAppContext } from 'context/state'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export default function RefillBalanceModal(props: Props) {
  const appContext = useAppContext()

  const submit = (data: RefillBalanceData) => {
    const amount = data.amount.toString().replaceAll(' ', '')    
    PurchaseRepository.refillBalance({...data, amount: Number(amount)})
    .then(res => {
      location.assign(res.payUrl)
    })
    .catch(err => {
      appContext.showSnackbar(err?.message||'Ошибка платежной системы', SnackbarType.error)
    })
  }

  const formik = useFormik<RefillBalanceData>({
    initialValues: {
      amount: undefined,
      currency: Currency.RUB,
      paymentType: PaymentType.CARD,
    },
    onSubmit: submit  
  })

  const cryptoCurrencyOptions = [
    {label: 'RUB', value: Currency.RUB},
    {label: 'USD', value: Currency.USD},
    {label: 'EUR', value: Currency.EUR},
    {label: 'UAH', value: Currency.GRN},
  ]

  const cardCurrencyOptions = [
    {label: 'RUB', value: Currency.RUB},
    {label: 'UAH', value: Currency.GRN},
  ]

  useEffect(()=>{
    formik.setFieldValue('currency', Currency.RUB)
  }, [formik.values.paymentType])

  const body = (
    <div className={styles.root}>
      <div className={styles.top}>
        <P styleType={['large', 'w600']} useThemeColor>Пополнение баланса</P>

      <Button altStyleType={['invertSvg']} className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
      </div>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <InputField 
          styleType={'default'} 
          labelType={'top'} 
          label='Сумма' 
          name={'amount'} 
          color={'default'} 
          isNumbersOnly
          priceFormatting
          validate={Validator.required}
          />
          <TagsRadioList name={'currency'} options={formik.values.paymentType === PaymentType.CARD? cardCurrencyOptions : cryptoCurrencyOptions}/>
          
          <P styleType={['medium', 'w600']} useThemeColor>Тип оплаты</P>
          <TagsRadioList name={'paymentType'} options={[
            {label: 'Банковской картой', value: PaymentType.CARD},
            {label: 'Криптовалютой', value: PaymentType.CRYPTO},
          ]}/>
          <Button styleType={['gradient']} type='submit'>Пополнить</Button>
        </Form>
      </FormikProvider>
    </div>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout className={styles.modalLayout}>
      <BottomSheetBody>
        {body}
      </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}