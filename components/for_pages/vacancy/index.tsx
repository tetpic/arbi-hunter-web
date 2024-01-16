import styles from './index.module.scss'

import Content from 'components/ui/Content'
import ContentBody from 'components/ui/Content/ContentBody'
import ContentAside from 'components/ui/Content/ContentAside'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import Buildings from '../profile/Personal/Buildings'
import Spacer from 'components/ui/Spacer'
import CvVcPageTop from 'components/ui/CvVcPageTop'
import Badges from 'components/ui/Badges'
import BriefCaseSvg from 'components/svg/BriefCaseSvg'
import TimeLineSvg from 'components/svg/TimeLineSvg'
import TimerSvg from 'components/svg/TimerSvg'
import { EmploymentType, ModalType } from 'types/enums'
import { TranslateLanguageKnowLevel, TranslateWorkExperience } from 'utils/enumsTranslations'
import CvVcAbout from 'components/ui/CvVcAbout'
import TagList from 'components/ui/TagList'
import languages from '@cospired/i18n-iso-languages'
import Title from 'components/ui/TitleForSection'
import VacancyItem from 'components/ui/VacancyItem'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import ContentItem from 'components/ui/Content/ContentItem'
import { useAppContext } from 'context/state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'
import { useCvContext } from 'context/cv_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import Formatter from 'utils/formatter'
import Link from 'next/link'
import { useUserContext } from 'context/user_state'
import { ProfileType } from 'data/interfaces/IRegistration'
import Button from 'components/ui/Button'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import ShareSvg from 'components/svg/ShareSvg'
import BookmarkEmptySvg from 'components/svg/BookmarkEmptySvg'
import ArrowLeftSvg from 'components/svg/ArrowLeftSvg'
import { useRouter } from 'next/navigation'
import { usePersonalContext } from 'context/personal_state'
import { BackgroundCategoryType } from 'data/interfaces/IBackground'


interface Props {
  id?: number
}

