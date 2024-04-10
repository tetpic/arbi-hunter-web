import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import SectionSubtitle from '@/components/for_pages/create/utils/SectionSubtitle'
import CrossSvg from '@/components/svg/CrossSvg'
import InputField from '@/components/fields/InputField'
import { Form, FormikProvider, useFormik } from 'formik'
import { ICVCreate } from 'data/interfaces/ICV'
import { CompensationType, Currency } from 'types/enums'
import Checkbox from '@/components/fields/CheckboxListField/Checkbox'
import TagsRadioList from '@/components/for_pages/create/utils/TagsRadioList'
import Button from '@/components/ui/Button'
import { useAppContext } from 'context/state'
import Validator from 'utils/Validator'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import { TranslateCurrency } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose?: () => void
  isBottomSheet?: boolean
}

export interface ICompensationModalArgs {
  onSubmit: (data: Partial<ICVCreate>) => void
  initialValues: Partial<ICVCreate>
}

export default function CompensationModal(props: Props) {
  const {t} = useTranslation()

  const appContext = useAppContext()
  const args: ICompensationModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments

  const submit = (data: Partial<ICVCreate>) => {
    args.onSubmit(data)
    appContext.hideModal()
  }

  const formik = useFormik<Partial<ICVCreate>>({
    initialValues: {
      salary: args.initialValues.salary||'',
      currency: args.initialValues.currency||Currency.USD,
      compensation: args.initialValues.compensation||undefined     
    },
    onSubmit: submit
  })

  const header = (
    <div className={styles.header}>
      <SectionSubtitle text={t('create_cv_salaryLevel')} className={styles.title}/>
      <Button styleType={['icon', 'backTransparent']} altStyleType={['icon', 'invertSvg']} onClick={props.onClose}>
        <CrossSvg/>
      </Button>
    </div>
  )

  const body = (
    <div className={styles.body}>
      {formik.values.compensation !== CompensationType.Contract &&
      <>
        <InputField 
        styleType={'blueBottomBorder'} 
        label={t('create_cv_salaryLevel')}
        labelClassName={styles.salaryLabel}
        inputClassName={styles.salaryInput}
        className={styles.salary}
        labelType='static'
        color={'white'} 
        priceFormatting
        name={'salary'}
        suffix={<span className={styles.suffix}>{TranslateCurrency(formik.values.currency)}</span>}
        validate={Validator.required}
        />      
        <TagsRadioList 
        name={'currency'} 
        options={[
          {value: Currency.USD, label: Currency.USD},
          {value: Currency.RUB, label: 'Рубль'},
          {value: Currency.EUR, label: 'Euro'},
          {value: Currency.GRN, label: 'Гривны'},
        ]}
        />
      </>
      }
      <Checkbox 
      label={t('create_compensatoinContract')}
      value={formik.values.compensation} 
      isActive={formik.values.compensation === CompensationType.Contract} 
      onChange={(v)=>formik.setFieldValue('compensation', v?undefined:CompensationType.Contract)}/>
      <Button className={styles.button} title='saveAndNext'>{t('saveAndContinue')}</Button>
    </div>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          <FormikProvider value={formik}>
            <Form>
              {header}
              {body}
            </Form>
          </FormikProvider>
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }
 
  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody className={styles.modalBody}>
        <FormikProvider value={formik}>
          <Form>
            {header}
            {body}
          </Form>
        </FormikProvider>
      </ModalBody>
    </ModalLayout>
  )
}