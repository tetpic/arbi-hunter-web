import styles from './index.module.scss'

import Image from 'next/image'
import { FILES } from 'types/constants'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useAppContext } from 'context/state'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import DownloadCloudSvg from 'components/svg/DownloadCloudSvg'
// import FileInput from 'components/fields/FileInput'
// import { PreviewImage } from 'data/interfaces/Common'
import { useEffect, useState } from 'react'
import { usePersonalContext } from 'context/personal_state'
import { IBackgroundPickModalArguments } from 'components/modals/BackgroundPickModal'
import { ModalType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'

interface Props {
  isEditing?: boolean
}

export default function PersonalHeader(props: Props) {
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const userContext = useUserContext()
  const currentProfile = useUserContext().currentProfile
  const {isTabletWidth} = appContext.size
  const [backImage, setBackImage] = useState<IBackground>()
  const building = personalContext.backgrounds.get(BackgroundCategoryType.Buildings)

  const openBackgroundPickModal = () => {
    const cBack = personalContext.backgrounds.get(BackgroundCategoryType.Places) 
    const cBuild = personalContext.backgrounds.get(BackgroundCategoryType.Buildings)

    appContext.showModal<IBackgroundPickModalArguments>(ModalType.BackgroundPickModal, {
      currentBackground: cBack?.image|| null,
      currentBuild: cBuild?.image || null,
      hirerLogo: currentProfile.profileType === ProfileType.Hirer && currentProfile.logo,
      withBuildPicker: currentProfile.profileType === ProfileType.Hirer,
      onSave: (background, building) => {
        BackgroundRepository.setBackgrounds({backgroundsIds: [background?.id, building?.id].filter(Boolean)}, currentProfile.profileType)
        .then(_ => {
          personalContext.refreshBackgrounds()
        })
        if(currentProfile.profileType === ProfileType.Hirer) {
          userContext.editCurrentProfile({imageId: building?.image?.id||null})        
        }
      }
    })
  }

  const editingButton = (()=>{
    if(!isTabletWidth) {
      return <div className={styles.editButton} onClick={openBackgroundPickModal}>
      Изменить фон <EditPencilSvg/>
      {/* <FileInput setImages={setEditedImage}/> */}
      </div>
    }
    else {
      return <div className={styles.editButton}>
      <DownloadCloudSvg color='white'/>
      <div>
        <p>Изменить баннер</p>      
        <span>Фото, видео, gif</span>      
      </div>
      </div>
    }
  })()

  useEffect(()=>{
    setBackImage(personalContext.backgrounds.get(BackgroundCategoryType.Places))    
  }, [personalContext.backgrounds])


  return (<div className={styles.root}> 
    {backImage &&
    <Image 
    src={FILES + backImage.image.source} 
    className={styles.background} 
    alt={'back'} 
    width={1148} 
    height={300} />
    ||
    <Image 
    src={personalContext.currentProfile?.profileType===ProfileType.Hirer?'/images/cities/companyDefaultBack.png':'/images/rooms/coworking.png'} 
    className={styles.background} alt={'moscow'} 
    width={1148} 
    height={300} />
    }
    <div className={styles.personalImageWrapper}>
      {
      personalContext.currentProfile.profileType === ProfileType.Hirer 
      && building
      && personalContext.currentProfile.logo &&
      <>
        <Image 
        className={styles.building} 
        src={FILES + building.image.source} alt={''} 
        width={250} height={300}
        />
        <Image 
        className={styles.hirerLogo} 
        src={FILES + personalContext.currentProfile.logo.source} 
        style={{top: building.image.focalPoint.y*100 + '%', left: building.image.focalPoint.x*100 + '%'}}  
        alt={'logo'}
        width={54}
        height={54}
        />
      </>
      }
      {personalContext.currentProfile.profileType === ProfileType.Employee && personalContext.currentProfile.useOwnLogo &&
        <Image
        className={styles.userLogo}
        src={FILES + personalContext.currentProfile.logo.source}
        alt={'logo'}
        width={300}
        height={300}
        />
      }

    </div>
    {/* {personalContext.currentProfile?.image &&
      <Image 
      className={styles.userPic} 
      src={personalContext.currentProfile?.image&& FILES+ personalContext.currentProfile?.image.source} 
      alt={'user Picture'} 
      width={300} 
      height={300}/>
    } */}
    {props.isEditing &&  editingButton }
  </div>)
}