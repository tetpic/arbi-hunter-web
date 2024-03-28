import styles from './index.module.scss'
import BackTextButton from '@/components/ui/BackTextButton'
import Title from '@/components/ui/TitleForSection'
import PreviewItem from '@/components/ui/PreviewItem'
import UserPic from '@/components/ui/UserPic'
import { useUserContext } from 'context/user_state'
import { getAge, getUserImageSource, getUserName } from 'utils/helpers'
import P from '@/components/ui/P'
import classNames from 'classnames'
import { Answer, VacancyLookType } from 'types/enums'
import Formatter from 'utils/formatter'
import SalaryItem from '@/components/ui/SalaryItem'
import Button from '@/components/ui/Button'
import { TranslateCompensationType, TranslateEducationType, TranslateEmploymentType, TranslateLanguage, TranslateLanguageKnowLevel, TranslateScheduleType } from 'utils/enumsTranslations'
import GradientDotSvg from '@/components/svg/GradientDotSvg'
import HtmlText from '@/components/ui/HtmlText'
import TagList from '@/components/ui/TagList'
import FilesList from '@/components/ui/FilesList'
import { PreviewImage } from 'data/interfaces/Common'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'
import LinkedInSvg from '@/components/svg/LinkedInSvg'
import SkypeSvg from '@/components/svg/SkypeSvg'
import WhatsAppSvg from '@/components/svg/WhatsAppSvg'
import MailAltSvg from '@/components/svg/MailAltSvg'
import { ICV } from 'data/interfaces/ICV'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import ViberLogoSvg from '@/components/svg/ViberLogoSvg'
import useTranslation from 'next-translate/useTranslation'


interface Props {
  id?: number
  cv?: ICV,
  onBack?: (page?: number)=> void
  onPublish?: () => void
}

