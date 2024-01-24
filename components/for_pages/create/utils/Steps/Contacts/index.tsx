import CheckboxListField from '@/components/fields/CheckboxListField'
import styles from './index.module.scss'
import InputField from '@/components/fields/InputField'
import { ContactType } from 'data/interfaces/IVacancy'
import PhoneCountryField from '@/components/fields/PhoneCountryField'

interface Props {
}

export default function Contacts(props: Props) {

  return (<div className={styles.root}> 
    <p className={styles.title}>Показывать в вакансии:</p>
    <CheckboxListField options={[
      {label: 'Контактное лицо', value: ContactType.Name},
      {label: 'Email', value: ContactType.Email},
      {label: 'Telegram', value: ContactType.Telegram},
      {label: 'Телефон', value: ContactType.Phone},
    ]} name={'contactsToShow'}/>

    <p className={styles.title}>Контакты:</p>
    <div className={styles.inputsWrapper}>
      <InputField 
      styleType={'default'} 
      // placeholder='Контактное лицо'  
      label='Контактное лицо'
      labelType='top'
      color={'default'} name={'contacts.name'}
      />

      <InputField 
      styleType={'default'} 
      // placeholder='Email' 
      color={'default'} 
      name={'contacts.email'}
      labelType='top'
      label='Электронная почта'
      />

      <InputField 
      styleType={'default'} 
      // placeholder='Telegram' 
      color={'default'} 
      name={'contacts.telegram'} 
      labelType='top'
      label='Telegram'
      />

      <PhoneCountryField 
      styleType={'horizontal'} 
      disabled={false} 
      placeholder={'Телефон'} 
      name={'contacts.phone'}
      label='Телефон'
      />
    </div>
    
  </div>)
}