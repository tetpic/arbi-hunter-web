import BackTextButton from '@/components/ui/BackTextButton'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import PreviewItem from '@/components/ui/PreviewItem'
import {  TranslateLanguage, TranslateLanguageKnowLevel,  TranslateWorkExperience } from 'utils/enumsTranslations'
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
import EmploymentBoard from '@/components/ui/EmploymentBoard'
import { IVacancy } from 'data/interfaces/IVacancy'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import Formatter from 'utils/formatter'
import { useAppContext } from 'context/state'
import { SnackbarType } from 'types/enums'
import { useVacancyContext } from 'context/vacancy_state'
import { useRouter } from 'next/router'


interface Props {
  id?: number
  vacancy?: IVacancy
  onBack?: (page?: number)=> void
}



export default function VacancyPreview(props: Props) {
  const creationContext = useCreateVcCvContext()
  const vacancyContext = useVacancyContext()
  const currentVacancy = props.vacancy
  const userContext = useUserContext()
  const appContext = useAppContext()
  const router = useRouter()

  const onPublish = () => {
    vacancyContext.editVacancy({...currentVacancy, published: true}, currentVacancy.id).then(()=>{
      appContext.showSnackbar('Вакансия опубликована', SnackbarType.success)
      router.replace('/profile?page=vacancies') 
    })
  }

  const header = (
    <div className={styles.header}>
      <UserPic size={67} image={getUserImageSource(userContext.currentProfile)}/>
      <div className={styles.headerInfo}>
        <P styleType={['w600', 'large']}>{currentVacancy.company}</P>
        <P styleType={['medium','w500', 'greyLight']}>{currentVacancy.city?.locName}</P>
      </div>
    </div>
  )

  return (
  <div className={styles.root}> 
    <BackTextButton onClick={()=>props.onBack()} className={styles.backButton}/>
    <Title title={'Предпросмотр вакансии'}/>

    <div className={styles.itemsWrapper}>

      <PreviewItem disableLink titleElement={header}/>
      <div className={styles.previewList}>
        <PreviewItem title={currentVacancy.name} onClick={()=>props.onBack(1)}/>
        <PreviewItem 
        onClick={()=>props.onBack(5)}
        titleElement={
          <P styleType={['medium', 'greyLight', 'w500']}>Опыт работы  {TranslateWorkExperience(currentVacancy.experience)}</P>
        }/>
        <PreviewItem 
        onClick={()=>props.onBack(2)}
        titleElement={
          <SalaryItem vacancy={currentVacancy}/>
        }/>
      </div>

      {(currentVacancy.showContactName||currentVacancy.showEmail||currentVacancy.showPhone||currentVacancy.showTelegramNickname)&&
        <PreviewItem title='Контактная информация' wrapperClassName={styles.item} onClick={()=>props.onBack(7)}>
          {currentVacancy.showContactName &&
            <P styleType={['medium', 'w500', 'alignCenter']} >
              <Button styleType={['icon', 'black']} ><UserSvg/></Button> {currentVacancy.contactName}
            </P>
          }
          {currentVacancy.showEmail &&
            <P styleType={['medium', 'w500', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><MailAltSvg/></Button>  {currentVacancy.email}
            </P>
          }
          {currentVacancy.showPhone &&
            <P styleType={['medium', 'w500', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><PhoneSvg/> </Button> {Formatter.formatPhone(currentVacancy.phone)}
            </P>
          }
          {currentVacancy.showTelegramNickname &&
            <P styleType={['medium', 'w500', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><TelegramSvg/></Button> {currentVacancy.telegramNickname}
            </P>
          }
        </PreviewItem>
      }

      <PreviewItem title='Занятость' onClick={()=>props.onBack(3)}>
        <EmploymentBoard vacancy={currentVacancy}/>
      </PreviewItem>

      {currentVacancy.description && currentVacancy.description !== '<p></p>' &&
      <PreviewItem title='Описание' onClick={()=>props.onBack(6)}>
        <HtmlText text={currentVacancy.description}/>
      </PreviewItem>
      }

      {creationContext.helpObjects.skills && creationContext.helpObjects.skills.size > 0 &&
        <PreviewItem title='Навыки' onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects.skills.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {creationContext.helpObjects.activeSources && creationContext.helpObjects.activeSources.size > 0 &&
        <PreviewItem title='Источники' onClick={()=>props.onBack(4)}>
          <TagList tags={[...creationContext.helpObjects.activeSources.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }      

      {creationContext.helpObjects.activeGeos && creationContext.helpObjects.activeGeos.size > 0 &&
        <PreviewItem title='Гео' onClick={()=>props.onBack(4)}>
          <TagList tags={[...creationContext.helpObjects.activeGeos.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {creationContext.helpObjects.activeVerticals && creationContext.helpObjects.activeVerticals.size > 0 &&
        <PreviewItem title='Вертикали'onClick={()=>props.onBack(4)}>
          <TagList tags={[...creationContext.helpObjects.activeVerticals.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {currentVacancy.languageKnowledges && currentVacancy.languageKnowledges.length > 0 && 
        <PreviewItem title='Владение языками' onClick={()=>props.onBack(5)}>
          <TagList tagClassName={styles.langTag} tags={currentVacancy.languageKnowledges.map(el=>({name: TranslateLanguage(el.language) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </PreviewItem>
      }
    </div>
    <Button styleType={['gradient']} onClick={()=>props.onBack()} title={'back'} className={styles.button}>Назад</Button>
    {currentVacancy.completedSteps && currentVacancy.completedSteps.length > 6 &&
        <Button styleType={['black']} title={'next'} onClick={onPublish}  className={styles.button}>Опубликовать</Button>
    }

  </div>
  )
}