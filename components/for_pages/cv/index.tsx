import styles from './index.module.scss'

import { useEffect } from 'react'
import { useCvContext } from 'context/cv_state'
import classNames from 'classnames'
import BriefCaseSvg from 'components/svg/BriefCaseSvg'
import TimeLineSvg from 'components/svg/TimeLineSvg'
import TimerSvg from 'components/svg/TimerSvg'
import Formatter from 'utils/formatter'
import languages from '@cospired/i18n-iso-languages'
import { TranslateEducationType, TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import Spinner from 'components/ui/Spinner'
import TagList from '../../ui/TagList'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import DotSvg from 'components/svg/DotSvg'
import { EmploymentType, ModalType, ScheduleType, VacancyLookType } from 'types/enums'
import { colors } from 'styles/variables'
import Link from 'next/link'
import InfoList from 'components/ui/InfoList'
import Badges from 'components/ui/Badges'
import Content from 'components/ui/Content'
import ContentBody from 'components/ui/Content/ContentBody'
import ContentAside from 'components/ui/Content/ContentAside'
import CvVcPageTop from 'components/ui/CvVcPageTop'
import CvVcAbout from 'components/ui/CvVcAbout'
import ContentAsideItem from 'components/ui/Content/ContentItem'
import { useAppContext } from 'context/state'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import Button from 'components/ui/Button'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import ShareSvg from 'components/svg/ShareSvg'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import { useRouter } from 'next/navigation'
import Buildings from '../profile/Personal/Buildings'
import Spacer from 'components/ui/Spacer'
import { usePersonalContext } from 'context/personal_state'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'
import { useVacancyContext } from 'context/vacancy_state'


interface Props {
  cvId: string
}

export default function CvPage(props: Props) {
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const {currentCv} = cvContext

  const makeResponse = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IProposalModalProps>(ModalType.ProposalModal,  { cv: currentCv,
        page: ProposalModalPager.OtherVacancy,
        activeVacancies: [...vacancyContext.activeVacancies.values()]
      })
      return
    }
    appContext.showModal<IProposalModalProps>(ModalType.ProposalModal,  { cv: currentCv, 
      page: ProposalModalPager.OtherVacancy,
      activeVacancies: [...vacancyContext.activeVacancies.values()]
    })
  }

  useEffect(()=>{
    cvContext.getCv(Number(props.cvId))
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    vacancyContext.setActiveVacancies()
  }, [])

  useEffect(()=>{
    if(currentCv?.id === Number(props.cvId) && !personalContext.backgrounds) {
      personalContext.setBackgrounds(currentCv.profile)
    }
  }, [cvContext.currentCv])

  if(personalContext.loading) return <Spinner size={24}/>

  const profileImage = 
  currentCv?.profile.useOwnLogo && currentCv?.profile?.logo?.source && FILES+currentCv?.profile?.logo?.source
  ||
  !currentCv?.profile.useOwnLogo && currentCv?.profile?.image?.source && FILES+currentCv?.profile?.image?.source

  const userCard = (<>
    <UserPic size={100} image={profileImage}/>
    <p className={styles.userName}>{currentCv?.profile?.firstName} {currentCv?.profile?.lastName}</p>
    {(currentCv?.age || currentCv?.profile?.city?.locName) &&
    <p className={styles.otherData}>
      <span>{currentCv?.age} {Formatter.pluralize(currentCv?.age, 'год', 'года', 'лет', )}</span> 
      {currentCv?.profile?.city?.locName &&
      <>
      <DotSvg/> 
      <span>г. {currentCv?.profile?.city?.locName}</span> 
      </>
      }
    </p>
    }
    {currentCv?.vacancyLookType &&
      <p className={classNames(styles.status, currentCv.vacancyLookType === VacancyLookType.NotLooking?styles.red: styles.green)}>
        <DotSvg color={currentCv.vacancyLookType === VacancyLookType.NotLooking?colors.red: colors.green}/>
        {currentCv.vacancyLookType === VacancyLookType.NotLooking?'Не ищет работу': 'В активном поиске'}
      </p>
    }
    <Link href={'/personal/'+ currentCv?.profileId} className={styles.openProfile}>Открыть профиль</Link>
  </>)


  return (
    <>
    {isTabletWidth &&
      <div className={styles.buttonsWrapper}>
        <Button onClick={() => router.back()} className={styles.button}><ArrowLeftSvg/></Button>
        <Button className={styles.button}><CloseEyeSvg/></Button>
        <Button className={styles.button}><ShareSvg/></Button>
        <Button className={styles.button}><BookmarkEmptySvg/></Button>
      </div>
    }
    {isTabletWidth &&
      <div className={styles.userCard} >
        {userCard}
      </div>
    }
    {!isTabletWidth && personalContext.backgrounds.size > 0 && 
    <>
      <Spacer basis={48}/>
      <Buildings profile={currentCv?.profile} background={personalContext.backgrounds.get(BackgroundCategoryType.Places)}/>
    </>
    }
    <Content className={styles.root}>
      <ContentBody className={styles.body}>
          <CvVcPageTop 
          city={currentCv?.city?.locName} 
          title={currentCv?.categories[0]?.name} 
          buttonText={'Пригласить'}
          cv={currentCv}
          onButtonClick={makeResponse}
          />   

        <Badges items={[
          {
            title: 'Место работы',
            value: 'Удаленно',
            icon: <TimeLineSvg/>
          },
          {title: 'График работы', 
          value:  (
            currentCv.schedule === ScheduleType.FullDay && 'Полный день'
            || 
            currentCv.schedule === ScheduleType.Flexible && 'Гибкий'              
            || 
            currentCv.schedule === ScheduleType.Remote && 'Удаленная работа'
          ), 
          icon: <BriefCaseSvg/>},
          {
            title: 'Занятость', 
            value:  (
              currentCv.employment === EmploymentType.FullTime && 'Полная'
              || 
              currentCv.employment === EmploymentType.PartTime && 'Частичная'              
              || 
              currentCv.employment === EmploymentType.Project && 'Проектная'
            ), 
            icon: <TimerSvg/>
          },        
        ]}/>

        <CvVcAbout titleClassName={styles.title} title={'О себе'} text={currentCv?.bio}/>

        <CvVcAbout titleClassName={styles.title} title='Образование' text={TranslateEducationType(currentCv.education)}/>

        {currentCv.experienceInfo?.length > 0 &&
          <InfoList 
          title={`Опыт работы ${Formatter.fullTimeLine(currentCv.experienceInfo.map(el=> [el.fromDate, el.toDate]))}`} 
          titleClassName={styles.title}
          info={currentCv.experienceInfo.map(el=> {
            return {
              fromDate: el.fromDate,
              toDate: el.toDate,
              name: el.company,
              description: el.description
            }
          })}/>    
        }

        {currentCv.educationInfo?.length > 0 &&
          <InfoList 
          title={'Курсы'} 
          titleClassName={styles.title} 
          info={currentCv.educationInfo.map(el=>{
            return {
              fromDate: el.fromDate,
              toDate: el.toDate,
              name: el.institution,
              description: el.speciality
            }
          })}/>        
        }

        {currentCv.skills.length > 0 &&
          <TagList title={'Навыки'} tags={currentCv.skills.map(el=>({name:el.title}))} titleClassName={styles.title}/>
        }
        {currentCv.languageKnowledges.length > 0 &&
          <TagList title={'Языки'} tags={currentCv.languageKnowledges.map(el=>({name: languages.getName(el.language, 'ru') + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} titleClassName={styles.title}/>
        }
        {currentCv.geos.length > 0 &&
          <TagList title={'Гео'} tags={currentCv.geos.map(el=>({name: el.title}))} titleClassName={styles.title}/>
        }
        {currentCv.sources.length > 0 &&
          <TagList title={'Источники'} tags={currentCv.sources.map(el=>({name:el.title}))} titleClassName={styles.title}/>
        }
        {currentCv.portfolio &&
          <CvVcAbout titleClassName={styles.title} title={'Портфолио'} link={currentCv.portfolio} />
        }
      </ContentBody>
      <ContentAside  hide={isTabletWidth}>
        <ContentAsideItem className={styles.userCard}>
          {userCard}
        </ContentAsideItem>
      </ContentAside>
    </Content>
    {isTabletWidth && 
      <div className={styles.responseWrapper}>
        <Button onClick={makeResponse} className={styles.responseButton}>Пригласить</Button>
      </div>
    }
    </>
  )
}