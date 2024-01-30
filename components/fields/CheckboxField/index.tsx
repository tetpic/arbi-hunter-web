import styles from './index.module.scss'

import classNames from 'classnames'
import {IField} from 'types/types'
import {useField} from 'formik'
import Checkbox from '../CheckboxListField/Checkbox'



interface Props extends IField<boolean> {
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
 * @options IOption<T>[],
 * @restrictedValues  T[],
 * @grid  number
 * @label  string
 * @itemClassName  string
 * @activeClassName  string
 * @itemLabelClassName  string
 * @circleClassName  string
 * @labelClassName  string
 * @flex  boolean
 * @rootClass  string,
 * @wrapperClassName : string
 */
export default function CheckboxField(props: Props) {
  const { label, type, ...rest} = props
  const [field, meta, helpers] = useField<boolean>(props as any)
  const {value} = field

  const handleCheckboxChanged = (val: boolean) => {
    helpers.setValue(!val)
  }

  return (
    <div className={classNames(styles.root, props.rootClass)}>
          <Checkbox<boolean>
            circleClassName={props.circleClassName}
            className={classNames(props.itemClassName)}
            labelClassName={props.itemLabelClassName}
            activeClassName={props.activeClassName}
            value={value} isActive={value} label={label}
            onChange={(v) => handleCheckboxChanged(v)}
          />
    </div>
  )
}
