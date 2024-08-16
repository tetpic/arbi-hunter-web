import styles from './index.module.scss'

import Image from 'next/image'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useAppContext } from 'context/state'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import DownloadCloudSvg from 'components/svg/DownloadCloudSvg'
import { useEffect, useMemo, useState } from 'react'
import { usePersonalContext } from 'context/personal_state'
import { ModalType, Preset } from 'types/enums'
import { useUserContext } from 'context/user_state'
import BackgroundRepository from 'data/repositories/BackgroundsRepository'
import { BackgroundCategoryType, IBackground } from 'data/interfaces/IBackground'
import Rive from '@rive-app/react-canvas'
import ThreeModelVariant from '../../three'
import classNames from 'classnames'
import { useCharacterContext } from 'context/character_state'
import { ModelActions } from '../../profile/userProfile/UserEditor'
import { IBackgroundSwitchModalArgs } from '@/components/modals/BackgroundSwitchModal'
import { IBackgroundPickModalArguments } from '@/components/modals/BackgroundPickModal'
import useTranslation from 'next-translate/useTranslation'
import ImageHelper from 'utils/ImageHelper'
import ArrowLeftSvg from '@/components/svg/ArrowLeftSvg'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/router'
import P from '@/components/ui/P'
import PlusThinSvg from '@/components/svg/PlusThinSvg'

interface Props {
  isEditing?: boolean
  useModel?: boolean
  showNextAnimation?: () => void
  action?: ModelActions 
  showMobileBack?: boolean
  isMy?: boolean
  initialBackground?: IBackground
}

