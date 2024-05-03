import RadioListField from '@/components/fields/RadioListField'
import styles from './index.module.scss'
import { IOption } from 'types/types'
import CheckboxListField from '@/components/fields/CheckboxListField'
import P from '@/components/ui/P'
import classNames from 'classnames'

interface Props<T> {
  name: string
  options: IOption<T>[]
  label?: string
  className?: string
  checkbox?: boolean
  wrap?: boolean
}

export default function TagsRadioList<T>(props: Props<T>) {

  return (<div className={props.className}>
    {props.label &&
      <P useThemeColor className={styles.label}>{props.label}</P>
    }
    {props.checkbox &&
      <CheckboxListField 
      options={props.options} 
      circleClassName={styles.circleCurrency}
      activeClassName={styles.currencyItem_active}
      itemClassName={styles.currencyItem}
      wrapperClassName={classNames(styles.currencyRoot, props.wrap&&styles.wrap)}
      itemLabelClassName={styles.currencyLabel}
      name={props.name}/>
      ||
      <RadioListField 
      name={props.name}
      itemCircleClassname={styles.circleCurrency}
      activeItemClassName={styles.currencyItem_active}
      itemClassName={styles.currencyItem}
      wrapperClassName={classNames(styles.currencyRoot, props.wrap&&styles.wrap)}
      itemLabelClassName={styles.currencyLabel}
      options={props.options} 
      />
    }
  </div>
  )
}