export default function CvPreview(props: Props) {
  const {t} = useTranslation()
  const creationContext = useCreateVcCvContext()
  const userContext = useUserContext()
  const currentCv = props.cv

  const personalHead = (
    <div className={styles.head}>
      <UserPic image={getUserImageSource(userContext.currentProfile)} size={80}/>
      <P styleType={['w600', 'large']}>{getUserName(userContext.currentProfile)}</P>
    </div>
  )

  // const onPublish = () => {
  //   cvContext.updateCv(currentCv.id, {published: true}, ()=>{
  //     appContext.showSnackbar('Резюме опубликовано', SnackbarType.success)
  //     router.push('/profile?page=cvs')
  //   })
  // }

  if(!currentCv) return null

  return (<div className={styles.root}> 
    <BackTextButton onClick={()=>props.onBack()} className={styles.backButton}/>
    <Title title={'Предпросмотр резюме'}/>
    <div className={styles.itemsWrapper}>
      <PreviewItem 
      titleElement={personalHead} 
      wrapperClassName={styles.item}
      onClick={() => props.onBack(1)}
      >
        <P 
        styleType={['small', currentCv.vacancyLookType === VacancyLookType.NotLooking?'red':'green']} 
        className={classNames(styles.status, currentCv.vacancyLookType === VacancyLookType.NotLooking?styles.status_red: styles.status_green)}
        >
          {currentCv.vacancyLookType === VacancyLookType.NotLooking?'Не ищет работу': 'В активном поиске'}
        </P>
        <P 
        styleType={['greyLight', 'w500', 'medium']}>
          {[
            currentCv.gender === 'male'&&'Мужчина'||currentCv.gender === 'female' &&'Женщина'||null, 
            currentCv.birthday&&getAge(currentCv.age?currentCv.age: Number(Formatter.formatDistanceToNow(currentCv.birthday, {strict: true}))), 
            currentCv.city?.locName].filter(Boolean).join(' · ')
          }
        </P>
        <P styleType={['w600', 'large']}>{creationContext.activeSubCategory[0].name}</P>
        <SalaryItem cv={currentCv}/>

      </PreviewItem>



      <PreviewItem title='Контактная информация' wrapperClassName={styles.item} onClick={() => props.onBack(2)}>
        {(currentCv.profile?.email||currentCv.email) &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailAltSvg/></Button>
          {currentCv.email||currentCv.profile?.email}
        </P>
        }
        {(currentCv.phone||currentCv.profile?.phone) &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><PhoneSvg/></Button>
          {Formatter.formatPhone(currentCv.phone||currentCv.profile?.phone)}
        </P>
        }
        {(currentCv?.telegramNickname||currentCv.profile?.telegramNickname) &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><TelegramSvg/></Button>
          {currentCv.telegramNickname||currentCv.profile?.telegramNickname}
        </P>
        }
        {currentCv.whatsapp &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><WhatsAppSvg/></Button>
          {currentCv.whatsapp}
        </P>
        }
        {currentCv.skype &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><SkypeSvg/></Button>
          {currentCv.skype}
        </P>
        }
        {currentCv.linkedin &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><LinkedInSvg/></Button>
          {currentCv.linkedin}
        </P>
        }
        {currentCv.viber &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><ViberLogoSvg/></Button>
          {currentCv.viber}
        </P>
        }
      </PreviewItem>

      <PreviewItem 
      title={'Занятость'} 
      wrapperClassName={styles.item}
      onClick={() => props.onBack(6)}
      >
        {currentCv.employment &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {TranslateEmploymentType(currentCv.employment)} занятость
          </P>
        }
        {currentCv.relocation &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> 
            {currentCv.relocation === Answer.No ? 'Переезд невозможен' : 'Переезд возможен'}
          </P>
        }
        {currentCv.schedule &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {TranslateScheduleType(currentCv.schedule, t)}
          </P>
        }
        {currentCv.compensation &&
          <P styleType={['w500', 'medium', 'alignCenter']}> 
            <GradientDotSvg/> {TranslateCompensationType(currentCv.compensation)}
          </P>
        }
        {currentCv.businessTrips &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> 
            {currentCv.businessTrips === Answer.Yes ? 'Командировки возможны' : 'Командировки невозможны'}
          </P>
        }
      </PreviewItem>

      {currentCv.bio &&
        <PreviewItem 
        title={'О себе'} 
        onClick={() => props.onBack(2)}
        >
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </PreviewItem>
      }

        <PreviewItem 
        title={`Опыт работы ${Formatter.fullTimeLine(currentCv.experienceInfo.map(el=> [el.fromDate, el.toDate]))}` }
        onClick={() => props.onBack(3)}
        >
          {currentCv.experienceInfo.length > 0 && 
            currentCv.experienceInfo.map(el=> {
              return <div className={styles.experience}>
                <P styleType={['w500', 'medium']}>{el.position}</P>
                <P styleType={['w500', 'medium']}>{el.company}</P>
                {el.description &&
                  <P styleType={['w500', 'medium']}>{el.description}</P>
                }
                <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
              </div>
            })
            ||
            <P styleType={['w500', 'medium']}>Без опыта</P>
          }
        </PreviewItem>

        <PreviewItem 
        title={'Образование'}
        onClick={() => props.onBack(4)}
        > 
          <P styleType={['w500', 'medium']} className={styles.educationGrade}>{TranslateEducationType(currentCv.education)}</P>
          { currentCv.educationInfo.length > 0 && 
            currentCv.educationInfo.map(el=> {
              return <div className={styles.experience}>
                <P styleType={['w500', 'medium']}>{el.institution}</P>
                {el.speciality &&
                <P styleType={['w500', 'medium']}>{el.speciality}</P>
                }
                {el.faculty &&
                <P styleType={['w500', 'medium']}>{el.faculty}</P>
                }
                <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
              </div>
            })
          }
        </PreviewItem>

      {creationContext.helpObjects.skills && creationContext.helpObjects.skills.size > 0 &&
        <PreviewItem 
        title='Навыки'
        onClick={() => props.onBack(5)}
        >
          <TagList tags={[...creationContext.helpObjects.skills.values()].map(el => ({name: el.title}))} />
        </PreviewItem>
      }

      {creationContext.helpObjects.activeSources && creationContext.helpObjects.activeSources.size > 0 &&
        <PreviewItem title='Источники' onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects.activeSources.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }      

      {creationContext.helpObjects.activeGeos && creationContext.helpObjects.activeGeos.size > 0 &&
        <PreviewItem title='Гео' onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects.activeGeos.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {creationContext.helpObjects.activeVerticals && creationContext.helpObjects.activeVerticals.size > 0 &&
        <PreviewItem title='Вертикали'onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects.activeVerticals.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }


      {currentCv.languageKnowledges && currentCv.languageKnowledges.length > 0 && 
        <PreviewItem 
        title='Владение языками'
        onClick={() => props.onBack(5)}
        >
          <TagList tags={currentCv.languageKnowledges.map(el=>({name: TranslateLanguage(el.language) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </PreviewItem>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets.length > 0)) &&
        <PreviewItem 
        title='Портфолио'
        onClick={() => props.onBack(5)}
        >
          {currentCv.portfolio &&
            <P styleType={['w500', 'medium']}>{currentCv.portfolio}</P>
          }
          {currentCv.assets?.length > 0 &&
            <FilesList previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
          }
        </PreviewItem>
      }
    </div>

    <div className={styles.buttonsWrapper}>
      <Button styleType={['gradient']} title={'back'} onClick={()=>props.onBack()} className={styles.button}>Назад</Button>
      {currentCv.completedSteps && currentCv.completedSteps.length > 6 &&
        <Button styleType={['black']} title={'next'} onClick={()=>props.onBack()}  className={styles.button}>Опубликовать</Button>
      }
    </div>
  </div>)
}