export default function PersonalHeader(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const userContext = useUserContext()
  const characterContext = useCharacterContext()
  const router = useRouter()
  const currentProfile = useUserContext().currentProfile
  const {isTabletWidth} = appContext.size
  const [backImage, setBackImage] = useState<IBackground>(props.initialBackground||personalContext.backgrounds?.get(BackgroundCategoryType.Places))
  const building = personalContext.backgrounds?.get(BackgroundCategoryType.Buildings)||undefined
  const profileType = personalContext?.currentProfile?.profileType

  const openBackgroundPickModal = () => {
    const cBack = personalContext.backgrounds.get(BackgroundCategoryType.Places) 
    const cBuild = personalContext.backgrounds.get(BackgroundCategoryType.Buildings)
    const _args: IBackgroundSwitchModalArgs = {
      onSave: (data) => {
        if(data.type === 'place') {
          setTimeout(()=> {
            const _pickModalArgs:IBackgroundPickModalArguments =  {
              currentBackground: cBack?.image|| null,
              currentBuild: cBuild?.image || null,
              hirerLogo: currentProfile?.profileType === ProfileType.Hirer && currentProfile?.logo,
              buildPicker: false,
              onSave: (background, _) => {      
                BackgroundRepository.setBackgrounds({backgroundsIds: [background?.id, cBuild?.id].filter(Boolean)}, currentProfile?.profileType)
                .then(_ => {
                  personalContext.refreshBackgrounds()
                })
                if(currentProfile?.profileType === ProfileType.Hirer) {
                  userContext.editCurrentProfile({useOwnLogo: false})        
                }
              }
            }
            isTabletWidth
            ?appContext.showBottomSheet<IBackgroundPickModalArguments>(ModalType.BackgroundPickModal, _pickModalArgs, 370)
            :appContext.showModal<IBackgroundPickModalArguments>(ModalType.BackgroundPickModal, _pickModalArgs)
          }, 100)
        }
        else if(data.type === 'building') {
          setTimeout(()=> {
            const _args:IBackgroundPickModalArguments =  {
              currentBackground: cBack?.image|| null,
              currentBuild: cBuild?.image || null,
              hirerLogo: currentProfile?.profileType === ProfileType.Hirer && currentProfile?.logo,
              buildPicker: true,
              onSave: (_, building) => {    
                BackgroundRepository.setBackgrounds({backgroundsIds: [cBack?.id, building?.id].filter(Boolean)}, currentProfile?.profileType)
                .then(_ => {
                  personalContext.refreshBackgrounds()
                })
                if(currentProfile?.profileType === ProfileType.Hirer) {
                  userContext.editCurrentProfile({imageId: building?.image?.id||null})        
                }
              }
            }
            isTabletWidth
            ?appContext.showBottomSheet<IBackgroundPickModalArguments>(ModalType.BackgroundPickModal, _args, 370)
            :appContext.showModal<IBackgroundPickModalArguments>(ModalType.BackgroundPickModal, _args)
          }, 100)
        }
        else if(data.type === 'custom' && data.image) {
          BackgroundRepository.createBackground({imageId: data.image?.data?.id, profileType: currentProfile?.profileType, backgroundType: 'png', categoryId: BackgroundCategoryType.Places})
          .then(res => {
            BackgroundRepository.setBackgrounds({backgroundsIds: [res.id, building?.id].filter(Boolean)}, currentProfile?.profileType)
            .then(r=> {               
              personalContext.refreshBackgrounds()
              if(userContext.currentProfile?.profileType === ProfileType.Hirer) {                  
                userContext.editCurrentProfile({useOwnLogo: true})        
              }
            })
          })
        }          
      },
      currentBackground: cBack||null,
    }
    isTabletWidth
    ?appContext.showBottomSheet<IBackgroundSwitchModalArgs>(ModalType.BackgroundSwitchModal, _args, 370)
    :appContext.showModal<IBackgroundSwitchModalArgs>(ModalType.BackgroundSwitchModal,_args)
  }

  const editingButton = (()=>{
    if(!isTabletWidth) {
      return <div className={styles.editButton} onClick={() => openBackgroundPickModal()}>
      {t('personal_changeBackground')} <EditPencilSvg/>
      </div>
    }
    else {
      return <div className={styles.editButton} onClick={() =>openBackgroundPickModal()}>
      <DownloadCloudSvg color='white'/>
      <div>
        <p>{t('personal_changeBanner')}</p>      
        <span>{t('personal_photoVideoGif')}</span>      
      </div>
      </div>
    }
  })()

  useEffect(()=>{
    if(personalContext.backgrounds) {
      setBackImage(personalContext.backgrounds?.get(BackgroundCategoryType.Places))  
    }
  }, [personalContext.backgrounds])

  const transportRive = useMemo(()=>{
    if(!personalContext.transport) return null
    return <Rive 
    stateMachines={'State Machine 1'}  
    key={personalContext.transport.id} 
    className={styles.transport} 
    src={ImageHelper.urlFromSource(personalContext.transport.image?.source)} 
    animations={personalContext.transport.riveKeys.map(el=> el.key)}
    />
  }, [personalContext.transport])

  const weatherRive = useMemo(()=>{
    if(!personalContext.weather) return null
    return <Rive 
    stateMachines={'State Machine 1'} 
    key={personalContext.weather.id} 
    className={styles.rive} 
    src={ImageHelper.urlFromSource(personalContext.weather.image?.source)} 
    animations={personalContext.weather.riveKeys.map(el=> el.key)}
    />
  }, [personalContext.weather])

  return (<div className={styles.root}> 
    {props.isMy &&  !characterContext.currentCharacter.current && !personalContext.currentProfile.image &&
      <div className={styles.characterBanner} onClick={() => router.push({pathname: '/profile', query: {page: 'edit'}})}>
        <div className={styles.addCharButton}>
          <Button styleType={['circle', 'icon', 'white', 'invertSvg']}><PlusThinSvg/></Button>
        </div>
        <P styleType={['w600', 'large']}>Создайте своего уникального персонажа</P>
      </div>
    }
    {isTabletWidth && props.showMobileBack &&
      <Button 
      styleType={['black', 'icon']} 
      altStyleType={['whitePurple', 'icon', 'invertSvg']} 
      className={styles.back} 
      onClick={router.back}
      >
        <ArrowLeftSvg/>
      </Button>
    }
    {backImage && profileType===ProfileType.Hirer &&
    <div className={styles.backWrapper}>
      <Image 
      unoptimized
      priority
      src={ImageHelper.urlFromFile(backImage.image, Preset.xlResize)} 
      className={styles.background} 
      alt={'back'} 
      width={1148} 
      height={300} />
    </div>
    ||
    backImage && profileType===ProfileType.Employee &&
    <div className={styles.backWrapper}>
      <Image 
      unoptimized
      priority
      src={ImageHelper.urlFromFile(backImage.image, Preset.xlResize)} 
      className={styles.background} 
      alt={'back'} 
      width={1148} 
      height={300} />
    </div>
    ||
    <div className={styles.backWrapper}>
      <Image 
      src={personalContext.currentProfile?.profileType===ProfileType.Hirer
        ?'/images/cities/newyork.png'
        :'/images/rooms/coworking.png'
      }       
      className={styles.background} alt={'moscow'} 
      width={1148} 
      height={300} />
    </div>
    }

    {backImage 
    && personalContext.transport 
    && profileType===ProfileType.Hirer 
    && transportRive}

    {backImage 
    && personalContext.weather 
    && profileType===ProfileType.Hirer 
    && weatherRive}

    <div className={classNames(props.useModel?styles.personalModel:styles.personalImageWrapper, personalContext.loading && styles.loading)}>
      {
      personalContext.currentProfile?.profileType === ProfileType.Hirer 
      && building
      && personalContext.currentProfile?.logo &&
      <>
        <Image 
        unoptimized
        className={styles.building} 
        src={ImageHelper.urlFromFile(building.image, Preset.sResize)} alt={''} 
        width={250} height={300}
        />
        <Image 
        unoptimized
        className={styles.hirerLogo} 
        src={ImageHelper.urlFromFile(personalContext.currentProfile.logo, Preset.xsCrop)} 
        style={{top: building.image.focalPoint.y*100 + '%', left: building.image.focalPoint.x*100 + '%'}}  
        alt={'logo'}
        width={54}
        height={54}
        />
      </>
      }
      {personalContext.currentProfile?.profileType === ProfileType.Employee 
      && personalContext.currentProfile.useOwnLogo && !props.useModel && personalContext.currentProfile?.logo &&
        <Image
        unoptimized
        className={styles.userLogo}
        src={ImageHelper.urlFromFile(personalContext.currentProfile.logo, Preset.smCrop)}
        alt={'logo'}
        width={370}
        height={370}
        />
        ||
        personalContext.currentProfile?.profileType === ProfileType.Employee 
        && personalContext.currentProfile.useOwnLogo && props.useModel && characterContext.isCharacterExistAndBought &&
        <div className={styles.modelWrapper} >
          <div onClick={()=> props.showNextAnimation()} className={classNames(styles.model, characterContext.modelLoaded&&styles.model_active) }>
          {characterContext.variant &&  characterContext.dataLoaded &&
            <ThreeModelVariant disableControls  data={characterContext.variant } actions={props.action} r={0}/> 
          }
        </div>
      </div>
      }
    </div>
    {props.isEditing &&  editingButton }
  </div>)
}