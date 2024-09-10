import styles from './index.module.scss'
import BackTextButton from '@/components/ui/BackTextButton'
import Title from '@/components/ui/TitleForSection'
import PreviewItem from '@/components/ui/PreviewItem'
import UserPic from '@/components/ui/UserPic'
import { useUserContext } from 'context/user_state'
import { getAge, getUserImageSource, getUserName } from 'utils/helpers'
import P from '@/components/ui/P'
import classNames from 'classnames'
import { Answer, Preset, VacancyLookType } from 'types/enums'
import Formatter from 'utils/formatter'
import SalaryItem from '@/components/ui/SalaryItem'
import Button from '@/components/ui/Button'
import { TranslateCompensationType, TranslateEducationType, TranslateEmploymentType, TranslateLanguage, TranslateLanguageKnowLevel, TranslateScheduleType, TranslateVacancyLookType } from 'utils/enumsTranslations'
import GradientDotSvg from '@/components/svg/GradientDotSvg'
import HtmlText from '@/components/ui/HtmlText'
import TagList from '@/components/ui/TagList'
import FilesList from '@/components/ui/FilesList'
import { PreviewImage } from 'data/interfaces/Common'
import PhoneSvg from '@/components/svg/PhoneSvg'
import TelegramSvg from '@/components/svg/TelegramSvg'
import LinkedInSvg from '@/components/svg/LinkedInSvg'
import SkypeSvg from '@/components/svg/SkypeSvg'
import WhatsAppSvg from '@/components/svg/WhatsAppSvg'
import MailAltSvg from '@/components/svg/MailAltSvg'
import { ICV } from 'data/interfaces/ICV'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import ViberLogoSvg from '@/components/svg/ViberLogoSvg'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'
import BackBtn from '@/components/ui/BackBtn'
import { useAppContext } from 'context/state'


interface Props {
  id?: number
  cv?: ICV,
  onBack?: (page?: number)=> void
  onPublish?: () => void
}

