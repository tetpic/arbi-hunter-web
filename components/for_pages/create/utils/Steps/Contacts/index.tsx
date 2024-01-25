import CheckboxListField from '@/components/fields/CheckboxListField'
import styles from './index.module.scss'
import InputField from '@/components/fields/InputField'
import { ContactType } from 'data/interfaces/IVacancy'
import PhoneCountryField from '@/components/fields/PhoneCountryField'
import SectionSubtitle from '../../SectionSubtitle'

interface Props {
}

export default function Contacts(props: Props) {

  return (<div className={styles.root}> 
    <SectionSubtitle text={'Показывать в вакансии:'} className={styles.title}/>
    <CheckboxListField options={[
      {label: 'Контактное лицо', value: ContactType.Name},
      {label: 'Email', value: ContactType.Email},
      {label: 'Telegram', value: ContactType.Telegram},
      {label: 'Телефон', value: ContactType.Phone},
    ]} name={'contactsToShow'}/>

    <SectionSubtitle text={'Контакты:'} className={styles.title}/>
    <div className={styles.inputsWrapper}>
      <InputField 
      styleType={'default'} 
      label='Контактное лицо'
      labelType='top'
      color={'default'} name={'contacts.name'}
      />

      <InputField 
      styleType={'default'} 
      color={'default'} 
      name={'contacts.email'}
      labelType='top'
      label='Электронная почта'
      />

      <InputField 
      styleType={'default'} 
      color={'default'} 
      name={'contacts.telegram'} 
      labelType='top'
      label='Telegram'
      />

      <PhoneCountryField 
      styleType={'horizontal'} 
      disabled={true} 
      placeholder={'Телефон'} 
      name={'contacts.phone'}
      label='Телефон'
      />
    </div>
    
  </div>)
}