import styles from './index.module.scss'

import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import {  AppTheme, ApplicationStatus, InterfaceLanguage, ModalType, ModerationStatusType, Preset, ProposalRequestType } from 'types/enums'
import UserPic from 'components/ui/UserPic'
import { useAppContext } from 'context/state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'
import { useCvContext } from 'context/cv_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import Formatter from 'utils/formatter'
import { useUserContext } from 'context/user_state'
import Button from 'components/ui/Button'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import { useRouter } from 'next/router'
import { usePersonalContext } from 'context/personal_state'
import BackTextButton from '@/components/ui/BackTextButton'
import P from '@/components/ui/P'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import { getSalary } from 'utils/helpers'
import FavoritesButton from '@/components/ui/FavoritesButton'
import EmploymentBoard from '@/components/ui/EmploymentBoard'
import HtmlText from '@/components/ui/HtmlText'
import TagList from '@/components/ui/TagList'
import { TranslateLanguage, TranslateLanguageKnowLevel, TranslateTariffType } from 'utils/enumsTranslations'
import VacancyItem from '@/components/ui/VacancyItem'
import PencilSvg from '@/components/svg/PencilSvg'
import { colors } from 'styles/variables'
import classNames from 'classnames'
import Statistics from '@/components/ui/Statistics'
import Link from 'next/link'
import ContactsModal from './ContactsModal'
import useTranslation from 'next-translate/useTranslation'
import ImageHelper from 'utils/ImageHelper'
import ChatRepository from 'data/repositories/ChatRepository'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import Head from 'next/head'


interface Props {
  id?: number
}

