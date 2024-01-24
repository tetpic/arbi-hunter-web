import styles from './index.module.scss'

import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import { useField, useFormikContext } from 'formik'
import { CompensationType, Currency } from 'types/enums'
import Checkbox from '@/components/fields/CheckboxListField/Checkbox'
import classNames from 'classnames'
import { IVacancyCreate } from 'data/interfaces/IVacancy'

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
          // suffix={<span className={styles.suffix}>{TranslateCurrency(currency.value)}</span>}
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
          // suffix={<span className={styles.suffix}>{TranslateCurrency(currency.value)}</span>}
          />
        </div>
      </>
      }

      {/* {(compensation.value === CompensationType.Salary || compensation.value == CompensationType.Gybrid )
        && 
        <InputField  
        isNumbersOnly
        maxLength={12} 
        className={styles.input} 
        styleType={'default'} 
        color={'default'} 
        name={'salary'} 
        label={'Оклад'} 
        labelType={'top'} 
        priceFormatting
        suffix={<span className={styles.suffix}>{TranslateCurrency(currency.value)}</span>}
        />
      }

      {(compensation.value === CompensationType.Gybrid || compensation.value === CompensationType.Commission)
        && 
        <InputField 
        maxLength={3} 
        isNumbersOnly 
        className={styles.input} 
        styleType={'default'} 
        color={'default'} 
        name={'commission'} 
        label={'Комиссия'} 
        labelType={'top'}  
        suffix={<span className={styles.suffix}>%</span>}
        />
      } */}

      {compensation.value !== CompensationType.Contract &&
        <RadioListField 
        name={'currency'}
        itemCircleClassname={styles.circleCurrency}
        activeItemClassName={styles.currencyItem_active}
        itemClassName={styles.currencyItem}
        wrapperClassName={styles.currencyRoot}
        itemLabelClassName={styles.currencyLabel}
        options={[
          {value: Currency.USD, label: Currency.USD},
          {value: Currency.RUB, label: 'Рубль'},
          {value: Currency.EUR, label: 'Euro'}
        ]} 
        />
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
      {/* <CheckboxListField 
      name={'compensation'}
      itemClassName = {styles.radioItem}
      options={CompensationTypeTranslated.map(el=> {return {value: el[0], label: el[1]}})} 
      circleClassName={styles.radio}
      /> */}
    </div>
  )
}