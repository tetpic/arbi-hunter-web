import styles from './index.module.scss'

import { IField, InputStyleType } from 'types/types'
import { useField } from 'formik'
import { useIMask } from 'react-imask'
import FieldError from 'components/ui/FieldError'
import classNames from 'classnames'
import usePressAndHover from 'hooks/usePressAndHover'
import { ChangeEvent, MouseEventHandler, ReactElement, useEffect, useState } from 'react'
import CrossSvg from 'components/svg/CrossSvg'
import FloatingFieldLabel from 'components/ui/FloatingFieldLabel'
import FieldLabel from 'components/ui/FieldLabel'
import Formatter from 'utils/formatter'

type FormatType = 'phone'

interface Props extends IField<string> {
  obscure?: boolean
  format?: FormatType
  success?: boolean
  styleType: InputStyleType
  suffix?: 'clear' | 'icon' | ReactElement
  suffixClassName?: string
  color: 'default'|'white' | 'purple' | 'darkPurple'
  suffixIcon?: ReactElement
  onSuffixClick?: () => void
  prefix?: JSX.Element|JSX.Element[]|null
  className?: string
  errorClassName?: string
  value?: any
  onClick?: MouseEventHandler<HTMLInputElement>
  labelType?: 'floating' | 'top' | 'static' | 'underlined'
  isNumbersOnly?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  autocompleteOff?: boolean
  error?: string
  minLength?: number
  maxLength?: number
  validateOnSubmit?: boolean
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  priceFormatting?: boolean
  labelClassName?: string
  inputClassName?: string
  backgroundColor?: string
}


//TODO: отрефакторить на несколько разных компонентов: InputField, PriceInputField, PhoneInputField, NumberInputField например
export default function InputField(props: Props) {  
  const [wrapperRef, press, hover] = usePressAndHover()
  const [field, meta, helpers] = useField(props as any)
  const showError = meta.touched && !!meta.error
  const { ref: phoneRef, value} = useIMask({ mask: '+7 000 000 00 00' })
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    if (props.format === 'phone' && phoneRef.current && phoneRef.current.value) {
      helpers.setValue(phoneRef.current.value)      
    }
  }, [phoneRef.current])

  const getSuffix = () => {
    switch (props.suffix) {
      case 'clear':
        return <div className={classNames(styles.suffix, props.suffixClassName)} onClick={() => helpers.setValue('')}><CrossSvg color={'red'} /></div>
      case 'icon':
        return <div className={classNames(styles.suffix, props.suffixClassName)} onClick={props.onSuffixClick}>{props.suffixIcon}</div>
      default:
        return props.suffix
    }
  }

  const onClickHandler:MouseEventHandler<HTMLInputElement> = (e) => {
    helpers.setTouched(false)
    props.onClick&&props.onClick(e)
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyUp&&props.onKeyUp(e)
  }

  

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if(props.priceFormatting || props.isNumbersOnly) {
      const numbers = e.target.value.replace(/[^0-9]/g, '') as string
      props.isNumbersOnly && (e.target.value = numbers)
      const formatted = Formatter.formatNumber(Number(numbers))
      props.priceFormatting && (e.target.value = formatted==='0'?'':formatted)
    }
  }
  
  useEffect(()=>{
    if(props.priceFormatting && field.value) {
      helpers.setValue(Formatter.formatNumber(Number(field.value.replaceAll(' ', ''))))
    }
  }, [])

  

  return (
    <div className={classNames(styles.root, props.className)} data-field={props.name}>
      {props.labelType === 'top' ? <FieldLabel className={styles.topLabel}>{props.label}</FieldLabel> : null}
      <div className={classNames(
        styles.wrapper, 
        styles[props.styleType],
        showError&&styles.error

        )} ref={wrapperRef}>
        {props.prefix}
        {props.labelType === 'floating' ? <FloatingFieldLabel active={focused || !!field.value}>{props.label}</FloatingFieldLabel> : null}
        {props.labelType === 'static'? <FieldLabel className={classNames(styles.staticLabel, props.labelClassName)}>{props.label}</FieldLabel>:null}
        {props.labelType === 'underlined'? <FieldLabel className={classNames(styles.staticLabel, styles.underlinedLabel, props.labelClassName)}>{props.label}</FieldLabel>:null}
        <input
          {...field}
          value = {props.value||field.value}
          ref={props.format === 'phone' ? phoneRef as any : null}
          type={props.type ?? 'text'}
          disabled={props.disabled}
          autoComplete={props.autocompleteOff?'off':''}
          onInput= {onInput}
          onFocus={() => {
            setFocused(true)
          }}
          minLength={props.minLength}
          maxLength={props.maxLength}
          onBlur={() => {
            setFocused(false)
            !props.validateOnSubmit&&helpers.setTouched(true)
          }}
          onClick={onClickHandler}
          onKeyUp={onKeyUp}
          className={classNames({
            [styles.input]: true,
            [styles.error]: showError,
            [styles.success]: props.success,
            [styles.withIcon]: props.iconName,
            [styles.hover]: hover,
            [styles.press]: press,
            [styles.white]: props.color === 'white',
            [styles.purple]: props.color === 'purple',
            [styles.darkPurple]: props.color === 'darkPurple',
          },
            props.inputClassName
          )}
          placeholder={props.placeholder}
          {...(props.format === 'phone'?{value: value}: '') }
          {...(props.onChange&&{onChange: props.onChange}) }
        />
        {props.success && <img src="/images/icons/field_success.svg" alt="" className={styles.successIcon} />}
        {props.suffix && getSuffix()}
      </div>
      <FieldError className={styles.fieldError} showError={showError}>{props.error||meta.error}</FieldError>
    </div>
  )
}

