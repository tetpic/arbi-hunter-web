import styles from './index.module.scss'

import { useEffect } from 'react'
import { useCvContext } from 'context/cv_state'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import DotSvg from 'components/svg/DotSvg'
import { colors } from 'styles/variables'
import { useAppContext } from 'context/state'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import { useRouter } from 'next/navigation'
import { useVacancyContext } from 'context/vacancy_state'
import BackTextButton from '@/components/ui/BackTextButton'
import { Answer, Genders, ModalType, SnackbarType, VacancyLookType } from 'types/enums'
import P from '@/components/ui/P'
import Button from '@/components/ui/Button'
import CloseEyeSvg from '@/components/svg/CloseEyeSvg'
import SalaryItem from '@/components/ui/SalaryItem'
import TagList from '@/components/ui/TagList'
import { TranslateEducationType, TranslateEmploymentType, TranslateLanguage, TranslateLanguageKnowLevel, TranslateScheduleType, TranslateVacancyLookType } from 'utils/enumsTranslations'
import Spinner from '@/components/ui/Spinner'
import HtmlText from '@/components/ui/HtmlText'
import FilesList from '@/components/ui/FilesList'
import { PreviewImage } from 'data/interfaces/Common'
import GradientDotSvg from '@/components/svg/GradientDotSvg'
import MailAltSvg from '@/components/svg/MailAltSvg'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'
import WhatsAppSvg from '@/components/svg/WhatsAppSvg'
import SkypeSvg from '@/components/svg/SkypeSvg'
import LinkedInSvg from '@/components/svg/LinkedInSvg'
import { useUserContext } from 'context/user_state'
import CvRepository from 'data/repositories/CvRepository'
import ChatRepository from 'data/repositories/ChatRepository'
import FavoritesButton from '@/components/ui/FavoritesButton'
import PencilSvg from '@/components/svg/PencilSvg'
import Statistics from '@/components/ui/Statistics'
import Link from 'next/link'
import ViberLogoSvg from '@/components/svg/ViberLogoSvg'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'


interface Props {
  cvId: string
}

