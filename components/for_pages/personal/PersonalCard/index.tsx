import styles from './index.module.scss'

import UserPic from 'components/ui/UserPic'
import { FILES } from 'types/constants'
// import RatingLine from 'components/ui/RatingLine'
import Button from 'components/ui/Button'
import { useAppContext } from 'context/state'
import { ProfileType } from 'data/interfaces/IRegistration'
import { PreviewImage } from 'data/interfaces/Common'
import { useState } from 'react'
import { usePersonalContext } from 'context/personal_state'

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

  const saveHandler = () => {
    if (props.isEditing) {
      props.save()
    }
    props.switchMode()
  }

  return (<div className={styles.root}> 
    {(personalContext.currentProfile?.image) && 
      <UserPic className={styles.userPic} image={FILES + personalContext.currentProfile.image.source} size={188}/>
      ||
      (props.isEditing && !isTabletWidth) && <UserPic image={'/icons/photoCamera.svg'} className={styles.userPic} size={188}/>
      ||
      isTabletWidth && <UserPic className={styles.userPic} size={188}/>
    }
    {
    props.isEditing && !isTabletWidth && personalContext.currentProfile.profileType === ProfileType.Employee &&
    <Button  className={styles.photoButton}>{personalContext.currentProfile?.image?'Изменить фото':'Добавить фото'}</Button>
    ||
    props.isEditing && !isTabletWidth && personalContext.currentProfile.profileType === ProfileType.Hirer &&
    <Button className={styles.photoButton}>{personalContext.currentProfile?.image?'Изменить логотип':'Добавить логотип'}</Button>
    }
    
    <p className={styles.name}>{personalContext.currentProfile?.company||personalContext.currentProfile.firstName + ' ' + personalContext.currentProfile.lastName}</p>
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