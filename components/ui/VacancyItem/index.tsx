import styles from './index.module.scss'

import { IVacancy } from 'data/interfaces/IVacancy'
import SalaryItem from 'components/ui/SalaryItem'
import Button from 'components/ui/Button'
import Formatter from 'utils/formatter'
import Image from 'next/image'
import { useAppContext } from 'context/state'
import { ActivityStatus,  AppTheme,  ApplicationStatus, InterfaceLanguage, ModalType, Preset, ProposalRequestType } from 'types/enums'
import { useCvContext } from 'context/cv_state'
import { IApplicationModalProps } from 'components/modals/ApplicationModal'
import VacancyRepository from 'data/repositories/VacancyRepository'
import classNames from 'classnames'
import Link from 'next/link'
import UserPic from '../UserPic'
import useAbortController from 'components/hooks/useAbortController'
import P from '../P'
import { TranslateWorkExperience } from 'utils/enumsTranslations'
import BriefCaseSvg from '@/components/svg/BriefCaseSvg'
import FavoritesButton from '../FavoritesButton'
import ChatRepository from 'data/repositories/ChatRepository'
import { useRouter } from 'next/router'
import ImageHelper from 'utils/ImageHelper'
import useTranslation from 'next-translate/useTranslation'
import { colors } from 'styles/variables'
import { AppMetricaEvent, sendToMetrika } from 'utils/sendToMetrics'
import { useUserContext } from 'context/user_state'

interface Props {
  vacancy?: IVacancy
  onChangeItem?: (v?: IVacancy) => void
  smallCard?: boolean
}