export default function VacancyPage(props: Props) {
  const vacancyContext = useVacancyContext()
  const cvContext = useCvContext()
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const {isTabletWidth} = appContext.size
  const userContext = useUserContext()
  const [otherCompanyVacncies, setOtherCompanyVacancies] = useState<IVacancy[]>([])
  const {currentVacancy, foundVacancies} = vacancyContext
  const router = useRouter()


  const makeResponse = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IApplicationModalProps>(ModalType.ApplicationModal, {vacancyId: currentVacancy.id, cvs: cvContext.savedCvs})
      return
    }
    appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, {vacancyId: currentVacancy.id, cvs: cvContext.savedCvs})
  }

  useEffect(()=>{
    if(currentVacancy && !currentVacancy?.profile) {
      router.back()
      return
    }
    if(currentVacancy && currentVacancy.categories.length > 0) {
      vacancyContext.findVacancies({categories: currentVacancy.categories.map(e=>e.id)})
      VacancyRepository.searchVacancies({s: JSON.stringify({profileId: currentVacancy.profile?.id})})
      .then(res=> {
        const randomItems = Formatter.randomElementsFromArray<IVacancy>(res.data, 2)
        setOtherCompanyVacancies(randomItems)
      })
    }
  }, [currentVacancy])

  useEffect(()=>{
    cvContext.setSavedCvs()
    vacancyContext.setCurrentVacancy(props.id)  
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
  }, [])
  
  useEffect(()=>{
    if(currentVacancy?.id === props.id && !personalContext.personalPage) {
      personalContext.setPersonalPage({profile: currentVacancy.profile})
      .then(r=> {
        personalContext.setBackgrounds(r)
      })
    }
  }, [currentVacancy])


  if(personalContext.loading) return <Spinner size={24}/>

  return (<>
    {currentVacancy.profile.image && !isTabletWidth && personalContext.backgrounds?.size > 0 && personalContext.backgrounds.get(BackgroundCategoryType.Places) &&
      <>
        <Spacer basis={48} hide={isTabletWidth}/>
          <Buildings profile={currentVacancy.profile} background={personalContext.backgrounds.get(BackgroundCategoryType.Places)}/>
      </>
    }

    {isTabletWidth &&
      <div className={styles.buttonsWrapper}>
        <Button onClick={() => router.back()} className={styles.button}><ArrowLeftSvg/></Button>
        <Button className={styles.button}><CloseEyeSvg/></Button>
        <Button className={styles.button}><ShareSvg/></Button>
        <Button className={styles.button}><BookmarkEmptySvg/></Button>
      </div>
    }
    <Content className={styles.root}>
      <ContentBody>
        <ContentItem className={styles.bodyItem}>
          <CvVcPageTop 
          hideButtons={isTabletWidth}
          title={currentVacancy.name} 
          vc={currentVacancy} 
          buttonText={'Откликнуться'}
          onButtonClick={makeResponse}
          />
          <Badges 
          items={[
            {
              title: 'Опыт работы',
              value: TranslateWorkExperience(currentVacancy.experience),
              icon: <BriefCaseSvg/>,
            },
            {
              title: 'Занятость',
              value: (
                currentVacancy.employment === EmploymentType.FullTime &&'Полная'
                || 
                currentVacancy.employment === EmploymentType.PartTime && 'Частичная'
                || 
                currentVacancy.employment === EmploymentType.Project && 'Проектная'
              )
              ,
              icon: <TimeLineSvg/>
            },  
            {
              title: 'График работы',
              value: 'Полный день',
              icon: <TimerSvg/>,
            },
          ]}
          />
          {isTabletWidth && 
            <Link href={'/personal/' + currentVacancy.profileId} className={styles.companyCard}>
              <UserPic size={100} className={styles.userPic} image={currentVacancy?.profile?.image?.source&& FILES+currentVacancy.profile.image.source}/>
              <p className={styles.name}>{currentVacancy.company|| currentVacancy.contactName }</p>
            </Link>
          }
          <CvVcAbout titleClassName={styles.title} title={'Описание вакансии'} text={currentVacancy.description}/>
          {currentVacancy.skills.length > 0 &&
            <TagList title={'Навыки'} tags={currentVacancy.skills.map(el=>({name: el.title}))} titleClassName={styles.title}/>
          }
          {currentVacancy.languageKnowledges.length > 0 &&
            <TagList title={'Языки'} tags={currentVacancy.languageKnowledges.map(el=>({name: languages.getName(el.language, 'ru') + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} titleClassName={styles.title}/>
          }
          {currentVacancy.geos.length > 0 &&
            <TagList title={'Гео'} tags={currentVacancy.geos.map(el=>({name:el.title}))} titleClassName={styles.title}/>
          }
          {currentVacancy.sources.length > 0 &&
            <TagList title={'Источники'} tags={currentVacancy.sources.map(el=>({name:el.title}))} titleClassName={styles.title}/>
          }
        </ContentItem>
        {userContext?.currentProfile?.profileType === ProfileType.Employee && foundVacancies.size > 0 &&
        <>
          <Title className={styles.sectionTitle} title={'Вам подойдут эти вакансии'}/>
          <ContentItem>
            {
              [...foundVacancies.values()].slice(0, 2).map(vacancy=> <VacancyItem key={vacancy.id} vacancy={vacancy}/>)
            }
          </ContentItem>        
        </>
        }
     
      </ContentBody>

      <ContentAside hide={isTabletWidth}>
        <ContentItem className={styles.aside}>
          <UserPic size={100} image={currentVacancy?.profile?.logo?.source&& FILES+currentVacancy.profile.logo.source}/>
          <p className={styles.name}>{currentVacancy.company|| currentVacancy.contactName }</p>
          <Link href={'/personal/' + currentVacancy.profileId} className={styles.button}>Открыть профиль</Link>
        </ContentItem>

        {userContext?.currentProfile?.profileType === ProfileType.Employee &&
          <>
            <p className={styles.otherVacancies}>Другие вакансии компании</p>
              {otherCompanyVacncies.length > 0 &&
                otherCompanyVacncies.map(vacancy=> 
                <ContentItem className={styles.asideVacancies}>
                      <VacancyItem key={vacancy.id} vacancy={vacancy} smallCard/>
                </ContentItem>
                )}
            <Link href='/' className={styles.buttonGray}>Смотреть все</Link>
          </>
        }
      </ContentAside>
    </Content>

    {isTabletWidth && 
      <div className={styles.responseWrapper}>
        <Button onClick={makeResponse} className={styles.responseButton}>Откликнуться</Button>
      </div>
    }
  </>)
}