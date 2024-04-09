import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { PreviewImage } from 'data/interfaces/Common'
import { useRef, useState } from 'react'
import { usePersonalContext } from 'context/personal_state'
import FileInput from 'components/fields/FileInput'
import { useUserContext } from 'context/user_state'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import { ModalType, VacancyLookType } from 'types/enums'
import { IUserImageModalProps } from 'components/modals/UserImageModal'
import ArrowDownSvg from '@/components/svg/ArrowDownSvg'
import OptionsDropDown from '@/components/ui/OptionsDropDown'
import OptionsList from '@/components/ui/OptionsList'
import { useDetectOutsideClick } from '@/components/hooks/useDetectOutsideClick'
import { colors } from 'styles/variables'
import { TranslateVacancyLookType } from 'utils/enumsTranslations'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'

interface Props {
  isEditing?: boolean
  switchMode?: () => void
  save?: () => void
  isEditable?: boolean
  noHeader?: boolean
}

export default function PersonalCard(props: Props) {
  const {t} = useTranslation()
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [logoImage, setLogoImage] = useState<PreviewImage>()
  const userContext = useUserContext()
  const dropRef = useRef(null!)
  const [dropDown, openDropDown] = useDetectOutsideClick(dropRef, false)


  const saveHandler = () => {
    if (props.isEditing) {
      props.save()
    }
    props.switchMode()
  }

  const saveLogo = (data: PreviewImage) => {
    setLogoImage(data)
    if(data.data) {
      userContext.editCurrentProfile({logoId: data.data.id})
      .then(_=> {
      })
    }
  }

  const openUserImageModal = () => {
    appContext.showModal<IUserImageModalProps>(ModalType.UserImageModal, {onSave: (data) => {
      userContext.editCurrentProfile({imageId: data?.image?.data?.id, useOwnLogo: data.type === 'logo'?true: false})
      .then(res => {
        res&&personalContext.setCurrentProfile(res)
      })
    }})
  }

  const setVacancyLookType = (vacancyLookType: VacancyLookType) => {
    openDropDown(false)
    userContext.editCurrentProfile({vacancyLookType})
    .then(res=> {
      if(res) {
        personalContext.setCurrentProfile(res)
      }
    })
  }

  const optionsList = <OptionsList 
  options={[
    {
      title: TranslateVacancyLookType(VacancyLookType.ActivelyLooking, personalContext.currentProfile?.profileType, t), 
      onClick: ()=>setVacancyLookType(VacancyLookType.ActivelyLooking), 
      style:{color: colors.green, backgroundColor: colors.greenLight, borderRadius: 0}
    },
    {
      title: TranslateVacancyLookType(VacancyLookType.PassivelyLooking, personalContext.currentProfile?.profileType, t), 
      onClick: ()=>setVacancyLookType(VacancyLookType.PassivelyLooking), 
      style:{color: colors.yellow, whiteSpace: 'nowrap', backgroundColor: colors.yellowLight, borderRadius: 0}
    },
    {
      title: TranslateVacancyLookType(VacancyLookType.NotLooking, personalContext.currentProfile?.profileType, t), 
      onClick: ()=>setVacancyLookType(VacancyLookType.NotLooking), 
      style:{color: colors.red, backgroundColor: colors.redLight, borderRadius: 0}
    },
  ]} 
  onMouseLeave={()=>{}}/>

  return (<div className={classNames(styles.root, props.noHeader && styles.noHeader)}>
    <div className={styles.imageWrapper}>
    {(personalContext.currentProfile?.image||personalContext.currentProfile?.logo) && !logoImage && personalContext.currentProfile.profileType === ProfileType.Employee &&
      <UserPic 
      className={styles.userPic} 
      image={logoImage?.image?URL.createObjectURL(logoImage?.image):FILES + ((!personalContext.currentProfile.useOwnLogo&&personalContext?.currentProfile?.image?.source)||(personalContext.currentProfile.useOwnLogo&&personalContext?.currentProfile?.logo.source))} 
      size={152}
      />
      ||
      personalContext.currentProfile?.profileType === ProfileType.Hirer && personalContext.currentProfile?.logo && 
      <UserPic className={styles.userPic} image={logoImage?.image?URL.createObjectURL(logoImage?.image):FILES + personalContext?.currentProfile?.logo.source} size={152}/>
      ||
      props.isEditing && 
      <UserPic image={(logoImage?.image?URL.createObjectURL(logoImage?.image):logoImage?.data&&FILES + logoImage?.data?.source)||'/icons/photoCamera.svg'} className={styles.userPic} size={152}/>
      ||
      isTabletWidth && 
      <UserPic className={styles.userPic} size={188}/>
    }
    {
      props.isEditing && personalContext.currentProfile.profileType === ProfileType.Employee &&
      <Button onClick={openUserImageModal} styleType={['icon', 'backTransparent']} className={styles.photoButton}>
        {/* {!isTabletWidth && (personalContext.currentProfile?.image?'Изменить фото':'Добавить фото')} */}
       <EditPencilSvg/>
      </Button>
      ||
      props.isEditing && personalContext.currentProfile.profileType === ProfileType.Hirer &&
      <label>
      <FileInput setImages={(data)=> saveLogo(data)}/>
      <div  className={styles.photoButton}>
        {/* {!isTabletWidth && (personalContext.currentProfile?.logo?'Изменить логотип':'Добавить логотип')} */}
        <EditPencilSvg/>
      </div>
    </label>
    }
    </div>
    <div className={styles.nameWrapper}>
      <P useThemeColor styleType={['w600', 'huge']}>{personalContext?.currentProfile?.company||personalContext?.currentProfile?.firstName + ' ' + personalContext?.currentProfile?.lastName}</P>
      <P useThemeColor styleType={['w500', 'medium','greyLight']}>{personalContext.currentProfile.city.locName}</P>
    </div>

    {props.isEditing && personalContext.currentProfile.profileType === ProfileType.Employee &&
    <>
      <div className={styles.vacancyLookType}>
        <Button 
        styleType={['grey', 'wide']} 
        onClick={()=>openDropDown(true)} 
        className={classNames(styles.lookType, styles[personalContext.currentProfile.vacancyLookType])}>
          {TranslateVacancyLookType(personalContext.currentProfile.vacancyLookType, personalContext.currentProfile?.profileType, t)||'Выберите статус'} <ArrowDownSvg/>
        </Button>
        <div className={styles.optionsWrapper}>
          <OptionsDropDown 
          className={styles.options}
          options={optionsList} 
          active={dropDown} 
          getRef={(r)=> dropRef.current = r} 
          onClose={()=>{}}
          />
        </div>
      </div>
    </>}
    {/* <div className={styles.rating}>
      <p className={styles.ratingValue}>4.0</p>
      <RatingLine rating={4}/>
      <p className={styles.ratingCount}>23 отзыва</p>
    </div> */}
    {props.isEditable && !props.isEditing && !isTabletWidth &&
      <Button styleType={['gradient']} onClick={()=> saveHandler()}>{'Редактировать профиль'}</Button>
    }
  </div>)
}