export default function CvPage(props: Props) {
  const {t} = useTranslation()
  const cvContext = useCvContext()
  const userContext = useUserContext()
  const vacancyContext = useVacancyContext()
  const appContext = useAppContext()
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const {currentCv} = cvContext
  const isMyCv = currentCv?.profileId === userContext.currentProfile?.id

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

  const goToChat = () => {
    ChatRepository.getChatByContactId(currentCv.profileId, {proposalId: currentCv.proposalsByCurrentUser?.[0].id})
    .then(res=> {      
      router.push(`/messenger?chat=${res?.id}`)
    })
  }

  const openContacts = () => {
    CvRepository.openContacts(currentCv.id)
    .then(_=> {
      cvContext.saveCv(currentCv.id)
      cvContext.getCv(Number(props.cvId))
    })
    .catch(_ => {
      appContext.showSnackbar(t('cv_page_noOpensAvailable'), SnackbarType.error)
    })
  }

  const saveCvToFavorites = () => {
    if(currentCv.isSavedByCurrentProfile){
      cvContext.removeCvfromSaved(currentCv.id)
      .then(_=> {
        cvContext.getCv(Number(props.cvId))
      })
    }
    else {
      cvContext.saveCv(currentCv.id)
      .then(_=> {
        cvContext.getCv(Number(props.cvId))
      })
    }
  }

  useEffect(()=>{
    cvContext.getCv(Number(props.cvId))
    vacancyContext.setVacancies()
  }, [])

  const profileImage = 
  currentCv?.profile.useOwnLogo 
  && currentCv?.profile?.logo?.source 
  && FILES+currentCv?.profile?.logo?.source
  ||
  !currentCv?.profile.useOwnLogo 
  && currentCv?.profile?.image?.source 
  && FILES+currentCv?.profile?.image?.source


  if(!currentCv) {
    return <div className={styles.root}>
      <Spinner size={24}/>
    </div>
  }

  const userCard = (<>
    <div className={styles.top}>
      <UserPic size={80} image={profileImage}/>
      {currentCv.isContactsOpen &&
        <P 
        styleType={['large', 'w600']} 
        className={styles.userName} 
        >
          {currentCv?.profile?.firstName} {currentCv?.profile?.lastName}
        </P>
      }
    </div>
    {(currentCv?.age || currentCv?.profile?.city?.locName) &&
    <P styleType={['medium', 'w500', 'alignCenter']}>
      { [
          currentCv.gender === Genders.Female&&t('gender_female')||currentCv.gender === Genders.Male&&t('gender_male'),
          currentCv?.age && `${currentCv?.age} ${Formatter.pluralize(currentCv?.age, t('year1'), t('year2'), t('year3'))}`,
          currentCv?.profile?.city?.locName
        ].filter(Boolean).map((el, i, arr)=>{
          return(<>
            <span>{el}</span>
            {i<arr.length-1 && <DotSvg color={colors.white}/>}
          </>
          )
        })
      }
    </P>
    }
    {currentCv?.vacancyLookType &&
      <p className={classNames(styles.status, currentCv.vacancyLookType === VacancyLookType.NotLooking?styles.red: styles.green)}>
        {TranslateVacancyLookType(currentCv.vacancyLookType, ProfileType.Hirer, t)}
      </p>
    }
    <div className={styles.topButtonsWrapper}>
      {!currentCv?.isContactsOpen &&
        <Button 
        className={styles.topButton}
        styleType={['gradient']} 
        title={'openProfileTop'} 
        onClick={openContacts}
        >
          {t('cv_page_openProfile')}
        </Button>
        ||
        <Button
        className={styles.topButton}
        styleType={['gradient']}
        title={'inviteTop'}
        onClick={makeResponse}
        >
          {t('cv_page_invite')}
        </Button>
      }
      {(currentCv?.proposalsByCurrentUser?.length>0 || currentCv?.applicationsToCurrentUser?.length > 0) &&
        <Button 
        styleType={['borderGradient']} 
        className={styles.chatButton}
        onClick={goToChat}
        >
          {t('cv_page_chat')}
        </Button>
      }

      <FavoritesButton className={styles.favoritesButton} onClick={saveCvToFavorites} isActive={currentCv.isSavedByCurrentProfile}/>
      <Button styleType={['icon', 'black']}><CloseEyeSvg/></Button>
    </div>
  </>)


  return (
    <div className={styles.root}>
      <BackTextButton onClick={router.back}/>

      {isMyCv &&
      <div className={styles.userTop}>
        <div className={styles.topLine}>
          <P styleType={['fs20', 'w600']}>
            {currentCv.categories[0].name}
          </P>
          <P 
          styleType={['blue', 'alignCenter', 'medium', 'w500']} 
          onClick={()=>router.push('/create/cv?id='+currentCv.id)} 
          className={styles.edit}
          >
            <PencilSvg color={colors.blue}/> {t('cv_page_edit')}
          </P>
        </div>
        <SalaryItem cv={currentCv} />
        <Statistics 
        className={styles.stats}
        items={[
          {name: t('cv_pagee_shows'), count: currentCv.totalShows},
          {name: t('cv_pagee_views'), count: currentCv.totalViews},
          {name: t('cv_page_applications'), count: currentCv.totalApplications},
        ]} 
        title={t('cv_page_statsTitle')}/>
        <div className={styles.topLine}>
          <P styleType={['w500', 'medium', 'greyLight']}>
            Поднять вручную можно сегодня в 20:30
          </P>
          <P styleType={['w500', 'medium', 'blue']}>
            {t('cv_page_upCvAutomatically')}
          </P>
        </div>
        <div className={styles.topLine}>
          <Button styleType={['gradient']}>
            {t('cv_page_improve')}
          </Button>
          <Button styleType={['borderGradient']} href={{pathname: '/recruiting', query: {filters: JSON.stringify({categories: [currentCv.categories[0].id]})}}}>
            {currentCv.categories[0].vacanciesCount||0} {t('cv_page_appropriateVcs')}
          </Button>
        </div>

      </div>
      }

      {!isMyCv &&
        <div className={styles.userCard}>
          {userCard}
        </div>
      }

      {(currentCv.isContactsOpen||userContext.currentProfile.id === currentCv.profile.id)&&
        <div className={styles.contacts}>
          <P styleType={['large', 'w600']}>{t('cv_page_contacts')}</P>
          {currentCv.profile.email &&
          <Link href={`mailto:${currentCv.email}`}>
            <P styleType={['w500', 'medium', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><MailAltSvg/></Button>
              {currentCv.profile.email}
            </P>
          </Link>
          }
          {currentCv.profile.phone &&
          <Link href={`tel:${currentCv.phone}`}>
            <P styleType={['w500', 'medium', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><PhoneSvg/></Button>
              {Formatter.formatPhone(currentCv.phone||currentCv.profile?.phone)}
            </P>
          </Link>
          }
          {(currentCv.telegramNickname||currentCv.profile.telegramNickname) &&
          <Link href={`tg://resolve?domain=${currentCv.telegramNickname}`}>
            <P styleType={['w500', 'medium', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><TelegramSvg/></Button>
              {currentCv.telegramNickname||currentCv.profile.telegramNickname}
            </P>
          </Link>
          }
          {currentCv.whatsapp &&
          <Link href={`https://wa.me/${currentCv.whatsapp}`} target='_blank'>
            <P styleType={['w500', 'medium', 'alignCenter']}>
              <Button styleType={['icon', 'black']}><WhatsAppSvg/></Button>
              {currentCv.whatsapp}
            </P>
          </Link>
          }
          {currentCv.skype &&
          <Link href={`skype:${currentCv.skype}?chat`}>
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <Button styleType={['icon', 'black']}><SkypeSvg/></Button>
            {currentCv.skype}
          </P>
          </Link>
          }
          {currentCv.linkedin &&
          <Link href={currentCv.linkedin}>
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <Button styleType={['icon', 'black']}><LinkedInSvg/></Button>
            {currentCv.linkedin}
          </P>
          </Link>
          }
          {currentCv.viber &&
            <Link href={'viber://chat?number=+'+currentCv.viber}>
              <P styleType={['w500', 'medium', 'alignCenter']}>
                <Button styleType={['icon', 'black']}><ViberLogoSvg/></Button>
                {currentCv.viber}
              </P>
            </Link>
          }
        </div>
      }

      {!isMyCv &&
      <>
        <P 
        styleType={['fs20', 'w600']} 
        className={styles.speciality}
        >
          {currentCv.categories[0].name}
        </P>
        <SalaryItem cv={currentCv} className={styles.salary}/>
      </>
      }

      <div className={styles.employment}>
        <TagList tagClassName={styles.tag} tags={[
          {name: TranslateScheduleType(currentCv.schedule, t)},
          {name: TranslateEmploymentType(currentCv.employment, t, true)}
        ]}/>
      </div>

      {currentCv.sources?.length > 0 &&
      <div className={styles.item}> 
        <P styleType={['large', 'w600']}>{t('cv_page_sources')}</P>
        <TagList tagClassName={styles.tag} tags={currentCv.sources.map(el=> {
          return {name: el.title}
        })}/>
      </div>
      }

      {currentCv.verticals?.length > 0 &&
       <div className={styles.item}>
        <P styleType={['large', 'w600']}>{t('cv_page_verticals')}</P>
        <TagList tagClassName={styles.tag} tags={currentCv.verticals.map(el=> {
          return {name: el.title}
        })}/>
       </div>
      }

      {currentCv.geos?.length > 0 && 
       <div className={styles.item}>
        <P styleType={['large', 'w600']}>{t('cv_page_geos')}</P>
        <TagList tagClassName={styles.tag} tags={currentCv.geos.map(el=> {
          return {name: el.title}
        })}/>
       </div>
      }

      <div className={styles.item}>
        <P styleType={['large', 'w600']}>{t('cv_page_experience')}</P>
        {currentCv.experienceInfo.length > 0 &&
          <div className={styles.cards}>
            {currentCv.experienceInfo.map(el=> {
              return  <div className={styles.card}>
                <P styleType={['medium', 'w500']}>{el.position}</P>
                <P styleType={['large', 'w500']}>{el.company}</P>
                {el.description &&
                  <P styleType={['medium', 'w500']}>{el.description}</P>
                }
                <P styleType={['w500', 'medium', 'greyLight']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
              </div>
              })
            }
          </div>
          ||
          <P styleType={['w500', 'medium']}>{t('cv_page_noExperience')}</P>
        }
      </div>

      <div className={styles.item}>
        <P styleType={['large', 'w600']}>{t('cv_page_education')}</P>
        <P styleType={['w500', 'medium']} >{TranslateEducationType(currentCv.education, t)}</P>
        {currentCv.educationInfo.length > 0 && 
          <div className={styles.cards}>
            { currentCv.educationInfo.map(el=> {
              return <div className={styles.card}>
                  <P styleType={['w500', 'large']}>{el.institution}</P>
                  <P styleType={['w500', 'medium']}>{el.speciality}</P>
                  {el.faculty &&
                    <P styleType={['w500', 'medium']}>{el.faculty}</P>
                  }
                  <P styleType={['w500', 'medium', 'greyLight']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
                </div>
              })
              }
          </div>
        }
      </div>

      {currentCv.bio && currentCv.bio.length > 1 &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>{t('cv_page_about')}</P>
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </div>
      }

      {currentCv.skills?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>{t('cv_page_skills')}</P>
          <TagList tagClassName={styles.tag} tags={currentCv.skills.map(el=> {
            return {name: el.title}
          })}/>
        </div>
        
      }

      {currentCv.languageKnowledges?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>{t('cv_page_languageKnowledges')}</P>
          <TagList 
          tagClassName={styles.tag} 
          tags={currentCv.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} 
          />
        </div>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets.length > 0)) &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>{t('cv_page_portfolio')}</P>
          {currentCv.portfolio &&
            <P styleType={['w500', 'medium']}>{currentCv.portfolio}</P>
          }
          <FilesList disabledRemoving previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
        </div>
      }

      <div className={styles.item}>
        {currentCv.relocation &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {currentCv.relocation === Answer.No ? t('cv_page_noRelocation') : t('cv_page_relocation')}
          </P>
        }
        {currentCv.businessTrips &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {currentCv.businessTrips === Answer.Yes ? t('cv_page_businesstrips') : t('cv_page_noBusinesstrips')}
          </P>
        }
      </div>

      <div className={styles.buttonsWrapper}>
        {!currentCv.isContactsOpen &&
          <Button 
          styleType={['gradient']} 
          title={'openProfileBottom'}         
          onClick={openContacts}
          >
            {t('cv_page_openProfile')}
          </Button>
        }
        {currentCv.isContactsOpen &&
          <Button 
          styleType={['gradient']} 
          onClick={makeResponse} 
          title={'invite'}
          >
            {t('cv_page_invite')}
          </Button>
        }
        {(currentCv.proposalsByCurrentUser?.length>0 || currentCv.applicationsToCurrentUser?.length > 0) &&
          <Button styleType={['borderGradient']} onClick={goToChat}>{t('cv_page_chat')}</Button>
        }
      </div>

    </div>
  )
}