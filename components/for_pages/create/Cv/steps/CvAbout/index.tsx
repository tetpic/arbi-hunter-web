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

interface Props {
}

export default function CvAbout(props: Props) {
  const {values} = useFormikContext<ICVCreate>()

  const [isActive, setIsActive] = useState<boolean>(true)

  return (<div className={styles.root}> 
  <SectionSubtitle text='Основная информация:'/>
  <div className={styles.inputsWrapper}>
    <InputField styleType={'default'} disabled={values.firstName.length>0} color={'default'} name={'firstName'} label='Имя' labelType='top'/>
    <InputField styleType={'default'} disabled={values.lastName.length>0} color={'default'} name={'lastName'} label='Фамилия' labelType='top'/>
    <InputField styleType={'default'} disabled={values.patronymic.length>0} color={'default'} name={'patronymic'} label='Отчество' labelType='top'/>
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
    <InputField styleType={'default'} color={'default'} name={'whatsapp'} label='WhatsApp' labelType='top'/>
    <InputField styleType={'default'} color={'default'} name={'linkedin'} label='LinkedIn' labelType='top'/>
    <InputField styleType={'default'} color={'default'} name={'viber'} label='Viber' labelType='top'/>
    <InputField styleType={'default'} color={'default'} name={'skype'} label='Skype' labelType='top'/>
  </div>

  <SectionSubtitle text='Добавить текст о себе'/>
  <TextAreaField areaClassname={styles.textArea} name={'bio'} autoSize placeholder='Опишите ваш опыт подробнее'/>
  </div>)
}