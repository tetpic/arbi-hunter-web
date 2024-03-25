import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import { RefillBalanceData } from 'data/interfaces/Common'
import { Currency } from 'types/enums'
import InputField from '@/components/fields/InputField'
import TagsRadioList from '@/components/for_pages/create/utils/TagsRadioList'
import Button from '@/components/ui/Button'
import CrossSvg from '@/components/svg/CrossSvg'
import TariffRepository from 'data/repositories/TariffRepository'
import Validator from 'utils/Validator'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export default function RefillBalanceModal(props: Props) {

  const submit = (data: RefillBalanceData) => {
    TariffRepository.refillBalance({...data, amount: Number(data.amount)})
    .then(res => {
      location.assign(res.payUrl)
    })
  }

  const formik = useFormik<RefillBalanceData>({
    initialValues: {
      amount: undefined,
      currency: Currency.RUB,
      paymentType: 'bankCard',
    },
    onSubmit: submit  
  })

  const body = (
    <div className={styles.root}>
      <Button styleType={['icon', 'backTransparent']} className={styles.closeButton} onClick={props.onClose}><CrossSvg/></Button>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <InputField 
          styleType={'default'} 
          labelType={'top'} 
          label='Сумма' 
          name={'amount'} 
          color={'default'} 
          validate={Validator.required}
          />
          <TagsRadioList name={'currency'} options={[
            {label: 'RUB', value: Currency.RUB},
            {label: 'USD', value: Currency.USD},
            {label: 'EUR', value: Currency.EUR},
            {label: 'UAH', value: Currency.GRN},
          ]}/>
          <Button styleType={['gradient']} type='submit'>Пополнить</Button>
        </Form>
      </FormikProvider>
    </div>
  )

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}