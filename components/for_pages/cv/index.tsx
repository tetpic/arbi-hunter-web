import styles from './index.module.scss'

import { useEffect } from 'react'
import { useCvContext } from 'context/cv_state'
import classNames from 'classnames'
import Formatter from 'utils/formatter'
import UserPic from 'components/ui/UserPic'
import DotSvg from 'components/svg/DotSvg'
import { colors } from 'styles/variables'
import { useAppContext } from 'context/state'
import { IProposalModalProps, ProposalModalPager } from 'components/modals/ProposalModal'
import { useRouter } from 'next/router'
import { useVacancyContext } from 'context/vacancy_state'
import BackTextButton from '@/components/ui/BackTextButton'
import { Answer, AppTheme, Genders, InterfaceLanguage, ModalType, Preset, PurchaseType, SnackbarType } from 'types/enums'
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
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import { clearObject, copyToClipboard, getCategoryName, getUserImageSource } from 'utils/helpers'
import useAbortController from '@/components/hooks/useAbortController'
import { ChooseFolderToSaveArgs } from '@/components/modals/ChooseFolderToSave'
import { useFavoritesFolderContext } from 'context/favorites_folder_state'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import DoubleSvg from '@/components/svg/DoubleSvg'
import EditPencilSvg from '@/components/svg/EditPencilSvg'
import { useFeedbacksContext } from 'context/feedbacks_state'
import { useTariffContext } from 'context/tariff_state'
import PurchaseRepository from 'data/repositories/PurchaseRepository'
import Banner from '@/components/ui/Banner'
import { ImageViewerModalProps } from '@/components/modals/ImageViewerModal'
import ImageHelper from 'utils/ImageHelper'


interface Props {
  cvId: string
}

