import styles from './index.module.scss'
import { useCvContext } from 'context/cv_state'
import { useEffect, useState } from 'react'
import BackTextButton from '@/components/ui/BackTextButton'
import { useRouter } from 'next/router'
import Title from '@/components/ui/TitleForSection'
import PreviewItem from '@/components/ui/PreviewItem'
import UserPic from '@/components/ui/UserPic'
import { useUserContext } from 'context/user_state'
import { getAge, getUserImageSource } from 'utils/helpers'
import P from '@/components/ui/P'
import classNames from 'classnames'
import { Answer, SnackbarType, VacancyLookType } from 'types/enums'
import Formatter from 'utils/formatter'
import SalaryItem from '@/components/ui/SalaryItem'
import Button from '@/components/ui/Button'
import { TranslateCompensationType, TranslateEducationType, TranslateLanguageKnowLevel, TranslateScheduleType } from 'utils/enumsTranslations'
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
import languages from '@cospired/i18n-iso-languages'
import ru from '@cospired/i18n-iso-languages/langs/ru.json'
import EmploymentBoard from '@/components/ui/EmploymentBoard'
import { useAppContext } from 'context/state'


interface Props {
  id: number
}

export default function CvPreview(props: Props) {
  const cvContext = useCvContext()
  const appContext = useAppContext()
  const currentCv = cvContext.currentCv
  const router = useRouter()
  const userContext = useUserContext()
  const [isLocaleLoaded, setIsLocaleLoaded] = useState(false)

  useEffect(()=>{
    if(!cvContext.currentCv) {
      cvContext.getCv(props.id)
    }
    languages.registerLocale(ru)
    setIsLocaleLoaded(true)
  }, [cvContext])

  const personalHead = (
    <div className={styles.head}>
      <UserPic image={getUserImageSource(userContext.currentProfile)} size={80}/>
      <P styleType={['w600', 'large']}>{[userContext.currentProfile.firstName, userContext.currentProfile.lastName].join(' ')}</P>
    </div>
  )

  const editElement = (progress: number) => {
    if(currentCv.completedSteps && currentCv.completedSteps.length < progress) {
      router.push(`/create/cv?id=${currentCv.id}&progress=${currentCv.completedSteps.length}`)
    }
    else {
      router.push(`/create/cv?id=${currentCv.id}&progress=${progress}`)
    }
  }

  const onPublish = () => {
    cvContext.updateCv(currentCv.id, {published: true}, ()=>{
      appContext.showSnackbar('Резюме опубликовано', SnackbarType.success)
      router.push('/profile?page=cvs')
    })
  }

  return (<div className={styles.root}> 
    <BackTextButton onClick={router.back} className={styles.backButton}/>
    <Title title={'Предпросмотр резюме'}/>
    <div className={styles.itemsWrapper}>
      <PreviewItem 
      titleElement={personalHead} 
      wrapperClassName={styles.item}
      onClick={() => editElement(1)}
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
            getAge(currentCv.age), 
            currentCv.city?.locName].filter(Boolean).join(' · ')
          }
        </P>
        <P styleType={['w600', 'large']}>{currentCv.categories[0].name}</P>
        <SalaryItem cv={currentCv}/>

      </PreviewItem>

      <PreviewItem title='Занятость' onClick={()=>editElement(4)}>
        <EmploymentBoard cv={currentCv}/>
      </PreviewItem>

      <PreviewItem title='Контактная информация' wrapperClassName={styles.item} onClick={() => editElement(2)}>
        {currentCv.profile.email &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailAltSvg/></Button>
          {currentCv.profile.email}
        </P>
        }
        {currentCv.profile.phone &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><PhoneSvg/></Button>
          {currentCv.profile.phone}
        </P>
        }
        {(currentCv.telegramNickname||currentCv.profile.telegramNickname) &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><TelegramSvg/></Button>
          {currentCv.telegramNickname||currentCv.profile.telegramNickname}
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
      </PreviewItem>

      <PreviewItem 
      title={' '} 
      wrapperClassName={styles.item}
      onClick={() => editElement(6)}
      >
        {currentCv.relocation &&
          <P styleType={['w500', 'medium', 'alignCenter']}><GradientDotSvg/> {currentCv.relocation === Answer.No ? 'Переезд невозможен' : 'Переезд возможен'}</P>
        }
        {currentCv.schedule &&
          <P styleType={['w500', 'medium', 'alignCenter']}><GradientDotSvg/> {TranslateScheduleType(currentCv.schedule)}</P>
        }
        {currentCv.compensation &&
          <P  styleType={['w500', 'medium', 'alignCenter']}><GradientDotSvg/> {TranslateCompensationType(currentCv.compensation)}</P>
        }
        {currentCv.businessTrips &&
          <P  styleType={['w500', 'medium', 'alignCenter']}><GradientDotSvg/> {currentCv.businessTrips === Answer.Yes ? 'Командировки возможны' : 'Командировки невозможны'}</P>
        }

      </PreviewItem>

      {currentCv.bio &&
        <PreviewItem 
        title={'О себе'} 
        onClick={() => editElement(2)}
        >
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </PreviewItem>
      }

        <PreviewItem 
        title={`Опыт работы ${Formatter.fullTimeLine(currentCv.experienceInfo.map(el=> [el.fromDate, el.toDate]))}` }
        onClick={() => editElement(3)}
        >
          {currentCv.experienceInfo.length > 0 && 
            currentCv.experienceInfo.map(el=> {
              return <div className={styles.experience}>
                <P styleType={['w500', 'medium']}>{el.position}</P>
                <P styleType={['w500', 'medium']}>{el.company}</P>
                <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
              </div>
            })
            ||
            <P styleType={['w500', 'medium']}>Без опыта</P>
          }
        </PreviewItem>

        <PreviewItem 
        title={'Образование'}
        onClick={() => editElement(4)}
        > 
          <P styleType={['w500', 'medium']}>{TranslateEducationType(currentCv.education)}</P>
          { currentCv.educationInfo.length > 0 && 
            currentCv.educationInfo.map(el=> {
              return <div className={styles.experience}>
                <P styleType={['w500', 'medium']}>{el.institution}</P>
                <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
              </div>
            })
          }
        </PreviewItem>

      {currentCv.skills && currentCv.skills.length > 0 &&
        <PreviewItem 
        title='Навыки'
        onClick={() => editElement(5)}
        >
          <TagList tags={currentCv.skills.map(el => ({name: el.title}))} />
        </PreviewItem>
      }

      {currentCv.sources && currentCv.sources.length > 0 &&
        <PreviewItem title='Источники' onClick={()=>editElement(5)}>
          <TagList tags={currentCv.sources.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }      

      {currentCv.geos && currentCv.geos.length > 0 &&
        <PreviewItem title='Гео' onClick={()=>editElement(5)}>
          <TagList tags={currentCv.geos.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {currentCv.verticals && currentCv.verticals.length > 0 &&
        <PreviewItem title='Вертикали'onClick={()=>editElement(5)}>
          <TagList tags={currentCv.verticals.map(el => ({name: el.title}))}/>
        </PreviewItem>
      }


      {currentCv.languageKnowledges && currentCv.languageKnowledges.length > 0 && isLocaleLoaded &&
        <PreviewItem 
        title='Владение языками'
        onClick={() => editElement(5)}
        >
          <TagList tags={currentCv.languageKnowledges.map(el=>({name: languages.getName(el.language, 'ru') + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </PreviewItem>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets.length > 0)) &&
        <PreviewItem 
        title='Портфолио'
        onClick={() => editElement(5)}
        >
          <P styleType={['w500', 'medium']}>{currentCv.portfolio}</P>
          <FilesList previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
        </PreviewItem>
      }
    </div>

    <div className={styles.buttonsWrapper}>
      <Button styleType={['gradient']} title={'back'} onClick={router.back} className={styles.button}>Назад</Button>
      {currentCv.completedSteps && currentCv.completedSteps.length > 6 &&
        <Button styleType={['black']} title={'next'} onClick={onPublish}  className={styles.button}>Опубликовать</Button>
      }

    </div>



  </div>)
}