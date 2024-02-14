import styles from './index.module.scss'
import { IField } from 'types/types'
import { useField } from 'formik'
import FieldError from 'components/ui/FieldError'
import usePressAndHover from 'hooks/usePressAndHover'
import classNames from 'classnames'
import React, { ChangeEvent, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import FieldLabel from '@/components/ui/FieldLabel'

const TextAreaInner = (props: any) => {

  if(props.autoSize){
    return <TextareaAutosize {...props}/>
  }else{
    return <textarea {...props}/>
  }
}
interface Props extends IField<string> {
  autoSize?: boolean
  color?: 'white' | 'purple'
  areaClassname? : string
  onChange? : (e: ChangeEvent<HTMLTextAreaElement>) => void
  value?: string
}

/**
 * @autoSize  boolean
 * @color 'white' | 'purple'
 * @areaClassname string
 * @onChange (e: ChangeEvent<HTMLTextAreaElement>) => void
 * @value string
 */
export default function TextAreaField(props: Props) {
  const [ref, press, hover] = usePressAndHover()
  const [field, meta, helpers] = useField(props as any)
  const [focused, setFocused] = useState(false)
  const showError = meta.touched && !!meta.error


  return (
    <div className={styles.root} ref={ref} data-field={props.name}>
      {/* {props.label && <FloatingFieldLabel active={focused || !!field.value}>{props.label}</FloatingFieldLabel>} */}
      {props.label && <FieldLabel className={styles.topLabel}>{props.label}</FieldLabel>}
      <TextAreaInner
        {...field}
        autoSize={props.autoSize}
        placeholder={props.placeholder}
        onFocus={() => {
          setFocused(true)
        }}
        onBlur={() => {
          if (!field.value) {
            setFocused(false)
          }
        }}
        {...(props.value&&{value: props.value})}
     
        onChange={props.onChange}
        className={classNames({
          [styles.input]: true,
          [styles.hover]: hover,
          [styles.focused]: focused || field.value,
          [styles.withIcon]: props.iconName,
          [styles.error]: showError,
          [styles.white]: props.color === 'white',
          [styles.purple]: props.color === 'purple',
        }, props.areaClassname&&props.areaClassname)}
      />
      
      <FieldError showError={showError}>{meta.error}</FieldError>
    </div>
  )
}
function useForwardRef<T>(arg0: null) {
  throw new Error('Function not implemented.')
}