export default function CvPreview(props: Props) {
  const {t} = useTranslation()
  const creationContext = useCreateVcCvContext()
  const appContext = useAppContext()
  const isTabletWidth = appContext.size.isTabletWidth
  const userContext = useUserContext()
  const currentCv = props.cv

  const personalHead = (
    <div className={styles.head}>
      <UserPic image={getUserImageSource(userContext.currentProfile, Preset.smallIconCrop)} size={80}/>
      <P styleType={['w600', 'large']} useThemeColor>{getUserName(userContext.currentProfile)}</P>
    </div>
  )

  if(!currentCv) return null

  return (<div className={styles.root}> 
    {isTabletWidth &&
      <BackBtn onClick={() => props.onBack()} className={styles.backButton}/>
      ||
      <BackTextButton onClick={() => props.onBack()} className={styles.backButton}/>
    }
    <Title title={t('create_cv_preview')}/>
    <div className={styles.itemsWrapper}>
      <PreviewItem 
      titleElement={personalHead} 
      wrapperClassName={styles.item}
      onClick={() => props.onBack(1)}
      >
        {currentCv.profile.vacancyLookType &&
        <P 
        styleType={['small', currentCv.vacancyLookType === VacancyLookType.NotLooking?'red':'green']} 
        className={classNames(styles.status, currentCv.vacancyLookType === VacancyLookType.NotLooking?styles.status_red: styles.status_green)}
        >
          {TranslateVacancyLookType(currentCv.profile.vacancyLookType, ProfileType.Hirer, t)}
        </P>
        }
        <P 
        styleType={['greyLight', 'w500', 'medium']}>
          {[
            currentCv.gender === 'male'&&t('gender_male')||currentCv.gender === 'female' &&t('gender_female')||null, 
            currentCv.birthday&&getAge(currentCv.age ? currentCv.age : currentCv.birthday && Number(Formatter.formatDistanceToNow(currentCv.birthday, {strict: true}))), 
            currentCv.city?.locName].filter(Boolean).join(' · ')
          }
        </P>
        <P styleType={['w600', 'large']} useThemeColor>{creationContext.activeSubCategory?.[0]?.name}</P>
        <SalaryItem cv={currentCv}/>

      </PreviewItem>



      <PreviewItem title={t('cv_page_contacts')} wrapperClassName={styles.item} onClick={() => props.onBack(2)}>
        {(currentCv.profile?.email||currentCv.email) &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><MailAltSvg/></Button>
          {currentCv.email||currentCv.profile?.email}
        </P>
        }
        {(currentCv.phone||currentCv.profile?.phone) &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><PhoneSvg/></Button>
          {Formatter.formatPhone(currentCv.phone||currentCv.profile?.phone)}
        </P>
        }
        {(currentCv?.telegramNickname||currentCv.profile?.telegramNickname) &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><TelegramSvg/></Button>
          {currentCv.telegramNickname||currentCv.profile?.telegramNickname}
        </P>
        }
        {currentCv.whatsapp &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><WhatsAppSvg/></Button>
          {currentCv.whatsapp}
        </P>
        }
        {currentCv.skype &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><SkypeSvg/></Button>
          {currentCv.skype}
        </P>
        }
        {currentCv.linkedin &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><LinkedInSvg/></Button>
          {currentCv.linkedin}
        </P>
        }
        {currentCv.viber &&
        <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
          <Button styleType={['icon', 'black']} altStyleType={['icon', 'whitePurple', 'invertSvg']}><ViberLogoSvg/></Button>
          {currentCv.viber}
        </P>
        }
      </PreviewItem>

      <PreviewItem 
      title={t('employmentBoard_employment')} 
      wrapperClassName={styles.item}
      onClick={() => props.onBack(6)}
      >
        {currentCv.employment &&
          <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
            <GradientDotSvg/> {TranslateEmploymentType(currentCv.employment, t, true)} 
          </P>
        }
        {currentCv.relocation &&
          <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
            <GradientDotSvg/> 
            {currentCv.relocation === Answer.No ? t('cv_page_noRelocation') : t('cv_page_relocation')}
          </P>
        }
        {currentCv.schedule &&
          <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
            <GradientDotSvg/> {TranslateScheduleType(currentCv.schedule, t)}
          </P>
        }
        {currentCv.compensation &&
          <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor> 
            <GradientDotSvg/> {TranslateCompensationType(currentCv.compensation, t)}
          </P>
        }
        {currentCv.businessTrips &&
          <P styleType={['w500', 'medium', 'alignCenter']} useThemeColor>
            <GradientDotSvg/> 
            {currentCv.businessTrips === Answer.Yes ? t('cv_page_businesstrips') : t('cv_page_noBusinesstrips')}
          </P>
        }
      </PreviewItem>

      {currentCv.bio &&
        <PreviewItem 
        title={t('create_cv_about')} 
        onClick={() => props.onBack(2)}
        >
          <HtmlText text={currentCv.bio} className={styles.bio}/>
        </PreviewItem>
      }
      
        <PreviewItem 
        title={`${t('create_workExperience')} ${currentCv.experienceInfo.length && Formatter.fullTimeLine(currentCv.experienceInfo.map(el=> [el.fromDate, el.toDate]))}` }
        onClick={() => props.onBack(3)}
        >
          {currentCv.experienceInfo.length > 0 && 
            currentCv.experienceInfo.map(el=> {
              return <div className={styles.experience}>
                <P styleType={['w500', 'medium']} useThemeColor>{el.position}</P>
                <P styleType={['w500', 'medium']} useThemeColor>{el.company}</P>
                {el.description &&
                  <P styleType={['w500', 'medium']} useThemeColor>{el.description}</P>
                }
                <P styleType={['w500', 'medium']} useThemeColor>{el.fromDate} - {el.toDate||t('toPresent')}</P>
              </div>
            })
            ||
            <P styleType={['w500', 'medium']} useThemeColor>{t('workExperience_no')}</P>
          }
        </PreviewItem>

        <PreviewItem 
        title={t('create_education')}
        onClick={() => props.onBack(4)}
        > 
          <P styleType={['w500', 'medium']} useThemeColor className={styles.educationGrade}>{TranslateEducationType(currentCv.education, t)}</P>
          { currentCv.educationInfo?.length > 0 && 
            currentCv.educationInfo?.map(el=> {
              return <div className={styles.experience}>
                <P styleType={['w500', 'medium']} useThemeColor>{el.institution}</P>
                {el.speciality &&
                <P styleType={['w500', 'medium']} useThemeColor>{el.speciality}</P>
                }
                {el.faculty &&
                <P styleType={['w500', 'medium']} useThemeColor>{el.faculty}</P>
                }
                <P styleType={['w500', 'medium']} useThemeColor>{el.fromDate} - {el.toDate||t('toPresent')}</P>
              </div>
            })
          }
        </PreviewItem>

      {creationContext.helpObjects?.skills && creationContext.helpObjects?.skills?.size > 0 &&
        <PreviewItem 
        title={t('create_cv_skills')}
        onClick={() => props.onBack(5)}
        >
          <TagList tags={[...creationContext.helpObjects?.skills?.values()].map(el => ({name: el.title}))} />
        </PreviewItem>
      }

      {creationContext.helpObjects?.activeSources && creationContext.helpObjects?.activeSources?.size > 0 &&
        <PreviewItem title={t('cv_page_sources')} onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects?.activeSources?.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }      

      {creationContext.helpObjects?.activeGeos && creationContext.helpObjects?.activeGeos.size > 0 &&
        <PreviewItem title={t('cv_page_geos')} onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects?.activeGeos.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }

      {creationContext.helpObjects?.activeVerticals && creationContext.helpObjects?.activeVerticals?.size > 0 &&
        <PreviewItem title={t('cv_page_verticals')} onClick={()=>props.onBack(5)}>
          <TagList tags={[...creationContext.helpObjects?.activeVerticals?.values()].map(el => ({name: el.title}))}/>
        </PreviewItem>
      }


      {currentCv.languageKnowledges && currentCv.languageKnowledges?.length > 0 && 
        <PreviewItem 
        title={t('create_languageKnowledges')}
        onClick={() => props.onBack(5)}
        >
          <TagList tags={currentCv.languageKnowledges.map(el=>({name: TranslateLanguage(el.language, t) + ', ' + TranslateLanguageKnowLevel(el.level, true)}))} />
        </PreviewItem>
      }

      {(currentCv.portfolio || (currentCv.assets && currentCv.assets?.length > 0)) &&
        <PreviewItem 
        title={t('cv_page_portfolio')}
        onClick={() => props.onBack(5)}
        >
          {currentCv.portfolio &&
            <P styleType={['w500', 'medium']} useThemeColor>{currentCv.portfolio}</P>
          }
          {currentCv.assets?.length > 0 &&
            <FilesList previews={currentCv.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]}/>
          }
        </PreviewItem>
      }
    </div>

    <div className={styles.buttonsWrapper}>
      <Button styleType={['gradient']} title={'back'} onClick={()=>props.onBack()} className={styles.button}>{t('back')}</Button>
      {/* {currentCv.completedSteps && currentCv.completedSteps.length > 6 &&
        <Button styleType={['gradient', 'phoneWide']} altStyleType={['white']} title={'next'} onClick={()=>props.onBack()}  className={styles.button}>{t('publish')}</Button>
      } */}
    </div>
  </div>)
}