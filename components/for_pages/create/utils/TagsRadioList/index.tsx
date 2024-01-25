import RadioListField from '@/components/fields/RadioListField'
import styles from './index.module.scss'
import { IOption } from 'types/types'

interface Props<T> {
  name: string
  options: IOption<T>[]
  label?: string
}

export default function TagsRadioList<T>(props: Props<T>) {

  return (<div>
    {props.label &&
      <p className={styles.label}>{props.label}</p>
    }
    <RadioListField 
    name={props.name}
    itemCircleClassname={styles.circleCurrency}
    activeItemClassName={styles.currencyItem_active}
    itemClassName={styles.currencyItem}
    wrapperClassName={styles.currencyRoot}
    itemLabelClassName={styles.currencyLabel}
    options={props.options} 
    />
  </div>
  )
}