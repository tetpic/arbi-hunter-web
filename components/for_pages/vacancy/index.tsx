import styles from './index.module.scss'

import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useState } from 'react'
import Spinner from 'components/ui/Spinner'
import {  ModalType } from 'types/enums'
import languages from '@cospired/i18n-iso-languages'
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
import { TranslateLanguage, TranslateLanguageKnowLevel } from 'utils/enumsTranslations'


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
    if(currentVacancy?.id === props.id && !personalContext.personalPage) {
      personalContext.setPersonalPage({profile: currentVacancy.profile})
    }
  }, [currentVacancy])

  useEffect(()=>{
    cvContext.setSavedCvs()
    vacancyContext.setCurrentVacancy(props.id)  
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
  }, [])


  if(!currentVacancy) return <Spinner size={24}/>

  const companyCard = (
    <div className={styles.companyCard}>
      <UserPic image={FILES + currentVacancy.profile?.logo?.source} size={67}/>
      <div className={styles.companyInfo}>
        <P styleType={['w600', 'medium']}>{currentVacancy.profile?.company}</P>
        {currentVacancy.city?.locName &&
          <P styleType={['w500', 'medium', 'greyLight']}>{currentVacancy.city.locName}</P>
        }
      </div>
      <Button className={styles.companyArrow} styleType={['icon', 'backTransparent']}><ArrowRightSvg/></Button>
    </div>
  )


  return (
    <div className={styles.root}>
      <BackTextButton onClick={router.back}/>
      {companyCard}
      <P styleType={['w600', 'huge']}>{currentVacancy.name}</P>
      <P styleType={['w500', 'medium', 'greyLight']}>{currentVacancy.categories[0].name}</P>
      <P styleType={['w600', 'large']}>{getSalary({vacancy:currentVacancy})} на руки</P>
      <div className={styles.buttonsWrapper}>
        <Button styleType={['gradient' ]}>Откликнуться</Button>
        <FavoritesButton/>
        <Button styleType={['icon', 'black']}><CloseEyeSvg/></Button>
      </div>
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

      <div className={styles.buttonsWrapper}>
        <Button styleType={['gradient']}>Откликнуться</Button>
      </div>





    </div>
  )
}