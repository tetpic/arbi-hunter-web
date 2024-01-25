import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import { useField, useFormikContext } from 'formik'
import { CompensationType, Currency } from 'types/enums'
import Checkbox from '@/components/fields/CheckboxListField/Checkbox'
import classNames from 'classnames'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import TagsRadioList from '../../TagsRadioList'

interface Props {
}

export default function Compensation(props: Props) {
  const [compensation] = useField('compensation')
  const [currency] = useField('currency')
  const {values, setFieldValue} = useFormikContext<IVacancyCreate>()


  return (
    <div className={styles.root}>
      {compensation.value !== CompensationType.Contract &&
      <>
        <p className={styles.title}>Оплата</p>
        <div className={styles.inputsWrapper}>
          <InputField  
          isNumbersOnly
          maxLength={12} 
          className={styles.input} 
          styleType={'bottomBorder'} 
          color={'default'} 
          name={'salaryMin'} 
          label={'От'} 
          labelType={'static'}
          priceFormatting
          />
          <span> – </span>
          <InputField  
          isNumbersOnly
          labelType={'static'}
          maxLength={12} 
          className={styles.input} 
          styleType={'bottomBorder'} 
          color={'default'} 
          name={'salaryMax'} 

          label={'До'} 
          priceFormatting
          />
        </div>
      </>
      }


      {compensation.value !== CompensationType.Contract &&
        <TagsRadioList name={'currency'} options={[
          {value: Currency.USD, label: Currency.USD},
          {value: Currency.RUB, label: 'Рубль'},
          {value: Currency.EUR, label: 'Euro'},
          {value: Currency.GRN, label: 'Гривны'},
        ]}/>
      }

      <p className={styles.title}>Способ</p>

      <Checkbox<CompensationType>
      circleClassName={styles.radio}
      className={classNames(styles.radioItem)}
      value={values.compensation} 
      label={'Договорная'}
      isActive={values.compensation === CompensationType.Contract} 
      onChange={(v) => setFieldValue('compensation', v?undefined:CompensationType.Contract)}
      />
    </div>
  )
}