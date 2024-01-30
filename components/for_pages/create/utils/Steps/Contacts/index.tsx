import styles from './index.module.scss'
import InputField from '@/components/fields/InputField'
import PhoneCountryField from '@/components/fields/PhoneCountryField'
import SectionSubtitle from '../../SectionSubtitle'
import CheckboxField from '@/components/fields/CheckboxField'

interface Props {
}

export default function Contacts(props: Props) {

  return (<div className={styles.root}> 
    <SectionSubtitle text={'Показывать в вакансии:'} className={styles.title}/>

    <div className={styles.checkboxWrapper}>
      <CheckboxField name={'showContactName'} label='Контактное лицо'/>
      <CheckboxField name={'showEmail'} label='Email'/>
      <CheckboxField name={'showTelegramNickname'} label='Telegram'/>
      <CheckboxField name={'showPhone'} label='Телефон'/>
    </div>    

    <SectionSubtitle text={'Контакты:'} className={styles.title}/>
    <div className={styles.inputsWrapper}>
      <InputField 
      styleType={'default'} 
      label='Контактное лицо'
      labelType='top'
      color={'default'} name={'contactName'}
      />

      <InputField 
      styleType={'default'} 
      color={'default'} 
      name={'email'}
      labelType='top'
      label='Электронная почта'
      />

      <InputField 
      styleType={'default'} 
      color={'default'} 
      name={'telegramNickname'} 
      labelType='top'
      label='Telegram'
      />

      <PhoneCountryField 
      styleType={'horizontal'} 
      disabled={true} 
      placeholder={'Телефон'} 
      name={'phone'}
      label='Телефон'
      />
    </div>
    
  </div>)
}