export default function VacancyPage(props: Props) {
  const {t, lang} = useTranslation()
  const vacancyContext = useVacancyContext()
  const cvContext = useCvContext()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const personalContext = usePersonalContext()
  const {isTabletWidth} = appContext.size
  const [otherCompanyVacncies, setOtherCompanyVacancies] = useState<IVacancy[]>([])
  const {currentVacancy, foundVacancies} = vacancyContext
  const router = useRouter()
  const isMyVacancy = userContext.currentProfile?.id === currentVacancy?.profile?.id
  const salary = getSalary({vacancy:currentVacancy}, t)
  const [isShowContacts, setIsShowContacts] = useState<[boolean, boolean]>([false, false])
  const lastProposal = currentVacancy?.proposalsToCurrentUser?.[currentVacancy.proposalsToCurrentUser.length -1]||null
  const freeToApplyCvs = cvContext.savedCvs.filter(cv => !currentVacancy?.applicationsByCurrentUser?.map(el => el.cvId).includes(cv.id)&&cv.published&&cv.moderationStatus === ModerationStatusType.Approved)




  const makeResponse = () => {
    const args:  IApplicationModalProps={
      vacancy: currentVacancy, 
      cvs: cvContext.savedCvs,
      onSet: () => {
        vacancyContext.setCurrentVacancy({id: props.id})  
      }
    }
    isTabletWidth
      ?appContext.showBottomSheet<IApplicationModalProps>(ModalType.ApplicationModal, args)
      :appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, args)
  }

  const likeHandler = () => {
    if(!currentVacancy.isSavedByCurrentProfile) {
      vacancyContext.saveVacancy(currentVacancy.id)
      vacancyContext.setCurrentVacancy({vacancy: {...currentVacancy, isSavedByCurrentProfile: true}})
    }
    else {
      vacancyContext.removeVacancyFromSaved(currentVacancy.id)
      vacancyContext.setCurrentVacancy({vacancy: {...currentVacancy, isSavedByCurrentProfile: false}})
    }
  }

  const openChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const activeChat = currentVacancy.proposalsToCurrentUser.filter(el => el.type !== ProposalRequestType.Rejection&&el.status === ApplicationStatus.Applied)
    if(activeChat[0]){
      ChatRepository.getChatByContactId(currentVacancy.profile.id, {proposalId: lastProposal.id})
      .then(res=>{
        
        if(res) {
          router.push('/messenger?chat=' + res.id)
        }
      })
    }
  }

  useEffect(()=>{
    if(currentVacancy && !currentVacancy?.profile) {
      router.back()
      return
    }
    if(currentVacancy && currentVacancy.categories.length > 0) {
      vacancyContext.findVacancies({categories: currentVacancy.categories.map(e=>e.id)})
      VacancyRepository.searchVacancies({categories: [currentVacancy.categories[0].id]})
      .then(res=> {
        if(res?.data.length >  1) {
          const randomItems = Formatter.randomElementsFromArray<IVacancy>(res.data, 3).filter(el => el.id !== currentVacancy.id)
          setOtherCompanyVacancies(randomItems)
        }
      })
    }
    if(currentVacancy?.id === props.id && !personalContext.personalPage) {
      personalContext.setPersonalPage({profile: currentVacancy.profile})
    }
  }, [currentVacancy])

  useEffect(()=>{
    cvContext.setSavedCvs()
    vacancyContext.setCurrentVacancy({id: props.id})  
  }, [])


  if(!currentVacancy) return <div className={styles.root}>
    <Spinner size={24}/>
  </div> 

  const companyCard = (
    <Link href={'/personal/'+currentVacancy.profile?.id} className={styles.companyCard}>
      <UserPic 
      image={currentVacancy.profile?.logo&&ImageHelper.urlFromFile(currentVacancy.profile?.logo, Preset.smallIconCrop)} 
      size={67}/>
      <div className={styles.companyInfo}>
        <P styleType={['w600', 'medium']} useThemeColor>{currentVacancy.profile?.company}</P>
        {currentVacancy.city?.locName &&
          <P styleType={['w500', 'medium', 'greyLight']}>{currentVacancy.city.locName}</P>
        }
      </div>
      <Button 
      className={styles.companyArrow} 
      styleType={['icon', 'backTransparent']} 
      altStyleType={['icon', 'backTransparent', 'invertSvg']}
      >
        <ArrowRightSvg/>
      </Button>
    </Link>
  ) 


  return (
    <div className={styles.root}>
      <Head>
        <meta property="og:title"  content={'Вакансия '+currentVacancy?.name} />       
        <meta property="og:url" content={process.env.HOST + '/vacancy' + currentVacancy?.id} />
        <meta property="og:description"  content={currentVacancy?.description}/>
        <meta property="og:image" content={process.env.HOST + '/images/ahFooter.svg'} />
        <meta property="og:image:width" content="400"/>
        <meta property="og:image:height" content="400"/>
      </Head>
      {!isTabletWidth &&
      <BackTextButton onClick={router.back}/>
      }
      {isTabletWidth &&
        <div className={styles.topButtons}>
          <Button onClick={router.back} styleType={['icon', 'black']}  altStyleType={['icon', 'invertSvg', 'white']}><ArrowLeftSvg/></Button>
          {!isMyVacancy &&
            <FavoritesButton altStyleType={['white', 'icon']} onClick={likeHandler} isActive={currentVacancy.isSavedByCurrentProfile}/>
          }
        </div>
      }
      {!isMyVacancy &&companyCard}
      <div className={styles.topLine}>
        <P styleType={['w600', 'huge']} useThemeColor>{currentVacancy.name}</P>
        {isMyVacancy &&
          <P 
          styleType={['blue', 'alignCenter', 'medium', 'w500']} 
          onClick={()=>router.push('/create/vacancy?id='+currentVacancy.id)} 
          className={styles.edit}
          >
            <PencilSvg color={colors.blue}/> {t('vacancy_page_edit')}
          </P>
        }
      </div>
      <P styleType={['w500', 'medium', 'greyLight']}>{currentVacancy.categories[0].name}</P>
      {salary &&
        <P styleType={['w600', 'large']} useThemeColor>{salary} {t('vacancy_page_salaryCounter')}</P>
      }
      {isMyVacancy && 
        <div className={styles.topLine}>
          <P 
          styleType={['w600', 'medium']} 
          className={classNames(styles.tariff, styles['tariff_'+currentVacancy.tariff])}
          >
            {TranslateTariffType(currentVacancy.tariff)}
          </P>

          <P 
          styleType={['small', 'green']} 
          useThemeColor
          className={styles.expires}
          >
            {t('vacancy_page_expires')} {Formatter.formatDate(currentVacancy.updatedAt, {plusDays: 30, lang: lang as InterfaceLanguage})}
          </P>
        </div>
      }

      {isMyVacancy &&
        <Statistics 
        className={styles.stats}
        items={[
          {name: t('vacancy_page_shows'), count: currentVacancy.totalShows},
          {name: t('vacancy_page_views'), count: currentVacancy.totalViews},
          {name: t('vacancy_page_applications'), count: currentVacancy.totalApplications},
        ]} 
        title={t('vacancy_page_statsTitle')} 
        />
      }

      {isMyVacancy &&
        <div className={styles.buttonsWrapper}>
          <Button 
          styleType={['gradient', 'phoneWide']}  
          onClick={(e)=>{
            router.push(`/responses/${currentVacancy.id}/`)
          }} 
          >
            {t('vacancy_page_viewApplicetions')}
          </Button>
          <Button 
          styleType={['black', 'borderBlue', 'phoneWide']}
          altStyleType={['white']}
          onClick={() => {
            router.push({pathname:'/recruiting', query: {filters: JSON.stringify({categories: [currentVacancy.categories[0].id]})}})
          }}
          >
            {t('vacancy_page_invite')}
          </Button>
        </div>
      }

      {!isMyVacancy &&
        <div className={styles.buttonsWrapper}>
          {lastProposal&&lastProposal?.type !== ProposalRequestType.Rejection && 
          <>
            <Button 
            styleType={['gradient', 'phoneWide']}
            onClick={openChat}
            >
              {t('goToChat')}
            </Button>
          </>
          }
           {freeToApplyCvs.length > 0 && currentVacancy.applicationsByCurrentUser.length>0 &&
              <Button
              styleType={['gradient', 'phoneWide']}
              onClick={makeResponse}
              >
              {t('vacancy_page_applyFromOtherCv')}
            </Button>
            }
          {(!lastProposal) && currentVacancy.applicationsByCurrentUser.length===0 && freeToApplyCvs.length > 0 &&
            <Button 
            styleType={['gradient', 'phoneWide']}
            onClick={makeResponse}
            >
              {t('vacancy_page_makeApply')}
            </Button>
          }
          
          {/* <Button styleType={['gradient' ]} onClick={makeResponse}>{t('vacancy_page_makeApply')}</Button> */}
          {currentVacancy.showContactName && !lastProposal &&
          <div className={styles.contactsButton}>
        
            <Button 
            styleType={['black', 'borderBlue', 'phoneWide']} 
            altStyleType={['whitePurple', 'borderBlue', 'phoneWide']}
            onClick={()=>setIsShowContacts(state=> ([true, state[1]]))}>
              {t('vacancy_page_showContacts')}
            </Button>
          
            {currentVacancy.showContactName && isShowContacts[0] &&
              <ContactsModal 
              key={'contacts1'}
              vacancy={currentVacancy} 
              isActive={isShowContacts[0]} 
              onClose={()=>setIsShowContacts(state=> ([false, state[1]]))}
              />
            }
          </div>
          }
          {!isTabletWidth && <>
            <FavoritesButton onClick={likeHandler} isActive={currentVacancy.isSavedByCurrentProfile}/>
            <Button 
            styleType={['icon', 'black']} 
            altStyleType={['icon', 'whitePurple', 'invertSvg', 'borderBlue']}
            onClick={()=>vacancyContext.addToBlackList()}
            >
              <CloseEyeSvg/>
            </Button>
          </>}

        </div>
      }
      <EmploymentBoard type={(isTabletWidth||appContext.theme === AppTheme.Light) ? 'gradient' : 'black'} vacancy={currentVacancy}/>
      {currentVacancy.description !== '<p></p>' &&
        <div className={styles.description}>
          <HtmlText text={currentVacancy.description}/>
        </div>
      }
      {currentVacancy.skills?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_skills')}</P>
          <TagList tags={currentVacancy.skills.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.sources?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_sources')}</P>
          <TagList tags={currentVacancy.sources.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.geos?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_geos')}</P>
          <TagList tags={currentVacancy.geos.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.verticals?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_verticals')}</P>
          <TagList tags={currentVacancy.verticals.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.languageKnowledges && currentVacancy.languageKnowledges.length > 0 && 
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_languagesKnowledges')}</P>
          <TagList 
          tags={currentVacancy.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </div>
      }

      {currentVacancy.showContactName && !isMyVacancy &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_contacts')}</P>
          <div className={styles.contacts}>
            <P styleType={['w500', 'medium']} useThemeColor>{currentVacancy.contactName}</P>
            <Button 
            styleType={['black', 'wide', 'borderBlue']} 
            altStyleType={['gradient']}
            onClick={()=>setIsShowContacts(state=> ([state[0], true]))}
            >
              {t('vacancy_page_showContacts')}
            </Button>
            {currentVacancy.showContactName && isShowContacts[1]&&
              <ContactsModal 
              key={'contacts2'} 
              vacancy={currentVacancy} 
              isActive={isShowContacts[1]} 
              onClose={()=>setIsShowContacts(state=> ([state[0], false]))}
              />
            }
          </div>
        </div>
      }
      
      {!isMyVacancy && !lastProposal &&
      <div className={styles.buttonsWrapper}>
        <Button styleType={['gradient', 'phoneWide']} onClick={makeResponse}>{t('vacancy_page_makeApply')}</Button>
      </div>
      }
      
      {!isMyVacancy && otherCompanyVacncies.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']} useThemeColor>{t('vacancy_page_sameVacancies')}</P>
          <div className={styles.vacancies}>
            {otherCompanyVacncies.filter(el=> el.id !== currentVacancy.id).map(el => <VacancyItem key={el.id} vacancy={el} />)}
          </div>
        </div>
      }
    </div>
  )
}