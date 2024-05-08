import BackTextButton from '@/components/ui/BackTextButton'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import PreviewItem from '@/components/ui/PreviewItem'
import {  TranslateLanguage, TranslateLanguageKnowLevel,  TranslateWorkExperience } from 'utils/enumsTranslations'
import P from '@/components/ui/P'
import SalaryItem from '@/components/ui/SalaryItem'
import UserPic from '@/components/ui/UserPic'
import { getUserImageSource } from 'utils/helpers'
import { useUserContext } from 'context/user_state'
import Button from '@/components/ui/Button'
import UserSvg from '@/components/svg/UserSvg'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'
import HtmlText from '@/components/ui/HtmlText'
import TagList from '@/components/ui/TagList'
import MailAltSvg from '@/components/svg/MailAltSvg'
import EmploymentBoard from '@/components/ui/EmploymentBoard'
import { IVacancy } from 'data/interfaces/IVacancy'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import Formatter from 'utils/formatter'
import useTranslation from 'next-translate/useTranslation'
import { Preset } from 'types/enums'

interface Props {
  id?: number
  vacancy?: IVacancy
  onBack?: (page?: number)=> void
  onPublish?: () => void
}


export default function VacancyPreview(props: Props) {
  const {t} = useTranslation()
  const creationContext = useCreateVcCvContext()
  const currentVacancy = props.vacancy
  const userContext = useUserContext()

  const header = (
    <div className={styles.header}>
      <UserPic size={67} image={getUserImageSource(userContext.currentProfile, Preset.smallIconCrop)}/>
      <div className={styles.headerInfo}>
        <P styleType={['w600', 'large']}>{currentVacancy.company}</P>
        <P styleType={['medium','w500', 'greyLight']}>{currentVacancy.city?.locName}</P>
      </div>
    </div>
  )

  return (
  <div className={styles.root}> 
    <BackTextButton onClick={()=>props.onBack()} className={styles.backButton}/>
    <Title title={t('create_vacancy_preview')}/>

    <div className={styles.itemsWrapper}>

      <PreviewItem disableLink titleElement={header}/>
      <div className={styles.previewList}>
        <PreviewItem title={currentVacancy.name} onClick={()=>props.onBack(1)}/>
        <PreviewItem 
        onClick={()=>props.onBack(5)}
        titleElement={
          <P styleType={['medium', 'greyLight', 'w500']}>{t('create_workExperience')}  {TranslateWorkExperience(currentVacancy.experience, t)}</P>
        }/>
        <PreviewItem 
        onClick={()=>props.onBack(2)}
        titleElement={
          <SalaryItem vacancy={currentVacancy}/>
        }/>
      </div>

      {(currentVacancy.showContactName||currentVacancy.showEmail||currentVacancy.showPhone||currentVacancy.showTelegramNickname)&&
        <PreviewItem title={t('create_vacancy_contactInfo')} wrapperClassName={styles.item} onClick={()=>props.onBack(7)}>
          {currentVacancy.showContactName &&
            <P styleType={['medium', 'w500', 'alignCenter']} useThemeColor >
              <Button styleType={['icon', 'black']} altStyleType={['white','icon','invertSvg']} ><UserSvg/></Button> {currentVacancy.contactName}
            </P>
          }
          {currentVacancy.showEmail &&
            <P styleType={['medium', 'w500', 'alignCenter']} useThemeColor>
              <Button styleType={['icon', 'black']} altStyleType={['white','icon','invertSvg']}><MailAltSvg/></Button>  {currentVacancy.email}
            </P>
          }
          {currentVacancy.showPhone &&
            <P styleType={['medium', 'w500', 'alignCenter']} useThemeColor>
              <Button styleType={['icon', 'black']} altStyleType={['white','icon','invertSvg']}><PhoneSvg/> </Button> {Formatter.formatPhone(currentVacancy.phone)}
            </P>
          }
          {currentVacancy.showTelegramNickname &&
            <P styleType={['medium', 'w500', 'alignCenter']} useThemeColor>
              <Button styleType={['icon', 'black']} altStyleType={['white','icon','invertSvg']}><TelegramSvg/></Button> {currentVacancy.telegramNickname}
            </P>
          }
        </PreviewItem>
      }

      <PreviewItem title={t('employmentBoard_employment')} onClick={()=>props.onBack(3)}>
        <EmploymentBoard vacancy={currentVacancy}/>
      </PreviewItem>

      {currentVacancy.description && currentVacancy.description !== '<p></p>' &&
      <PreviewItem title={t('create_description')} onClick={()=>props.onBack(6)}>
        <HtmlText text={currentVacancy.description}/>
      </PreviewItem>
      }

      {creationContext.helpObjects.skills && creationContext.helpObjects.skills.size > 0 &&
        <PreviewItem title={t('create_vacancy_skillsOnly')} onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects.skills.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {creationContext.helpObjects.activeSources && creationContext.helpObjects.activeSources.size > 0 &&
        <PreviewItem title={t('vacancy_page_sources')} onClick={()=>props.onBack(4)}>
          <TagList tags={[...creationContext.helpObjects.activeSources.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }      

      {creationContext.helpObjects.activeGeos && creationContext.helpObjects.activeGeos.size > 0 &&
        <PreviewItem title={t('vacancy_page_geos')} onClick={()=>props.onBack(4)}>
          <TagList tags={[...creationContext.helpObjects.activeGeos.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {creationContext.helpObjects.activeVerticals && creationContext.helpObjects.activeVerticals.size > 0 &&
        <PreviewItem title={t('vacancy_page_verticals')}onClick={()=>props.onBack(4)}>
          <TagList tags={[...creationContext.helpObjects.activeVerticals.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {currentVacancy.languageKnowledges && currentVacancy.languageKnowledges.length > 0 && 
        <PreviewItem title={t('vacancy_page_languagesKnowledges')} onClick={()=>props.onBack(5)}>
          <TagList tagClassName={styles.langTag} tags={currentVacancy.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </PreviewItem>
      }
    </div>

    <div className={styles.buttonsWrapper}>
      <Button styleType={['gradient']} onClick={()=>props.onBack()} title={'back'} className={styles.button}>{t('back')}</Button>
      {currentVacancy.completedSteps && currentVacancy.completedSteps.length > 6 &&
        <Button styleType={['black']} altStyleType={['white']} title={'next'} onClick={props.onPublish}  className={styles.button}>{t('publish')}</Button>
      }
    </div>

  </div>
  )
}