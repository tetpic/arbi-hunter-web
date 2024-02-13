import styles from './index.module.scss'

import Image from 'next/image'
import { FILES } from 'types/constants'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useAppContext } from 'context/state'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import DownloadCloudSvg from 'components/svg/DownloadCloudSvg'
import { useEffect, useMemo, useState } from 'react'
import { usePersonalContext } from 'context/personal_state'
import { IBackgroundPickModalArguments } from 'components/modals/BackgroundPickModal'
import { ModalType } from 'types/enums'
import { useUserContext } from 'context/user_state'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import Rive from '@rive-app/react-canvas'
import ThreeModelVariant from '../../three'
import classNames from 'classnames'
import { useCharacterContext } from 'context/character_state'
import Spinner from '@/components/ui/Spinner'
import { ModelActions } from '../../profile/userProfile/UserEditor'

interface Props {
  isEditing?: boolean
  useModel?: boolean
  showNextAnimation?: () => void
  action?: ModelActions 
}

export default function PersonalHeader(props: Props) {
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const userContext = useUserContext()
  const characterContext = useCharacterContext()
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

  const transportRive = useMemo(()=>{
    if(!personalContext.transport) return null
    return <Rive stateMachines={'State Machine 1'}  key={personalContext.transport.id} className={styles.transport} src={FILES + personalContext.transport.image.source} animations={personalContext.transport.riveKeys.map(el=> el.key)}/>
  }, [personalContext.transport])

  const weatherRive = useMemo(()=>{
    if(!personalContext.weather) return null
    return <Rive stateMachines={'State Machine 1'} key={personalContext.weather.id} className={styles.rive} src={FILES + personalContext.weather.image.source} animations={personalContext.weather.riveKeys.map(el=> el.key)}/>
  }, [personalContext.weather])


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
    {backImage && personalContext.transport && transportRive}
    {backImage && personalContext.weather && weatherRive}
    <div className={props.useModel?styles.personalModel:styles.personalImageWrapper}>
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
      {personalContext.currentProfile.profileType === ProfileType.Employee && personalContext.currentProfile.useOwnLogo && !props.useModel &&
        <Image
        className={styles.userLogo}
        src={FILES + personalContext.currentProfile.logo.source}
        alt={'logo'}
        width={300}
        height={300}
        />
        ||
        personalContext.currentProfile.profileType === ProfileType.Employee && personalContext.currentProfile.useOwnLogo && props.useModel &&
        <div className={styles.modelWrapper} >
          {!characterContext.modelLoaded && 
            <Spinner className={styles.modelSpinner} size={52}/>
          } 
          <div onClick={()=> props.showNextAnimation()} className={classNames(styles.model, characterContext.modelLoaded&&styles.model_active) }>
          {characterContext.variant &&  characterContext.dataLoaded &&
            <ThreeModelVariant disableControls data={characterContext.variant } actions={props.action}  r={4}/> 
          }
        </div>
      </div>
  
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