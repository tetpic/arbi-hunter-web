import BackTextButton from '@/components/ui/BackTextButton'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import Title from '@/components/ui/TitleForSection'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import PreviewItem from '@/components/ui/PreviewItem'
import {  TranslateLanguageKnowLevel,  TranslateWorkExperience } from 'utils/enumsTranslations'
import P from '@/components/ui/P'
import SalaryItem from '@/components/ui/SalaryItem'
import UserPic from '@/components/ui/UserPic'
import { getUserImageSource } from 'utils/helpers'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import UserSvg from '@/components/svg/UserSvg'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'
import HtmlText from '@/components/ui/HtmlText'
import TagList from '@/components/ui/TagList'
import MailAltSvg from '@/components/svg/MailAltSvg'
import languages from '@cospired/i18n-iso-languages'
import ru from '@cospired/i18n-iso-languages/langs/ru.json'
import { CompensationType } from 'types/enums'
import EmploymentBoard from '@/components/ui/EmploymentBoard'


interface Props {
  id?: number
}



export default function VacancyPreview(props: Props) {
  const router = useRouter()
  const vacancyContext = useVacancyContext()
  const currentVacancy = vacancyContext.currentVacancy
  const userContext = useUserContext()
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false)


  useEffect(()=>{
    if(!vacancyContext.currentVacancy) {
      vacancyContext.setCurrentVacancy(props.id)
    }
    languages.registerLocale(ru)
    setIsLocaleLoaded(true)

  }, [vacancyContext])

  const header = (
    <div className={styles.header}>
      <UserPic size={67} image={getUserImageSource(userContext.currentProfile)}/>
      <div className={styles.headerInfo}>
        <P styleType={['w600', 'large']}>{currentVacancy.company}</P>
        <P styleType={['medium','w500', 'greyLight']}>{currentVacancy.city.locName}</P>
      </div>
    </div>
  )

  const editElement = (progress: number) => {
    if(currentVacancy.completedSteps && currentVacancy.completedSteps.length < progress) {
      router.push(`/create/vacancy?id=${currentVacancy.id}&progress=${currentVacancy.completedSteps.length}`)
    }
    else {
      router.push(`/create/vacancy?id=${currentVacancy.id}&progress=${progress}`)
    }
  }

  return (
  <div className={styles.root}> 
    <BackTextButton onClick={router.back} className={styles.backButton}/>
    <Title title={'Предпросмотр вакансии'}/>

    <div className={styles.itemsWrapper}>

      <PreviewItem disableLink titleElement={header}/>
      <div className={styles.previewList}>
        <PreviewItem title={currentVacancy.name} onClick={()=>editElement(1)}/>
        <PreviewItem 
        onClick={()=>editElement(5)}
        titleElement={
          <P styleType={['medium', 'greyLight', 'w500']}>Опыт работы  {TranslateWorkExperience(currentVacancy.experience)}  лет</P>
        }/>
        {(currentVacancy.compensation === CompensationType.Salary|| currentVacancy.salaryMin || currentVacancy.salaryMax) &&
          <PreviewItem 
          onClick={()=>editElement(3)}
          titleElement={
            <SalaryItem vacancy={currentVacancy}/>
          }/>
        }
      </div>

      <PreviewItem title='Контактная информация' wrapperClassName={styles.item} onClick={()=>editElement(8)}>
        <P styleType={['medium', 'w500', 'alignCenter']}>
          <Button styleType={['icon', 'black']} ><UserSvg/></Button> {currentVacancy.contactName}
        </P>
        <P styleType={['medium', 'w500', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailAltSvg/></Button>  {currentVacancy.email}
        </P>
        <P styleType={['medium', 'w500', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><PhoneSvg/> </Button> {currentVacancy.phone}
        </P>
        <P styleType={['medium', 'w500', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><TelegramSvg/></Button> {currentVacancy.telegramNickname}
        </P>
      </PreviewItem>

      <PreviewItem title='Занятость' onClick={()=>editElement(4)}>
        <EmploymentBoard cv={currentVacancy}/>
      </PreviewItem>

      {currentVacancy.description &&
      <PreviewItem title='Обязанности' onClick={()=>editElement(7)}>
        <HtmlText text={currentVacancy.description}/>
      </PreviewItem>
      }

      {currentVacancy.skills && currentVacancy.skills.length > 0 &&
        <PreviewItem title='Навыки' onClick={()=>editElement(6)}>
          <TagList tags={currentVacancy.skills.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {currentVacancy.sources && currentVacancy.sources.length > 0 &&
        <PreviewItem title='Источники' onClick={()=>editElement(5)}>
          <TagList tags={currentVacancy.sources.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }      

      {currentVacancy.geos && currentVacancy.geos.length > 0 &&
        <PreviewItem title='Гео' onClick={()=>editElement(5)}>
          <TagList tags={currentVacancy.geos.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {currentVacancy.verticals && currentVacancy.verticals.length > 0 &&
        <PreviewItem title='Вертикали'onClick={()=>editElement(5)}>
          <TagList tags={currentVacancy.verticals.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {currentVacancy.languageKnowledges && currentVacancy.languageKnowledges.length > 0 && isLocaleLoaded &&
        <PreviewItem title='Владение языками' onClick={()=>editElement(6)}>
          <TagList tagClassName={styles.langTag} tags={currentVacancy.languageKnowledges.map(el=>({name: languages.getName(el.language, 'ru') + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </PreviewItem>
      }
    </div>

    <Button styleType={['gradient']} onClick={router.back} title={'back'} className={styles.button}>Назад</Button>


  </div>
  )
}