import CheckboxListField from 'components/fields/CheckboxListField'
import InputField from 'components/fields/InputField'
import RadioListField from 'components/fields/RadioListField'
import { CompensationType, Currency } from 'types/enums'
import styles from './index.module.scss'

interface Props {
}

export default function Compensation(props: Props) {

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
        {value: CompensationType.Contract, label: 'Сдельная'},
        {value: CompensationType.Piecework, label: 'Договорная'}
      ]} 
      itemCircleClassname={styles.radio}
      />
      <p className={styles.title}>Оплата</p>
      <InputField styleType={'default'} color={'default'} name={'salary'} />
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


    </div>
  )
}