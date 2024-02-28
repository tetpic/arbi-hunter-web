import { useCvContext } from 'context/cv_state'
import styles from './index.module.scss'
import { useEffect } from 'react'
import BackTextButton from '@/components/ui/BackTextButton'
import { useRouter } from 'next/router'
import Title from '@/components/ui/TitleForSection'
import PreviewItem from '@/components/ui/PreviewItem'
import UserPic from '@/components/ui/UserPic'
import { useUserContext } from 'context/user_state'
import { getUserImageSource } from 'utils/helpers'
import P from '@/components/ui/P'
import classNames from 'classnames'
import { Answer, VacancyLookType } from 'types/enums'
import Formatter from 'utils/formatter'
import SalaryItem from '@/components/ui/SalaryItem'
import MailConvertSvg from '@/components/svg/MailConvertSvg'
import Button from '@/components/ui/Button'
import { TranslateCompensationType, TranslateEducationType, TranslateScheduleType } from 'utils/enumsTranslations'
import GradientDotSvg from '@/components/svg/GradientDotSvg'
import HtmlText from '@/components/ui/HtmlText'
import TagList from '@/components/ui/TagList'
import FilesList from '@/components/ui/FilesList'
import { PreviewImage } from 'data/interfaces/Common'

interface Props {
  id: number
}

export default function CvPreview(props: Props) {
  const cvContext = useCvContext()
  const currentCv = cvContext.currentCv
  const router = useRouter()
  const userContext = useUserContext()

  useEffect(()=>{
    if(!cvContext.currentCv) {
      cvContext.getCv(props.id)
    }
  }, [cvContext])

  const personalHead = (
    <div className={styles.head}>
      <UserPic image={getUserImageSource(userContext.currentProfile)} size={80}/>
      <P styleType={['w600', 'large']}>{[userContext.currentProfile.firstName, userContext.currentProfile.lastName].join(' ')}</P>
    </div>
  )

  return (<div className={styles.root}> 
    <BackTextButton onClick={router.back} className={styles.backButton}/>
    <Title title={'Предпросмотр резюме'}/>
    <div className={styles.itemsWrapper}>

      <PreviewItem titleElement={personalHead} wrapperClassName={styles.item}>
        <P 
        styleType={['small', currentCv.vacancyLookType === VacancyLookType.NotLooking?'red':'green']} 
        className={classNames(styles.status, currentCv.vacancyLookType === VacancyLookType.NotLooking?styles.status_red: styles.status_green)}
        >
          {currentCv.vacancyLookType === VacancyLookType.NotLooking?'Не ищет работу': 'В активном поиске'}
        </P>
        <P 
        styleType={['greyLight', 'w500', 'medium']}>
          {[
            currentCv.gender === 'male'&&'Мужчина'||currentCv.gender === 'female' &&'Женщина', 
            currentCv.age + ' ' + Formatter.pluralize(currentCv.age, 'год', 'года', 'лет'), 
            currentCv.city.locName].join(' · ')
          }
        </P>
        <P styleType={['w600', 'large']}>{currentCv.categories[0].name}</P>
        <SalaryItem cv={currentCv}/>

      </PreviewItem>

      <PreviewItem title='Контактная информация' >
        {currentCv.profile.email &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.profile.email}
        </P>
        }
        {currentCv.profile.phone &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.profile.phone}
        </P>
        }
        {currentCv.profile.telegramNickname &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.profile.telegramNickname}
        </P>
        }
        {currentCv.whatsapp &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.whatsapp}
        </P>
        }
        {currentCv.skype &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.skype}
        </P>
        }
        {currentCv.linkedin &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.linkedin}
        </P>
        }
        {currentCv.skype &&
        <P styleType={['w500', 'medium', 'alignCenter']}>
          <Button styleType={['icon', 'black']}><MailConvertSvg/></Button>
          {currentCv.skype}
        </P>
        }
      </PreviewItem>

      <PreviewItem title={' '} wrapperClassName={styles.item}>
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
          <P  styleType={['w500', 'medium', 'alignCenter']}><GradientDotSvg/> {currentCv.businessTrips === Answer.Yes ? 'Командировки возможны' : 'Командировки не возможны'}</P>
        }

      </PreviewItem>

      {currentCv.bio &&
        <PreviewItem title={'О себе'}>
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </PreviewItem>
      }

      {currentCv.experienceInfo && currentCv.experienceInfo.length > 0 &&
        <PreviewItem title={`Опыт работы ${Formatter.fullTimeLine(currentCv.experienceInfo.map(el=> [el.fromDate, el.toDate]))}` }>
          {currentCv.experienceInfo.map(el=> {
            return <div className={styles.experience}>
              <P styleType={['w500', 'medium']}>{el.position}</P>
              <P styleType={['w500', 'medium']}>{el.company}</P>
              <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
            </div>
         })}
        </PreviewItem>
      }

      {currentCv.educationInfo && currentCv.educationInfo.length > 0 &&
        <PreviewItem title={'Образование'}> 
          <P styleType={['w500', 'medium']}>{TranslateEducationType(currentCv.education)}</P>
          {currentCv.educationInfo.map(el=> {
            return <div className={styles.experience}>
              <P styleType={['w500', 'medium']}>{el.institution}</P>
              <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
            </div>
          })}
        </PreviewItem>
      }

      {currentCv.skills && currentCv.skills.length > 0 &&
        <PreviewItem title='Навыки'>
          <TagList tags={currentCv.skills.map(el => ({name: el.title}))} />
        </PreviewItem>
      }

      {currentCv.languageKnowledges && currentCv.languageKnowledges.length > 0 &&
        <PreviewItem title='Владение языками'>
          <TagList tags={currentCv.languageKnowledges.map(el => ({name: [el.language, el.level].join(' ')}))} />
        </PreviewItem>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets.length > 0)) &&
        <PreviewItem title='Портфолио'>
          <P styleType={['w500', 'medium']}>{currentCv.portfolio}</P>
          {currentCv.assets && currentCv.assets.map(el => {
            return <FilesList previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
          })}
        </PreviewItem>
      }
    </div>

    <Button styleType={['gradient']} onClick={router.back} className={styles.button}>Назад</Button>


  </div>)
}