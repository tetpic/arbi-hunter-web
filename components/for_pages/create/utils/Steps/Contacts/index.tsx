import styles from './index.module.scss'
import InputField from '@/components/fields/InputField'
import PhoneCountryField from '@/components/fields/PhoneCountryField'
import SectionSubtitle from '../../SectionSubtitle'
import CheckboxField from '@/components/fields/CheckboxField'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

export default function Contacts(props: Props) {
  const {t} = useTranslation()

  return (<div className={styles.root}> 
    <SectionSubtitle text={t('create_showInVacancy')} className={styles.title}/>

    <div className={styles.checkboxWrapper}>
      <CheckboxField name={'showContactName'} label={t('create_contactPerson')} value={true}/>
      <CheckboxField name={'showEmail'} label='Email' value={true} />
      <CheckboxField name={'showTelegramNickname'} label='Telegram' value={true} />
      <CheckboxField name={'showPhone'} label={t('phone')} value={true} />
    </div>    

    <SectionSubtitle text={t('create_contacts')} className={styles.title}/>
    <div className={styles.inputsWrapper}>
      <InputField 
      styleType={'default'} 
      label={t('create_contactPerson')}
      labelType='top'
      color={'default'} 
      name={'contactName'}
      />

      <InputField 
      styleType={'default'} 
      color={'default'} 
      name={'email'}
      labelType='top'
      label={t('email')}
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
      placeholder={t('phone')} 
      name={'phone'}
      label={t('phone')}
      />
    </div>
    
  </div>)
}