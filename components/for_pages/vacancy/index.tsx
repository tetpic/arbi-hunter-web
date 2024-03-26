import styles from './index.module.scss'

import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import {  ModalType } from 'types/enums'
import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import { useAppContext } from 'context/state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'
import { useCvContext } from 'context/cv_state'
import { IVacancy } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import Formatter from 'utils/formatter'
import { useUserContext } from 'context/user_state'
import Button from 'components/ui/Button'
import CloseEyeSvg from 'components/svg/CloseEyeSvg'
import { useRouter } from 'next/navigation'
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
  const isMyVacancy = userContext.currentProfile?.id === currentVacancy?.profile?.id
  const salary = getSalary({vacancy:currentVacancy})
  const [isShowContacts, setIsShowContacts] = useState<[boolean, boolean]>([false, false])


  const makeResponse = () => {
    if(isTabletWidth) {
      appContext.showBottomSheet<IApplicationModalProps>(ModalType.ApplicationModal, {vacancyId: currentVacancy.id, cvs: cvContext.savedCvs})
      return
    }
    appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, {vacancyId: currentVacancy.id, cvs: cvContext.savedCvs})
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
      <UserPic image={FILES + currentVacancy.profile?.logo?.source} size={67}/>
      <div className={styles.companyInfo}>
        <P styleType={['w600', 'medium']}>{currentVacancy.profile?.company}</P>
        {currentVacancy.city?.locName &&
          <P styleType={['w500', 'medium', 'greyLight']}>{currentVacancy.city.locName}</P>
        }
      </div>
      <Button className={styles.companyArrow} styleType={['icon', 'backTransparent']}><ArrowRightSvg/></Button>
    </Link>
  )

  


  return (
    <div className={styles.root}>
      <BackTextButton onClick={router.back}/>
      {!isMyVacancy &&companyCard}
      <div className={styles.topLine}>
        <P styleType={['w600', 'huge']}>{currentVacancy.name}</P>
        {isMyVacancy &&
          <P 
          styleType={['blue', 'alignCenter', 'medium', 'w500']} 
          onClick={()=>router.push('/create/vacancy?id='+currentVacancy.id)} 
          className={styles.edit}
          >
            <PencilSvg color={colors.blue}/> Редактировать
          </P>
        }
      </div>
      <P styleType={['w500', 'medium', 'greyLight']}>{currentVacancy.categories[0].name}</P>
      {salary &&
        <P styleType={['w600', 'large']}>{salary} на руки</P>
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
          className={styles.expires}
          >
            Истекает {Formatter.formatDate(currentVacancy.updatedAt, {plusDays: 30})}
          </P>
        </div>
      }

      {isMyVacancy &&
        <Statistics 
        className={styles.stats}
        items={[
          {name: 'Показы', count: currentVacancy.totalShows},
          {name: 'Просмотры', count: currentVacancy.totalViews},
          {name: 'Отклики', count: currentVacancy.totalApplications},
        ]} 
        title={'Статистика за все время'} 
        />
      }

      {isMyVacancy &&
        <div className={styles.buttonsWrapper}>
          <Button 
          styleType={['gradient']}  
          onClick={(e)=>{
              router.push(`/responses/${currentVacancy.id}/`)
          }} 
          >
            Посмотреть отклики
          </Button>
          <Button styleType={['black', 'borderBlue']}>Пригласить подходящих</Button>
        </div>
      }

      {!isMyVacancy &&
        <div className={styles.buttonsWrapper}>
          <Button styleType={['gradient' ]} onClick={makeResponse}>Откликнуться</Button>
          {currentVacancy.showContactName &&
            <Button styleType={['black', 'borderBlue']} onClick={()=>setIsShowContacts(state=> ([true, state[1]]))}>Показать контакты</Button>
          }
          <FavoritesButton onClick={likeHandler} isActive={currentVacancy.isSavedByCurrentProfile}/>
          <Button styleType={['icon', 'black']} onClick={()=>vacancyContext.addToBlackList()}><CloseEyeSvg/></Button>
          {currentVacancy.showContactName && isShowContacts[0] &&
            <ContactsModal 
            key={'contacts1'}
            vacancy={currentVacancy} 
            isActive={isShowContacts[0]} 
            onClose={()=>setIsShowContacts(state=> ([false, state[0]]))}
            />
          }
        </div>
      }
      <EmploymentBoard type='black' vacancy={currentVacancy}/>
      {currentVacancy.description !== '<p></p>' &&
        <div className={styles.description}>
          <HtmlText text={currentVacancy.description}/>
        </div>
      }
      {currentVacancy.skills?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Навыки</P>
          <TagList tags={currentVacancy.skills.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.sources?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Источники</P>
          <TagList tags={currentVacancy.sources.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.geos?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Гео</P>
          <TagList tags={currentVacancy.geos.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.verticals?.length > 0 &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Вертикали</P>
          <TagList tags={currentVacancy.verticals.map(el=> ({name: el.title}))}/>
        </div>
      }

      {currentVacancy.languageKnowledges && currentVacancy.languageKnowledges.length > 0 && 
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Владение языками</P>
          <TagList tags={currentVacancy.languageKnowledges.map(el=>({name: TranslateLanguage(el.language) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </div>
      }

      {currentVacancy.showContactName && !isMyVacancy &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Контакты</P>
          <div className={styles.contacts}>
            <P styleType={['w500', 'medium']}>{currentVacancy.contactName}</P>
            <Button styleType={['black', 'wide', 'borderBlue']} onClick={()=>setIsShowContacts(state=> ([state[0], true]))}>Показать контакты</Button>
            {currentVacancy.showContactName && isShowContacts[1]&&
              <ContactsModal key={'contacts2'} vacancy={currentVacancy} isActive={isShowContacts[1]} onClose={()=>setIsShowContacts(state=> ([state[0], false]))}/>
            }
          </div>
        </div>
      }
      
      {!isMyVacancy &&
      <div className={styles.buttonsWrapper}>
        <Button styleType={['gradient']} onClick={makeResponse}>Откликнуться</Button>
      </div>
      }
      
      {!isMyVacancy &&
        <div className={styles.item}>
          <P styleType={['w600', 'large']}>Похожие вакансии</P>
          <div className={styles.vacancies}>
            {otherCompanyVacncies.map(el => <VacancyItem key={el.id} vacancy={el} />)}
          </div>
        </div>
      }
    </div>
  )
}