export default function CvPage(props: Props) {
  const {t, lang} = useTranslation()
  const cvContext = useCvContext()
  const folderContext = useFavoritesFolderContext()
  const userContext = useUserContext()
  const feedBacksContext = useFeedbacksContext()
  const {getNewSignal} = useAbortController()
  const vacancyContext = useVacancyContext()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const router = useRouter()
  const {isTabletWidth} = appContext.size
  const {currentCv} = cvContext
  const isMyCv = currentCv?.profileId === userContext.currentProfile?.id
  const tariffContext = useTariffContext()

  function makeResponse() {
    const _args: IProposalModalProps = {
      cv: currentCv,
      page: ProposalModalPager.OtherVacancy,
      activeVacancies: [...vacancyContext.activeVacancies.values()],
      createProposal: feedBacksContext.createProposal
    }
    isTabletWidth
      ? appContext.showBottomSheet<IProposalModalProps>(ModalType.ProposalModal, _args)
      : appContext.showModal<IProposalModalProps>(ModalType.ProposalModal, _args)
  }

  const goToChat = () => {
    const clearedData = clearObject({
      proposalId: currentCv.proposalsByCurrentUser?.[0]?.id,
      applicationId: currentCv.applicationsToCurrentUser?.[0]?.id
    })
    ChatRepository.getChatByContactId(currentCv.profileId, clearedData)
    .then(res=> {      
      router.push(`/messenger?chat=${res?.id}`)
    })
  }

  const purchaseFreemItem = () => {
    const freeTariffId = [...tariffContext.packets.values()].filter(el => el.price === 0 && el.purchaseType === PurchaseType.ContactsOpen)[0]?.id
    if(freeTariffId) {
      PurchaseRepository.purchaseItem({
        tariffId: freeTariffId
      })
      .then(r => {
        CvRepository.openContacts(currentCv.id)
        .then(res=> {
          cvContext.saveCv(currentCv.id)
          cvContext.getCv(Number(props.cvId))
        })
      })
      .catch(err => {
        isTabletWidth
        ?appContext.showBottomSheet(ModalType.BuyOpensModal, null, 180)
        :appContext.showModal(ModalType.BuyOpensModal)
      })
    }
  }

  const openContacts = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    CvRepository.openContacts(currentCv.id)
    .then(res=> {
      cvContext.saveCv(currentCv.id)
      cvContext.getCv(Number(props.cvId))
    })
    .catch(err => {
      purchaseFreemItem()
      // isTabletWidth
      // ?appContext.showBottomSheet(ModalType.BuyOpensModal, null, 180)
      // :appContext.showModal(ModalType.BuyOpensModal)
    })
  }

  const showFolderModal = (signal: AbortSignal) =>{
    const _modalArgs:ChooseFolderToSaveArgs = {
      initialFolders: folderContext.allFolders,
      onChoose: (folderId) => {
        addToSaved(signal, folderId)
      }
    }
    isTabletWidth
    ?appContext.showBottomSheet<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _modalArgs, 400)
    :appContext.showModal<ChooseFolderToSaveArgs>(ModalType.ChooseFolderToSave, _modalArgs )
  }

  const addToSaved = (signal: AbortSignal, folderId?: number) => {
    CvRepository.addCvToSaved({id: Number(props.cvId), favouriteFolderId: folderId}, {signal})
    .then(_=> {
      cvContext.getCv(Number(props.cvId))
    })
  }

  const saveCvToFavorites = () => {
    const [signal] = getNewSignal('likeHandler')

    if(currentCv.isSavedByCurrentProfile){
      cvContext.removeCvfromSaved(currentCv.id)
      .then(_=> {
        cvContext.getCv(Number(props.cvId))
      })
    }
    else {
      userContext.currentProfile?.addSavedToDefaultFolder?addToSaved(signal):showFolderModal(new AbortController().signal)
    }
  }

  const openProfile = () => {
    router.push(`/personal/${currentCv?.profileId}`)
  }

  const addCvToBlackList = () => {
    CvRepository.addToBlackList(currentCv.id)
    .then(_ => {
      appContext.showSnackbar(t('cv_addedToBlackList'), SnackbarType.success)
      cvContext.getCv(Number(props.cvId))
      router.back()
    })
  }

  useEffect(()=>{
    cvContext.getCv(Number(props.cvId))
    .then(res=> {
      if(res === false ) {
        appContext.showSnackbar(t('cv_deletedOrHidden'), SnackbarType.error)
        // router.back()
      }
    })
    if(userContext.currentProfile) {
      vacancyContext.setVacancies()
      folderContext.getAllFolders(true)
      tariffContext.setPackets([PurchaseType.ContactsOpen])

    }
    else {
      // setTimeout(() => {
      //   router.push('/login')
      // }, 4000)
    }

    return () => {
      cvContext.getCv(null, true)
    }
  }, [])


  const archiveHandler =(e?: React.MouseEvent<HTMLElement>)=> {
    if(e) {
      e.preventDefault()
      e.stopPropagation()
    }  
    if(currentCv?.subscriptions === null && !currentCv.published && currentCv.completedSteps.length > 5) {
      router.push({pathname:'/create/cv', query: {id: currentCv.id, progress: 7, fromOtherPage: true}})
      return
    }
    else if(currentCv.completedSteps.length < 6) {
      router.push({pathname:'/create/cv', query: {id: currentCv.id, progress: currentCv.completedSteps.length||1}})
      return
    }
    const _onSave = () => {
      cvContext.getCv(Number(props.cvId))
    }
    cvContext.updateCv(currentCv.id, {published: !currentCv?.published}, _onSave)
  }

  const cvTopTimePlusTime = () => {
    const time = new Date(currentCv.topAt)
    time.setHours(time.getHours() + 4 )
    return time
  }
  
  const moveToTopHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const _onSet = () => {
      cvContext.getCv(Number(props.cvId))
    }
    cvContext.moveToTop(currentCv.id, _onSet)
  }

  if(!currentCv) {
    return <div className={styles.root}>
      <Spinner size={24}/>
    </div>
  }

  // if(!userContext.currentProfile) {
  //   return <></>
  // }


  const userCard = (<>
    <div className={classNames(styles.top, currentCv?.isContactsOpen&&styles.topActive)} onClick={()=>currentCv?.isContactsOpen&&openProfile()}>
      <UserPic 
      size={80} 
      image={getUserImageSource(currentCv?.profile, Preset.iconCrop)} 
      onClick={() => {
        if(currentCv?.profile?.image?.source && !currentCv?.profile.useOwnLogo) {
          appContext.showModal<ImageViewerModalProps>(ModalType.ImageViewerModal, {
            src: ImageHelper.urlFromFile(currentCv?.profile?.image, Preset.mdCrop),
          })
        }
      }}/>
      {currentCv?.isContactsOpen &&
        <P 
        useThemeColor
        styleType={['large', 'w600']} 
        className={styles.userName} 
        >
          {currentCv?.profile?.firstName} {currentCv?.profile?.lastName}
        </P>
      }
      {currentCv?.isContactsOpen &&
       <ArrowRightSvg color={isLightTheme && colors.black}/>
      }
    </div>
    {(currentCv?.age || currentCv?.profile?.city?.locName) &&
    <P styleType={['medium', 'w500', 'alignCenter']} useThemeColor>
      { [
          currentCv?.gender === Genders.Female&&t('gender_female')||currentCv?.gender === Genders.Male&&t('gender_male'),
          currentCv?.age && `${currentCv?.age} ${Formatter.pluralize(currentCv?.age, t('year1'), t('year2'), t('year3'))}`,
          currentCv?.profile?.city?.locName
        ].filter(Boolean).map((el, i, arr)=>{
          return(<>
            <span>{el}</span>
            {i<arr.length-1 && <DotSvg color={isLightTheme?colors.black:colors.white}/>}
          </>
          )
        })
      }
    </P>
    }
    {currentCv?.profile.vacancyLookType &&
      <p className={classNames(styles.status, styles[currentCv.profile?.vacancyLookType])}>
        {TranslateVacancyLookType(currentCv?.profile?.vacancyLookType, ProfileType.Hirer, t)}
      </p>
    }
    <div className={styles.topButtonsWrapper}>
      {!currentCv?.isContactsOpen &&
        <Button 
        className={styles.topButton}
        styleType={['gradient','wide']} 
        title={'openProfileTop'} 
        onClick={(e)=>!userContext.currentProfile? router.push('/login'):openContacts(e)}
        >
          {t('cv_page_openProfile')}
        </Button>
        ||
        <Button
        className={styles.topButton}
        styleType={['gradient','wide']}
        title={'inviteTop'}
        onClick={makeResponse}
        >
          {t('cv_page_invite')}
        </Button>
      }
      {(currentCv?.proposalsByCurrentUser?.length>0 || currentCv?.applicationsToCurrentUser?.length > 0) &&
        <Button 
        styleType={['borderGradient', 'phoneWide']} 
        altStyleType={['whitePurple', 'phoneWide']}
        className={styles.chatButton}
        onClick={goToChat}
        >
          {t('cv_page_chat')}
        </Button>
      }

      {
        !isTabletWidth && userContext.currentProfile &&
        <>
          <FavoritesButton 
          showStar
          styleType={['icon', 'grey']}
          altStyleType={['icon', 'whitePurple']}
          onClick={saveCvToFavorites} 
          isActive={currentCv?.isSavedByCurrentProfile}
          />
          <Button styleType={['icon', 'grey']} onClick={addCvToBlackList} altStyleType={['icon', 'whitePurple', 'invertSvg']}>
            <CloseEyeSvg/>
          </Button>
        </>
      }

    </div>
  </>)

  const links = [
    currentCv.profile.email&&{
      href: 'mailto:'+currentCv.email, 
      text: currentCv.profile.email,
      icon: <MailAltSvg/>
    },
    (currentCv.phone || currentCv.profile.phone)&&{
      href: 'tel:'+currentCv.phone||currentCv.profile.phone, 
      text: Formatter.formatPhone(currentCv.phone||currentCv.profile.phone),
      icon: <PhoneSvg/>
    },
    (currentCv.telegramNickname||currentCv.profile.telegramNickname)&&{
      href: `tg://resolve?domain=${currentCv.telegramNickname}`, 
      text: currentCv.telegramNickname||currentCv.profile.telegramNickname,
      icon: <TelegramSvg/>
    },
    currentCv.whatsapp &&{
      href: `https://wa.me/${currentCv.whatsapp}`,
      text: currentCv.whatsapp,
      icon: <WhatsAppSvg/>
    },
    currentCv.skype && {
      href: `skype:${currentCv.skype}?chat`,
      text: currentCv.skype,
      icon: <SkypeSvg/>
    },
    currentCv.linkedin && {
      href: currentCv.linkedin,
      text: currentCv.linkedin,
      icon: <LinkedInSvg/>
    },
    currentCv.viber && {
      href: 'viber://chat?number=+'+currentCv.viber,
      text: currentCv.viber,
      icon: <ViberLogoSvg/>
    }
  ].filter(Boolean)


  return (
    <div className={styles.root}>
      <div className={styles.content}>
      {
        !isTabletWidth &&
        <BackTextButton onClick={router.back}/>
      }
      {isTabletWidth &&
        <div className={styles.topButtons}>
          <Button onClick={router.back} styleType={['icon', 'black']}  altStyleType={['icon', 'invertSvg', 'white']}><ArrowLeftSvg/></Button>
          {isMyCv &&
          <Button styleType={['icon', 'grey', 'svg24']}  onClick={()=>router.push('/create/cv?id='+currentCv.id)} >
            <EditPencilSvg/>
          </Button>
          ||
          <FavoritesButton 
          altStyleType={['icon', 'white']}
          onClick={saveCvToFavorites} 
          showStar
          isActive={currentCv?.isSavedByCurrentProfile}/>
          }
       
        </div>
      }


      {isMyCv &&
      <div className={styles.userTop}>
        <div className={styles.topLine}>
          <P useThemeColor styleType={['fs20', 'w600']}>
            {getCategoryName(currentCv.categories[0], lang)}
          </P>
          {!isTabletWidth &&
            <P 
            styleType={['blue', 'alignCenter', 'medium', 'w500']} 
            onClick={()=>router.push('/create/cv?id='+currentCv.id)} 
            className={styles.edit}
            >
              <PencilSvg color={colors.blue}/> {t('cv_page_edit')}
            </P>
          }
        </div>
        <SalaryItem cv={currentCv} />
        <Statistics 
        className={styles.stats}
        items={[
          {name: t('cv_pagee_shows'), count: currentCv?.totalShows},
          {name: t('cv_pagee_views'), count: currentCv?.totalViews, link: `/views?cvId=${currentCv?.id}`},
          {name: t('cv_page_applications'), count: currentCv?.totalApplications, link: '/profile?page=feedbacks'},
  
        ]} 
        title={t('cv_page_statsTitle')}/>
        {currentCv.published&&!currentCv.moderationRejectReason && 
        <div className={styles.topLine}>
          {Number(cvTopTimePlusTime()) > Number(new Date())
          &&  
          <P styleType={['w500', 'medium', 'greyLight']}>
           {t('cv_page_canUprise') + Formatter.formatDate(cvTopTimePlusTime(), {timeOptions: {hour: 'numeric', minute: 'numeric', month: undefined, year: undefined, day: undefined}, lang: lang as InterfaceLanguage})}
          </P>
          ||        
          <P styleType={['w500', 'medium', 'blue']} className={styles.moveToTop}  onClick={moveToTopHandler}>
            {t('cv_page_upCvAutomatically')}
          </P>       
          }       
        </div>
        }
        <div className={styles.topLine}>  
          {currentCv.published&&!currentCv.moderationRejectReason && 
            <Button styleType={['gradient', 'phoneWide']} onClick={() => router.push({pathname: '/create/cv', query: {id: currentCv.id, progress: 7, fromOtherPage: true, improve: true}})}>
              {t('cv_page_improve')}
            </Button>          
            ||
            currentCv.archivedAt && (!currentCv.completedSteps || currentCv.completedSteps.length > 5) &&
            <Button  
            styleType={['gradient', 'phoneWide']}
            onClick={() => {  
              archiveHandler()           
            }}
            >
              {t('publish')}
            </Button>
            ||
            currentCv.completedSteps&&currentCv.completedSteps.length < 6 && 
            <Button
            styleType={['gradient', 'phoneWide']}
            onClick={() => {  
              archiveHandler()     
            }}
            >
              {t('item_continueEditing')}
            </Button>
          }  
          <Button styleType={['borderGradient', 'phoneWide']} altStyleType={['whitePurple']} href={{pathname: '/recruiting', query: {filters: JSON.stringify({categories: [currentCv?.categories[0].id]})}}}>
            {currentCv?.categories[0].vacanciesCount||0} {t('cv_page_appropriateVcs')}
          </Button>
        </div>

      </div>
      }
      

      {!isMyCv &&
        <div className={styles.userCard}>
          {userCard}
        </div>
      }
      <Banner src={'/images/banners/banner2_mobile.jpg'} href={'https://mybroconf.ru/?utm_refcode=432cfc094bc320923abdd9bc188de487d268100c'} className={styles.mobileBanner}/>


      {(currentCv?.isContactsOpen||userContext.currentProfile?.id === currentCv.profile.id)&&
        <div className={styles.contacts}>
          <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_contacts')}</P>
          {links.map(el => (
             <Link href={el.href}>
             <P useThemeColor styleType={['w500', 'medium', 'alignCenter']}>
               <Button styleType={['icon', 'black']} altStyleType={['white', 'icon', 'invertSvg']}>{el.icon}</Button>
               {el.text}
               <Button 
               onClick={(e)=>{
                 e.stopPropagation()
                 e.preventDefault()
                 copyToClipboard(el.text)
                 appContext.showSnackbar(t('copied'), SnackbarType.success)
               }}
               className={styles.copyButton}
               >
                 <DoubleSvg color={colors.blue}/>
               </Button>
             </P>
           </Link>
          ))}
        </div>
      }

      {!isMyCv &&
      <>
        <P 
        useThemeColor
        styleType={['fs20', 'w600']} 
        className={styles.speciality}
        >
          {getCategoryName(currentCv.categories[0], lang)}
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
        <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_sources')}</P>
        <TagList tagClassName={styles.tag} tags={currentCv.sources.map(el=> {
          return {name: el.title}
        })}/>
      </div>
      }

      {currentCv.verticals?.length > 0 &&
       <div className={styles.item}>
        <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_verticals')}</P>
        <TagList tagClassName={styles.tag} tags={currentCv.verticals.map(el=> {
          return {name: el.title}
        })}/>
       </div>
      }

      {currentCv.geos?.length > 0 && 
       <div className={styles.item}>
        <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_geos')}</P>
        <TagList tagClassName={styles.tag} tags={currentCv.geos.map(el=> {
          return {name: el.title}
        })}/>
       </div>
      }

      <div className={styles.item}>
        <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_experience')}</P>
        {currentCv.experienceInfo.length > 0 &&
          <div className={styles.cards}>
            {currentCv.experienceInfo.map(el=> {
              return  <div className={styles.card}>
                <P useThemeColor styleType={['medium', 'w500']}>{el.position}</P>
                <P useThemeColor styleType={['large', 'w500']}>{el.company}</P>
                {el.description &&
                  <P useThemeColor styleType={['medium', 'w500']}>{el.description}</P>
                }
                <P useThemeColor styleType={['w500', 'medium', 'greyLight']}>{el.fromDate} - {el.toDate||t('toPresent')}</P>
              </div>
              })
            }
          </div>
          ||
          <P useThemeColor styleType={['w500', 'medium']}>{t('cv_page_noExperience')}</P>
        }
      </div>

      <div className={styles.item}>
        <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_education')}</P>
        <P useThemeColor styleType={['w500', 'medium']} >{TranslateEducationType(currentCv.education, t)}</P>
        {currentCv.educationInfo.length > 0 && 
          <div className={styles.cards}>
            { currentCv.educationInfo.map(el=> {
              return <div className={styles.card}>
                  <P useThemeColor styleType={['w500', 'large']}>{el.institution}</P>
                  <P useThemeColor styleType={['w500', 'medium']}>{el.speciality}</P>
                  {el.faculty &&
                    <P useThemeColor styleType={['w500', 'medium']}>{el.faculty}</P>
                  }
                  <P  styleType={['w500', 'medium', 'greyLight']}>{el.fromDate} - {el.toDate||t('toPresent')}</P>
                </div>
              })
              }
          </div>
        }
      </div>

      {currentCv.bio && currentCv.bio.length > 1 &&
        <div className={styles.item}>
          <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_about')}</P>
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </div>
      }

      {currentCv.skills?.length > 0 &&
        <div className={styles.item}>
          <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_skills')}</P>
          <TagList tagClassName={styles.tag} tags={currentCv.skills.map(el=> {
            return {name: el.title}
          })}/>
        </div>
        
      }

      {currentCv.languageKnowledges?.length > 0 &&
        <div className={styles.item}>
          <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_languageKnowledges')}</P>
          <TagList 
          tagClassName={styles.tag} 
          tags={currentCv.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ', ' + TranslateLanguageKnowLevel(el.level, t, true)}))} 
          />
        </div>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets.length > 0)) &&
        <div className={styles.item}>
          <P useThemeColor styleType={['large', 'w600']}>{t('cv_page_portfolio')}</P>
          {currentCv.portfolio &&
            <Link href={currentCv.portfolio} target={'_blank'} className={styles.portfoilo}>
              <P useThemeColor styleType={['w500', 'medium']}>{currentCv.portfolio}</P>
            </Link>
          }
          <FilesList disabledRemoving previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
        </div>
      }

      <div className={styles.item}>
        {currentCv.relocation &&
          <P useThemeColor styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {currentCv.relocation === Answer.No ? t('cv_page_noRelocation') : t('cv_page_relocation')}
          </P>
        }
        {currentCv.businessTrips &&
          <P useThemeColor styleType={['w500', 'medium', 'alignCenter']}>
            <GradientDotSvg/> {currentCv.businessTrips === Answer.Yes ? t('cv_page_businesstrips') : t('cv_page_noBusinesstrips')}
          </P>
        }
      </div>

      {!isMyCv &&
        <div className={styles.buttonsWrapper}>
          {!currentCv.isContactsOpen &&
            <Button 
            styleType={['gradient']} 
            title={'openProfileBottom'}         
            onClick={(e)=>!userContext.currentProfile? router.push('/login'):openContacts(e)}
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
            <Button 
            styleType={['borderGradient']} 
            altStyleType={['white']} 
            onClick={goToChat}
            >
              {t('cv_page_chat')}
            </Button>
          }
        </div>
      }
      </div>
      <Banner href={'https://mybroconf.ru/?utm_refcode=432cfc094bc320923abdd9bc188de487d268100c'} src={'/images/banners/banner2.jpg'} className={styles.deskBanner}/>
    </div>
  )
}