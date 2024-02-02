import { useFormikContext } from 'formik'
import styles from './index.module.scss'
import { ICVCreate } from 'data/interfaces/ICV'
import InputField from '@/components/fields/InputField'
import TagsRadioList from '../../../utils/TagsRadioList'
import { Genders } from 'types/enums'
import { TranslateGenderType } from 'utils/enumsTranslations'
import PhoneCountryField from '@/components/fields/PhoneCountryField'
import TextAreaField from '@/components/fields/TextAreaField'
import SectionSubtitle from '../../../utils/SectionSubtitle'
import { useState } from 'react'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import classNames from 'classnames'
import DateField from '@/components/fields/DateField'
import Image from 'next/image'
import { useUserContext } from 'context/user_state'

interface Props {
}

export default function CvAbout(props: Props) {
  const {values, setFieldValue} = useFormikContext<ICVCreate>()
  const userContext = useUserContext()

  const [isActive, setIsActive] = useState<boolean>(true)

  return (<div className={styles.root}> 
  <SectionSubtitle text='Основная информация:'/>
  <div className={styles.inputsWrapper}>
    <InputField styleType={'default'} disabled={Boolean(userContext.currentProfile.firstName)} color={'default'} name={'firstName'} label='Имя' labelType='top'/>
    <InputField styleType={'default'} disabled={Boolean(userContext.currentProfile.lastName)} color={'default'} name={'lastName'} label='Фамилия' labelType='top'/>
    <InputField styleType={'default'} disabled={Boolean(userContext.currentProfile.patronymic)} color={'default'} name={'patronymic'} label='Отчество' labelType='top'/>
  </div>

  <TagsRadioList<string> 
  name='gender' 
  label={'Пол'}
  options={[
    {label: TranslateGenderType(Genders.Male), value: Genders.Male},
    {label: TranslateGenderType(Genders.Female), value: Genders.Female},
  ]}/>

  <div className={styles.inputsWrapper}>
    <DateField 
    styleType={'default'} 
    name={'birthday'} 
    dateFormat='dd/MM/yyyy'
    formatOptions={{
      formatMatcher: 'best fit', year: 'numeric', month: '2-digit', day: '2-digit'
    }}
    visibleYearSelector 
    label='Дата рождения'
    className={styles.dateField}
    inputClassName={styles.dateInput}
    />
    <PhoneCountryField 
    styleType={'horizontal'} 
    disabled={false} 
    placeholder={''} 
    name={'phone'}
    label='Телефон'
    />
    <InputField styleType={'default'} color={'default'} name={'email'} label='Электронная почта'  labelType='top'/>
    <InputField styleType={'default'} color={'default'} name={'telegramNickname'} label='Telegram'  labelType='top'/>
  </div>

  <SectionSubtitle 
  onClick={()=>setIsActive(!isActive)} 
  text={<>Добавить другие способы связи <ArrowDownSvg className={isActive&&styles.rotated} /></>}
  />
  <div className={classNames(styles.inputsWrapper, !isActive&&styles.disabled)}>
    <InputField 
    styleType={'default'} 
    color={'default'} 
    name={'whatsapp'} 
    label='WhatsApp' 
    prefix={<Image src={'/icons/whatsappLogo.png'} width={20} height={20} alt='whatsapp'/>}
    labelType='top'/>

    <InputField 
    styleType={'default'} 
    color={'default'} 
    name={'linkedin'} 
    label='LinkedIn' 
    prefix={<Image src={'/icons/LILogo.png'} width={20} height={20} alt='linkedin'/>}
    labelType='top'/>

    <InputField 
    styleType={'default'} 
    color={'default'} 
    name={'viber'} 
    label='Viber' 
    prefix={<Image src={'/icons/viberLogo.png'} width={20} height={20} alt='viber'/>}
    labelType='top'/>

    <InputField 
    styleType={'default'} 
    color={'default'} 
    name={'skype'} 
    label='Skype' 
    prefix={<Image src={'/icons/skypeLogo.png'} width={20} height={20} alt='skype'/>}
    labelType='top'/>
  </div>

  <SectionSubtitle text='Добавить текст о себе'/>
  <TextAreaField areaClassname={styles.textArea} name={'bio'} autoSize placeholder='Опишите ваш опыт подробнее' onChange={(el)=>setFieldValue('bio', el.target.value)}/>
  </div>)
}