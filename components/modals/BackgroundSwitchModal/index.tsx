import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import classNames from 'classnames'
import UserPic from '@/components/ui/UserPic'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { useState } from 'react'
import { PreviewImage } from 'data/interfaces/Common'
import { FILES } from 'types/constants'
import FileInput from '@/components/fields/FileInput'
import Button from '@/components/ui/Button'
import { IBackground } from 'data/interfaces/IBackground'
import Image from 'next/image'
import PhotoCameraSvg from '@/components/svg/PhotoCameraSvg'
import { ProfileType } from 'data/interfaces/IRegistration'

interface Props {
  onClose: () => void
}

export interface IBackgroundSwitchModalArgs {
  onSave: (data: {image: PreviewImage, type?: 'place'|'custom'}) => void
  currentBackground?: IBackground
}

export default function BackgroundSwitchModal(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const args: IBackgroundSwitchModalArgs = appContext.modalArguments
  
  const [type, setType] = useState<'place'|'custom'>(userContext.currentProfile?.useOwnLogo? 'custom' :'place')
  const [image, setImage] = useState<PreviewImage>(userContext.currentProfile.profileType === ProfileType.Hirer&& userContext.currentProfile.useOwnLogo && args.currentBackground &&{data: args.currentBackground?.image, id: args.currentBackground?.imageId, loaded: true})

  const onSave = () => {
    args.onSave({image, type})
    props.onClose()    
  }

  const body = (    
  <div className={styles.root}>
    <div className={styles.switcher}>
      <div className={classNames(styles.item, type==='place' && styles.active)} onClick={()=>setType('place')}>
        <Image src={'/images/cities/cityPreview.png'} 
        className={styles.customBack}
        alt={'user custom background'}
        width={500}
        height={200}
        />

        <UserPic 
        className={styles.userPic}
        size={88}
        image={'/images/cities/cityPreview.png'}
        />
        <p>Индивидуальный фон</p>
      </div>
      <label className={classNames(styles.item, type==='custom' && styles.active)} onClick={()=>setType('custom')}>
        <FileInput setImages={setImage} accept={['image/png', 'image/jpeg']}/>
        {(image?.data?.source) &&
           <Image src={
            image? 
            (image?.data?FILES + image?.data?.source:URL.createObjectURL(image.image)) 
            : userContext.currentProfile.useOwnLogo
            &&FILES+args.currentBackground?.image?.source
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
        {/* <UserPic
        className={styles.userPic}
        size={88}
        image={image? 
          (image?.data?FILES + image?.data?.source:URL.createObjectURL(image.image)) 
          : userContext.currentProfile.useOwnLogo
          &&FILES+args.currentBackground.image.source}
        /> */}
        <p>Загрузить фото</p>
      </label>
    </div>
    <div className={styles.buttonsWrapper}>
      <Button className={styles.button} onClick={props.onClose}>
        Отмена
      </Button>
      <Button className={styles.buttonGradient} onClick={()=>onSave()}>
        Применить
      </Button>
    </div>
  </div>    
  )

  return (<ModalLayout  className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}

function setType(arg0: string): void {
  throw new Error('Function not implemented.')
}
