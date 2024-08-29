import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import classNames from 'classnames'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { useState } from 'react'
import { PreviewImage } from 'data/interfaces/Common'
import FileInput from '@/components/fields/FileInput'
import Button from '@/components/ui/Button'
import { IBackground } from 'data/interfaces/IBackground'
import Image from 'next/image'
import PhotoCameraSvg from '@/components/svg/PhotoCameraSvg'
import { ProfileType } from 'data/interfaces/IRegistration'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'
import SwiperList from '@/components/ui/SwiperList'
import P from '@/components/ui/P'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface IBackgroundSwitchModalArgs {
  onSave: (data: {image: PreviewImage, type?: 'place'|'custom'|'building'}) => void
  currentBackground?: IBackground
  currentBuilding?: IBackground
}

export default function BackgroundSwitchModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const userContext = useUserContext()
  const args: IBackgroundSwitchModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments
  
  const [type, setType] = useState<'place'|'custom'|'building'>(userContext.currentProfile?.useOwnLogo? 'custom' :'place')
  const [image, setImage] = useState<PreviewImage>(userContext.currentProfile?.profileType === ProfileType.Hirer&& userContext.currentProfile.useOwnLogo && args.currentBackground &&{data: args.currentBackground?.image, id: args.currentBackground?.imageId, loaded: true})

  const onSave = () => {
    args.onSave({image, type})
    props.onClose()    
  }
  
  const backBlock = (
    <div 
    className={classNames(styles.item, type==='place' && styles.active)} 
    onClick={()=>{
      args.onSave({image, type:'place'})
      props.onClose()    
    }}
    >
      <Image src={userContext.currentProfile.profileType === ProfileType.Hirer?'/images/cities/cityPreview2.png':'/images/rooms/home.png'} 
      className={styles.customBack}
      alt={'user custom background'}
      width={500}
      height={200}
      />
    <P useThemeColor>{t('personal_customBackground')}</P>
  </div>
  )

  const buildBlock = (
    <div className={classNames(styles.item)} 
    onClick={()=>{
      args.onSave({image, type:'building'})
      props.onClose()    
    }}
    >
      <Image src={'/images/buildings/building2.png'} 
      className={styles.customBack}
      alt={'user custom build'}
      width={500}
      height={200}
      />
      <P useThemeColor>{t('personal_changeBuilding')}</P>
    </div>
  )

  const avatarBlock = (
    <label className={classNames(styles.item, type==='custom' && styles.active)} onClick={()=>setType('custom')}>
    <FileInput setImages={setImage} accept={['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/heic']}/>
    {(image?.data?.source) &&
      <Image 
      unoptimized
       src={
        image? 
        (image?.data?ImageHelper.urlFromFile(image?.data, Preset.smResize):URL.createObjectURL(image.image)) 
        : userContext.currentProfile.useOwnLogo
        &&ImageHelper.urlFromFile(args.currentBackground?.image, Preset.smResize)
      } 
      className={styles.customBack}
      alt={'user custom background'}
      width={500}
      height={200}
      />
      ||
     
      <div className={styles.emptyPhoto}>
        <PhotoCameraSvg color='#7C7C8C'/>
      </div>
    }
    <P useThemeColor>{t('personal_uploadPhoto')}</P>
  </label>
  )

  const body = (    
  <div className={styles.root}>
    <div className={styles.switcher}>
      {isTabletWidth && userContext.currentProfile.profileType === ProfileType.Hirer &&
        <SwiperList swiperProps={{
          loop: false
        }}>
          {[backBlock, userContext.currentProfile.profileType === ProfileType.Hirer && buildBlock, avatarBlock].filter(Boolean)}
        </SwiperList>
        ||
        <>
          {backBlock}
          {userContext.currentProfile.profileType === ProfileType.Hirer && buildBlock}
          {avatarBlock}
        </>
      }

    </div>
    <div className={styles.buttonsWrapper}>
      <Button styleType={['black', 'whiteText', 'phoneWide']} altStyleType={['white', 'phoneWide']} onClick={props.onClose}>
        {t('cancelAlt')}
      </Button>
      <Button styleType={['gradient', 'phoneWide']} onClick={()=>onSave()}>
        {t('apply')}
      </Button>
    </div>
  </div>    
  )

  if(props.isBottomSheet) {
    return <BottomSheetLayout>
      <BottomSheetBody>
        {body}
      </BottomSheetBody>
    </BottomSheetLayout>
  }

  return (<ModalLayout  className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}

function setType(arg0: string): void {
  throw new Error('Function not implemented.')
}
