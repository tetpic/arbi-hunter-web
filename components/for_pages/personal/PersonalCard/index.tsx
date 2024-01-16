import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { PreviewImage } from 'data/interfaces/Common'
import { useState } from 'react'
import { usePersonalContext } from 'context/personal_state'
import FileInput from 'components/fields/FileInput'
import { useUserContext } from 'context/user_state'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import { ModalType } from 'types/enums'
import { IUserImageModalProps } from 'components/modals/UserImageModal'

interface Props {
  isEditing?: boolean
  switchMode?: () => void
  save?: () => void
  isEditable?: boolean
}

export default function PersonalCard(props: Props) {
  const personalContext = usePersonalContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const [logoImage, setLogoImage] = useState<PreviewImage>()
  const userContext = useUserContext()

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
    }})
  }

  return (<div className={styles.root}> 
    <div className={styles.imageWrapper}>
    {(personalContext.currentProfile?.image||personalContext.currentProfile?.logo) && !logoImage && personalContext.currentProfile.profileType === ProfileType.Employee &&
      <UserPic 
      className={styles.userPic} 
      image={logoImage?.image?URL.createObjectURL(logoImage?.image):FILES + ((!personalContext.currentProfile.useOwnLogo&&personalContext?.currentProfile?.image?.source)||(personalContext.currentProfile.useOwnLogo&&personalContext?.currentProfile?.logo.source))} 
      size={188}
      />
      ||
      personalContext.currentProfile?.profileType === ProfileType.Hirer && personalContext.currentProfile?.logo && 
      <UserPic className={styles.userPic} image={logoImage?.image?URL.createObjectURL(logoImage?.image):FILES + personalContext?.currentProfile?.logo.source} size={188}/>
      ||
      props.isEditing && 
      <UserPic image={(logoImage?.image?URL.createObjectURL(logoImage?.image):logoImage?.data&&FILES + logoImage?.data?.source)||'/icons/photoCamera.svg'} className={styles.userPic} size={188}/>
      ||
      isTabletWidth && 
      <UserPic className={styles.userPic} size={188}/>
    }
    {
      props.isEditing && personalContext.currentProfile.profileType === ProfileType.Employee &&
      <Button onClick={openUserImageModal} className={styles.photoButton}>
        {!isTabletWidth && (personalContext.currentProfile?.image?'Изменить фото':'Добавить фото')}
        {isTabletWidth && <EditPencilSvg/>}
      </Button>
      ||
      props.isEditing && personalContext.currentProfile.profileType === ProfileType.Hirer &&
      <label>
      <FileInput setImages={(data)=> saveLogo(data)}/>
      <div  className={styles.photoButton}>
        {!isTabletWidth && (personalContext.currentProfile?.logo?'Изменить логотип':'Добавить логотип')}
        {isTabletWidth && <EditPencilSvg/>}
      </div>
    </label>
    }
    </div>
    
    <p className={styles.name}>{personalContext?.currentProfile?.company||personalContext?.currentProfile?.firstName + ' ' + personalContext?.currentProfile?.lastName}</p>
    {/* <div className={styles.rating}>
      <p className={styles.ratingValue}>4.0</p>
      <RatingLine rating={4}/>
      <p className={styles.ratingCount}>23 отзыва</p>
    </div> */}
    {props.isEditable &&
      <Button className={styles.button} onClick={()=> saveHandler()}>{props.isEditing?'Сохранить':'Редактировать профиль'}</Button>
    }
  </div>)
}