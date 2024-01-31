import styles from './index.module.scss'

import classNames from 'classnames'
import {IField} from 'types/types'
import {useField} from 'formik'
import Checkbox from '../CheckboxListField/Checkbox'



interface Props<T> extends IField<T> {
  label?: string
  itemClassName?: string
  activeClassName?: string
  itemLabelClassName?: string
  circleClassName?: string
  labelClassName?: string
  rootClass?: string,
  wrapperClassName? : string
}


/**
 * @label  string
 * @itemClassName  string
 * @activeClassName  string
 * @itemLabelClassName  string
 * @circleClassName  string
 * @labelClassName  string
 * @rootClass  string,
 * @wrapperClassName : string
 */
export default function CheckboxField<T>(props: Props<T>) {
  const { label, type, ...rest} = props
  const [field, meta, helpers] = useField<T>(props as any)
  const {value} = field

  const handleCheckboxChanged = (val: T) => {
    props.value
    helpers.setValue(!val?props.value:undefined)
  }

  return (
    <div className={classNames(styles.root, props.rootClass)}>
          <Checkbox<T>
            circleClassName={props.circleClassName}
            className={classNames(props.itemClassName)}
            labelClassName={props.itemLabelClassName}
            activeClassName={props.activeClassName}
            value={value} isActive={value === props.value} label={label}
            onChange={(v) => handleCheckboxChanged(v)}
          />
    </div>
  )
}
