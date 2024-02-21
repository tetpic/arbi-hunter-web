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

interface Props {
  onClose: () => void
}

export interface IBackgroundSwitchModalArgs {
  onSave: (data: {image: PreviewImage, type?: 'city'|'custom'}) => void
  currentBackground?: IBackground
}

export default function BackgroundSwitchModal(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const args: IBackgroundSwitchModalArgs = appContext.modalArguments
  const [type, setType] = useState<'city'|'custom'>(userContext.currentProfile?.useOwnLogo? 'custom' :'city')
  const [image, setImage] = useState<PreviewImage>()

  const onSave = () => {
    args.onSave({image, type})
    props.onClose()    
  }

  const body = (    
  <div className={styles.root}>
    <div className={styles.switcher}>
      <div className={classNames(styles.item, type==='city' && styles.active)} onClick={()=>setType('city')}>
        <UserPic 
        className={styles.userPic}
        size={88}
        image={'/images/cities/cityPreview.png'}
        />
        <p>Индивидуальный фон</p>
      </div>
      <label className={classNames(styles.item, type==='custom' && styles.active)} onClick={()=>setType('custom')}>
        <FileInput setImages={setImage}/>
        <Image src={
          image? 
          (image?.data?FILES + image?.data?.source:URL.createObjectURL(image.image)) 
          : userContext.currentProfile.useOwnLogo
          &&FILES+args.currentBackground.image.source
        } 
        alt={'user custom background'}
        width={160}
        height={160}
        />
        <UserPic
        className={styles.userPic}
        size={88}
        image={image? 
          (image?.data?FILES + image?.data?.source:URL.createObjectURL(image.image)) 
          : userContext.currentProfile.useOwnLogo
          &&FILES+args.currentBackground.image.source}
        />
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
