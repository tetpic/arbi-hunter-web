import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import { useField } from 'formik'
import { CompensationType, Currency } from 'types/enums'
import { TranslateCurrency } from 'utils/enumsTranslations'
import styles from './index.module.scss'

interface Props {
}

export default function Compensation(props: Props) {
  const [compensation] = useField('compensation')
  const [currency] = useField('currency')


  return (
    <div className={styles.root}>
      <p className={styles.title}>Способ</p>
      <RadioListField 
      name={'compensation'}
      itemClassName = {styles.radioItem}
      options={[
        {value: CompensationType.Salary, label: 'Оклад'},
        {value: CompensationType.Commission, label: 'Процент'},
        {value: CompensationType.Gybrid, label: 'Гибрид (оклад+процент)'},
        {value: CompensationType.Piecework, label: 'Сдельная'},
        {value: CompensationType.Contract, label: 'Договорная'}
      ]} 
      itemCircleClassname={styles.radio}
      />

      {compensation.value !== CompensationType.Contract &&
        <p className={styles.title}>Оплата</p>
      }

      {(compensation.value === CompensationType.Salary || compensation.value == CompensationType.Gybrid )
        && 
        <InputField  
        isNumbersOnly
        maxLength={10} 
        className={styles.input} 
        styleType={'default'} 
        color={'default'} 
        name={'salary'} 
        label={'Оклад'} 
        labelType={'top'} 
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
      }

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
    </div>
  )
}