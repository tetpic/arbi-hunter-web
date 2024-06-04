import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import styles from './index.module.scss'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import { Form, FormikProvider, useFormik } from 'formik'
import { IVacancyCvSearchParams } from 'data/interfaces/Common'
import InputField from '@/components/fields/InputField'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'
import { TranslateCompensationType, TranslateCurrency } from 'utils/enumsTranslations'
import P from '@/components/ui/P'
import TagsRadioList from '@/components/for_pages/create/utils/TagsRadioList'
import { CompensationType, Currency } from 'types/enums'
import CheckboxField from '@/components/fields/CheckboxField'
import Button from '@/components/ui/Button'

interface Props {
  isBottomSheet: boolean
  onClose: () => void
}

export interface SalaryModalArgs {
  initialValues?: Pick<IVacancyCvSearchParams, 'salaryMax'|'salaryMin'|'currency'|'compensation'>,
  onSubmit: (data: Pick<IVacancyCvSearchParams, 'salaryMax'|'salaryMin'|'currency'|'compensation'>) => void
  title?: string
}

export default function SalaryModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args: SalaryModalArgs = appContext.bottomSheetArguments
  

  const initialValues: Pick<IVacancyCvSearchParams, 'salaryMax'|'salaryMin'|'currency'|'compensation'> = {
    compensation: undefined,
    salaryMax: undefined,
    salaryMin: undefined,
    currency: Currency.RUB,
  }

  const submit = (data: Partial<IVacancyCvSearchParams>) => {
    args.onSubmit(data)
    props.onClose()
  }

  const formik = useFormik<Pick<IVacancyCvSearchParams, 'salaryMax'|'salaryMin'|'currency'|'compensation'>>(
    {
      initialValues: {...initialValues, ...args.initialValues, currency: Currency.RUB},
      onSubmit: submit
    }
  )

  const body = (<>
    <P styleType={['w600', 'large']} useThemeColor>{args.title}</P>
    {!formik.values.compensation && <>
    <div className={styles.inputsWrapper}>
      <InputField  
      isNumbersOnly
      maxLength={12} 
      className={styles.input} 
      styleType={'default'} 
      color={'default'} 
      name={'salaryMin'} 
      label={'oт'} 
      labelType={'static'}
      labelClassName={styles.label}
      priceFormatting
      error={t('filters_oneFieldShouldBeFilled')}
      suffix={<P styleType={['medium', 'greyLight']} >{TranslateCurrency(formik.values.currency)}</P>}
      />
      <span> – </span>
      <InputField  
      isNumbersOnly
      labelType={'static'}
      labelClassName={styles.label}
      maxLength={12} 
      className={styles.input} 
      styleType={'default'} 
      color={'default'} 
      name={'salaryMax'} 
      label={'до'} 
      priceFormatting
      error={t('filters_oneFieldShouldBeFilled')}
      suffix={<P styleType={['medium', 'greyLight']} >{TranslateCurrency(formik.values.currency)}</P>}
      />
    </div>

    <TagsRadioList className={styles.tags} name={'currency'} options={[
      {value: Currency.RUB, label: 'Руб'},
      {value: Currency.USD, label: Currency.USD},
      {value: Currency.EUR, label: 'Euro'},
      {value: Currency.GRN, label: 'Гривны'},
    ]}/>
    </>}
  
    <CheckboxField 
    itemClassName={styles.radioField} 
    name={'compensation'} 
    label={TranslateCompensationType(CompensationType.Contract, t)} 
    value={CompensationType.Contract} 
    />

    <Button type='submit' styleType={['gradient', 'wide']}>{t('apply')}</Button>
  </>

  )


  return (<BottomSheetLayout>
    <BottomSheetBody>
      <FormikProvider value={formik}>
        <Form>
          <div className={styles.root}>
            {body}
          </div>
        </Form>
      </FormikProvider>
    </BottomSheetBody>
  </BottomSheetLayout> 

  )
}