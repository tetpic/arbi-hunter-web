import styles from './index.module.scss'

import { useEffect } from 'react'
import { useCvContext } from 'context/cv_state'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import languages from '@cospired/i18n-iso-languages'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import DotSvg from 'components/svg/DotSvg'
import { colors } from 'styles/variables'
import { useAppContext } from 'context/state'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import { useRouter } from 'next/navigation'
import { useVacancyContext } from 'context/vacancy_state'
import BackTextButton from '@/components/ui/BackTextButton'
import { Answer, Genders, ModalType, VacancyLookType } from 'types/enums'
import P from '@/components/ui/P'
import Button from '@/components/ui/Button'
import CloseEyeSvg from '@/components/svg/CloseEyeSvg'
import SalaryItem from '@/components/ui/SalaryItem'
import TagList from '@/components/ui/TagList'
import { TranslateEducationType, TranslateEmploymentType, TranslateLanguageKnowLevel, TranslateScheduleType } from 'utils/enumsTranslations'
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


interface Props {
  cvId: string
}

export default function CvPage(props: Props) {
  
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
      debugger
      router.push(`/messenger?chat=${res?.id}`)
    })
  }

  const openContacts = () => {
    CvRepository.openContacts(currentCv.id)
    .then(res=> {
      cvContext.saveCv(currentCv.id)
      cvContext.getCv(Number(props.cvId))
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
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
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
          currentCv.gender === Genders.Female&&'Женщина'||currentCv.gender === Genders.Male&&'Мужчина',
          currentCv?.age && `${currentCv?.age} ${Formatter.pluralize(currentCv?.age, 'год', 'года', 'лет', )}`,
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
        {currentCv.vacancyLookType === VacancyLookType.NotLooking?'Не ищет работу': 'Активно ищет работу'}
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
          Открыть профиль
        </Button>
        ||
        <Button
        className={styles.topButton}
        styleType={['gradient']}
        title={'inviteTop'}
        onClick={makeResponse}
        >
          Пригласить
        </Button>
      }
      {(currentCv?.proposalsByCurrentUser?.length>0 || currentCv?.applicationsToCurrentUser?.length > 0) &&
        <Button 
        styleType={['borderGradient']} 
        className={styles.chatButton}
        onClick={goToChat}
        >
          Чат
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
          <P styleType={['f20', 'w600']}>
            {currentCv.categories[0].name}
          </P>
          <P 
          styleType={['blue', 'alignCenter', 'medium', 'w500']} 
          onClick={()=>router.push('/create/cv?id='+currentCv.id)} 
          className={styles.edit}
          >
            <PencilSvg color={colors.blue}/> Редактировать
          </P>
        </div>
        <SalaryItem cv={currentCv} />
        <Statistics 
        className={styles.stats}
        items={[
          {name: 'Показы', count: currentCv.totalShows},
          {name: 'Просмотры', count: currentCv.totalViews},
          {name: 'Отклики', count: currentCv.totalApplications},
        ]} 
        title={'Cтатистика за неделю'}/>
        <div className={styles.topLine}>
          <P styleType={['w500', 'medium', 'greyLight']}>
            Поднять вручную можно сегодня в 20:30
          </P>
          <P styleType={['w500', 'medium', 'blue']}>
            Поднять автоматически
          </P>
        </div>
        <div className={styles.topLine}>
          <Button styleType={['gradient']}>
            Улучшить резюме
          </Button>
          <Button styleType={['borderGradient']}>
            123 подходящих вакансий
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
          <P styleType={['large', 'w600']}>Контактная информация</P>
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
        </div>
      }

      {!isMyCv &&
      <>
        <P 
        styleType={['f20', 'w600']} 
        className={styles.speciality}
        >
          {currentCv.categories[0].name}
        </P>
        <SalaryItem cv={currentCv} className={styles.salary}/>
      </>
      }

      <div className={styles.employment}>
        <TagList tagClassName={styles.tag} tags={[
          {name: TranslateScheduleType(currentCv.schedule)},
          {name: TranslateEmploymentType(currentCv.employment)+ ' занятость'}
        ]}/>
      </div>

      {currentCv.sources?.length > 0 &&
      <div className={styles.item}> 
        <P styleType={['large', 'w600']}>Источники</P>
        <TagList tagClassName={styles.tag} tags={currentCv.sources.map(el=> {
          return {name: el.title}
        })}/>
      </div>
      }

      {currentCv.verticals?.length > 0 &&
       <div className={styles.item}>
        <P styleType={['large', 'w600']}>Вертикали</P>
        <TagList tagClassName={styles.tag} tags={currentCv.verticals.map(el=> {
          return {name: el.title}
        })}/>
       </div>
      }

      {currentCv.geos?.length > 0 && 
       <div className={styles.item}>
        <P styleType={['large', 'w600']}>Гео</P>
        <TagList tagClassName={styles.tag} tags={currentCv.geos.map(el=> {
          return {name: el.title}
        })}/>
       </div>
      }

      <div className={styles.item}>
        <P styleType={['large', 'w600']}>Опыт работы</P>
        {currentCv.experienceInfo.length > 0 &&
          <div className={styles.cards}>
            {currentCv.experienceInfo.map(el=> {
              return  <div className={styles.card}>
                <P styleType={['medium', 'w500']}>{el.position}</P>
                <P styleType={['medium', 'w500']}>{el.company}</P>
                <P styleType={['w500', 'medium', 'greyLight']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
                <P styleType={['medium', 'w500']} className={styles.card__bottom}>{el.description}</P>
              </div>
              })
            }
          </div>
          ||
          <P styleType={['w500', 'medium']}>Без опыта</P>
        }
      </div>

      <div className={styles.item}>
        <P styleType={['large', 'w600']}>Образование</P>
        <P styleType={['w500', 'medium']}>{TranslateEducationType(currentCv.education)}</P>
        {currentCv.educationInfo.length > 0 && 
          <div className={styles.cards}>
            { currentCv.educationInfo.map(el=> {
              return <div className={styles.card}>
                  <P styleType={['w500', 'large']}>{el.institution}</P>
                  <P styleType={['w500', 'medium']}>{el.faculity}</P>
                  <P styleType={['w500', 'medium']}>{el.fromDate} - {el.toDate||'по н.в.'}</P>
                </div>
              })
              }
          </div>
        }
      </div>

      {currentCv.bio && currentCv.bio.length > 1 &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>Обо мне</P>
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </div>
      }

      {currentCv.skills?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>Навыки</P>
          <TagList tagClassName={styles.tag} tags={currentCv.skills.map(el=> {
            return {name: el.title}
          })}/>
        </div>
        
      }

      {currentCv.languageKnowledges?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>Владения языками</P>
          <TagList 
          tagClassName={styles.tag} 
          tags={currentCv.languageKnowledges.map(el=>({name: languages.getName(el.language, 'ru') + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} 
          />
        </div>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets.length > 0)) &&
        <div className={styles.item}>
          <P styleType={['large', 'w600']}>Портфолио</P>
          <P styleType={['w500', 'medium']}>{currentCv.portfolio}</P>
          <FilesList previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
        </div>
      }

      <div className={styles.item}>
        {currentCv.relocation &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {currentCv.relocation === Answer.No ? 'Переезд невозможен' : 'Переезд возможен'}
          </P>
        }
        {currentCv.businessTrips &&
          <P styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {currentCv.businessTrips === Answer.Yes ? 'Командировки возможны' : 'Командировки невозможны'}
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
            Открыть профиль
          </Button>
        }
        {currentCv.isContactsOpen &&
          <Button styleType={['gradient']} title={'invite'}>Пригласить</Button>
        }
        {(currentCv.proposalsByCurrentUser?.length>0 || currentCv.applicationsToCurrentUser?.length > 0) &&
          <Button styleType={['borderGradient']} onClick={goToChat}>Чат</Button>
        }
      </div>

    </div>
  )
}