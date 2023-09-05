import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import OpenEyeSvg from 'components/svg/OpenEyeSvg'
import { useState } from 'react'
import Validator from 'utils/Validator'
import InputField from '../InputField'
import styles from './index.module.scss'

interface Props {
  label?: string
  name?: string
  className?: string
  
}

export default function PasswordField(props: Props) {

  const [passwordIsOpen, setPasswordOpen] = useState<boolean>(false)

  const passwordHandler = () => {
    setPasswordOpen(!passwordIsOpen)
  }

  return (
  <InputField 
  label={props.label||'Пароль:'}
  className={props.className||styles.input} 
  labelType='top' 
  styleType={'default'} 
  color={'default'} 
  name={props.name||'password'} 
  type={passwordIsOpen?'text':'password'}
  suffix={'icon'}
  suffixIcon={passwordIsOpen?<OpenEyeSvg/>: <CloseEyeSvg/>}
  onSuffixClick={passwordHandler}
  validate={Validator.required}
  />

  )
}