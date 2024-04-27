import RadioListField from '@/components/fields/RadioListField'
import styles from './index.module.scss'
import { IOption } from 'types/types'
import CheckboxListField from '@/components/fields/CheckboxListField'

interface Props<T> {
  name: string
  options: IOption<T>[]
  label?: string
  className?: string
  checkbox?: boolean
}

export default function TagsRadioList<T>(props: Props<T>) {

  return (<div className={props.className}>
    {props.label &&
      <p className={styles.label}>{props.label}</p>
    }
    {props.checkbox &&
      <CheckboxListField 
      options={props.options} 
      circleClassName={styles.circleCurrency}
      activeClassName={styles.currencyItem_active}
      itemClassName={styles.currencyItem}
      wrapperClassName={styles.currencyRoot}
      itemLabelClassName={styles.currencyLabel}
      name={props.name}/>
      ||
      <RadioListField 
      name={props.name}
      itemCircleClassname={styles.circleCurrency}
      activeItemClassName={styles.currencyItem_active}
      itemClassName={styles.currencyItem}
      wrapperClassName={styles.currencyRoot}
      itemLabelClassName={styles.currencyLabel}
      options={props.options} 
      />
    }
  </div>
  )
}