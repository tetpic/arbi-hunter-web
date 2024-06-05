import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import { useField, useFormikContext } from 'formik'
import { CompensationType, Currency } from 'types/enums'
import Checkbox from '@/components/fields/CheckboxListField/Checkbox'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import TagsRadioList from '../../TagsRadioList'
import { TranslateCurrency } from 'utils/enumsTranslations'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
}

export default function Compensation(props: Props) {
  const {t} = useTranslation()
  const [compensation] = useField('compensation')
  const [currency] = useField('currency')
  const {values, setFieldValue} = useFormikContext<IVacancyCreate>()


  return (
    <div className={styles.root}>
      {compensation.value !== CompensationType.Contract &&
      <>
        <P styleType={['large', 'w600']} useThemeColor className={styles.title}>{t('create_payments')}</P>
        <div className={styles.inputsWrapper}>
          <InputField  
          isNumbersOnly
          maxLength={12} 
          // className={styles.input} 
          styleType={'bottomBorder'} 

          color={'default'} 
          name={'salaryMin'} 
          label={t('fromCapitalized')} 
          labelType={'underlined'}
          priceFormatting
          error={t('create_oneOfFieldsMustBeFilled')}
          suffix={<span className={styles.suffix}>{TranslateCurrency(currency.value)}</span>}
          />
          <span> – </span>
          <InputField  
          isNumbersOnly
          labelType={'underlined'}
          maxLength={12} 
          // className={styles.input} 
          styleType={'bottomBorder'} 
          color={'default'} 
          name={'salaryMax'} 
          label={t('toCapitalized')} 
          priceFormatting
          error={t('create_oneOfFieldsMustBeFilled')}
          suffix={<span className={styles.suffix}>{TranslateCurrency(currency.value)}</span>}

          />
        </div>
      </>
      }


      {compensation.value !== CompensationType.Contract &&
        <TagsRadioList name={'currency'} options={[
          {value: Currency.USD, label: Currency.USD},
          {value: Currency.RUB, label: t('rouble')},
          {value: Currency.EUR, label: 'Euro'},
          {value: Currency.GRN, label: t('grivnes')},
        ]}/>
      }

      <P styleType={['large', 'w600']} useThemeColor  className={styles.title}>{t('create_method')}</P>

      <Checkbox<CompensationType>
      // circleClassName={styles.radio}
      // className={classNames(styles.radioItem)}
      value={values.compensation} 
      label={t('create_compensatoinContract')}
      isActive={values.compensation === CompensationType.Contract} 
      onChange={(v) => setFieldValue('compensation', v==CompensationType.Contract?CompensationType.Salary:CompensationType.Contract)}
      />
    </div>
  )
}