export default function VacancyItem({vacancy, onChangeItem, smallCard}: Props) {
  const {t, lang} = useTranslation()
  const appContext = useAppContext()
  const userContext = useUserContext()
  const {isTabletWidth} = appContext.size
  const cvContext = useCvContext()
  const {getNewSignal} = useAbortController()
  const router = useRouter()
  const lastProposal = vacancy.proposalsToCurrentUser?.[vacancy.proposalsToCurrentUser?.length -1]||null
  const isLightTheme = appContext.theme === AppTheme.Light


  const respondHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(!userContext.isLogged) {
      router.push('/login')
    }
    else {
      const _args:IApplicationModalProps = {
        cvs: cvContext.savedCvs.filter(el => el.published), 
        vacancy: vacancy,
        onSet: () => {
          onChangeItem(vacancy)
        }
      } 
      isTabletWidth
      ?appContext.showBottomSheet<IApplicationModalProps>(ModalType.ApplicationModal, _args, _args.cvs.length > 1 ? undefined : 180)
      :appContext.showModal<IApplicationModalProps>(ModalType.ApplicationModal, _args)
    }
  }

  const openChat = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const activeChat = vacancy.proposalsToCurrentUser.filter(el => el.type !== ProposalRequestType.Rejection&&el.status === ApplicationStatus.Applied)
    if(activeChat[0]){
      ChatRepository.getChatByContactId(vacancy.profile.id, {proposalId: lastProposal.id})
      .then(res=>{
        if(res) {
          router.push('/messenger?chat=' + res.id)
        }
      })
    }
  }

  const likeHandler = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const[signal] = getNewSignal('likeHandler')
    if(!vacancy.isSavedByCurrentProfile) {
      sendToMetrika(AppMetricaEvent.AddToSaved)
      VacancyRepository.addVcToSaved(vacancy.id, {signal})
      .then(_=> {
        onChangeItem&&onChangeItem(vacancy)
      })
      .catch(_=>{})
    }
    else {
      VacancyRepository.removeVcFromSaved(vacancy.id, {signal})
      .then(_=> {
        onChangeItem&&onChangeItem(vacancy)
      })
      .catch(_=>{})
    }
  }


  return (<Link 
  className={classNames(styles.item, isLightTheme && styles.item_light, vacancy.subscriptions?.tariff?.key.includes('Vip')&&styles.VIP)} 
  //@ts-ignore
  style={{'--gradientColor1': '#'+vacancy.subscriptions?.tariff?.colors[0]+'20', '--gradientColor2':'#'+vacancy.subscriptions?.tariff?.colors[1]+'20'}}
  href={'/vacancy/'+vacancy.id}> 
    <FavoritesButton styleType={['icon', 'grey']} className={styles.heartButton} isActive={vacancy.isSavedByCurrentProfile} onClick={likeHandler}/>
   
    <div className={styles.top}>
      <div className={ styles.card}>
        {smallCard &&
          <UserPic straightSizes className={styles.userPic} image={ImageHelper.urlFromFile(vacancy.profile.logo, Preset.iconCrop)} size={42}/>
        }
        <P 
        styleType={['large', 'w600']} 
        className={styles.name}
        useThemeColor
        >
          {vacancy.company||vacancy.contactName}
        </P>
        {vacancy.city && vacancy.city.locName && !vacancy.isRemote &&
          <p className={styles.city}>г. {vacancy.city?.locName}</p>
        }
      </div>

      <P useThemeColor styleType={['large', 'w600']} className={styles.name}>
        {vacancy.name}
      </P>
      {Number(vacancy.totalApplications) === 0 &&
        <P styleType={['purple', 'small']} className={styles.firstApp}>Откликнитесь первым!</P>
      }

      
      <P 
      styleType={['alignCenter', 'medium', 'w500']}
      useThemeColor
      >
        <BriefCaseSvg color={isLightTheme&&colors.black} className={styles.briefCase}/> Опыт {TranslateWorkExperience(vacancy.experience, t).toLowerCase()
      }
      </P>

      <SalaryItem vacancy={vacancy}/>
      <P  styleType={['medium', 'w500', 'greyLight']} >Опубликовано {Formatter.formatDate(vacancy.publishedAt, {timeOptions: {hour: 'numeric', minute: 'numeric'}, lang: lang as InterfaceLanguage})}</P>
      {vacancy?.profile?.activityStatus && !smallCard &&
        <p className={styles.activityStatus}>
          <span className={classNames(styles.dot, vacancy.profile.activityStatus === ActivityStatus.Online?styles.dot_green:styles.dot_red)}></span>
          {vacancy.profile.activityStatus === ActivityStatus.Online?'В сети':`Был в сети ${Formatter.formatDateRelative(vacancy.profile.lastActivityAt)}`}
        </p>
      }
      {vacancy.proposalsToCurrentUser?.length > 0 && lastProposal?.type !== ProposalRequestType.Rejection &&
        <P  styleType={['medium', 'w500']} className={styles.greenBadge} > Вас пригласили!</P>
        ||
        lastProposal?.type === ProposalRequestType.Rejection &&
        <P styleType={['medium', 'w500']} className={styles.redBadge}> Вам отказали</P>
      }
      <div className={styles.buttonsWrapper}>
        {lastProposal&&lastProposal?.type !== ProposalRequestType.Rejection &&
          <Button 
          styleType={['gradient', 'phoneWide']}
          onClick={openChat}
          >Перейти в чат</Button>
        }
        {!lastProposal &&
          <Button 
          styleType={['gradient', 'phoneWide']}
          onClick={respondHandler}
          >
            Откликнуться
          </Button>
        }
        {vacancy.showContactName && 
          <Button 
          styleType={['black', 'borderBlue', 'phoneWide', 'backTransparent']}
          altStyleType={['whitePurple', 'borderBlue', 'phoneWide']}
          >
            Контакты
          </Button>
        }
      </div>
    </div>
    {!smallCard &&
      <div className={(vacancy?.profile?.logo && vacancy.profile.image)?styles.buildWrapper:styles.imageWrapper}>
        {vacancy?.profile?.logo && !vacancy.profile.image &&
          <Image 
          unoptimized
          className={styles.image} 
          src={ImageHelper.urlFromFile(vacancy?.profile?.logo, Preset.xsResize)} 
          alt={'def image'} 
          width={150} 
          height={150}/>          
          ||
          vacancy?.profile?.logo && vacancy.profile.image && 
          <>
            <Image 
            unoptimized
            className={styles.build} 
            src={ImageHelper.urlFromFile(vacancy?.profile?.image, Preset.sResize)} 
            alt='build' 
            priority
            width={256} height={300}
            />
            <Image 
            unoptimized
            className={styles.logo} 
            src={ImageHelper.urlFromFile(vacancy?.profile?.logo, Preset.smallIconCrop)} 
            alt={'def image'} 
            priority
            style={{top: vacancy?.profile?.image.focalPoint.y*100 + '%', left: vacancy?.profile?.image.focalPoint.x*100 + '%'}} 
            width={60} height={60}/>
          </>
          ||
          <Image className={styles.defaultImage} src={'/icons/defaultUser.svg'} alt={'def image'} width={150} height={150}/>
        }
      </div>
    }
   
  </Link>)
}