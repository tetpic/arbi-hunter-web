import styles from './index.module.scss'

import { useAppContext } from 'context/state'
import { PreviewImage } from 'data/interfaces/Common'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useState } from 'react'
import UserPic from 'components/ui/UserPic'
import classNames from 'classnames'
import { useUserContext } from 'context/user_state'
import Button from 'components/ui/Button'
import FileInput from 'components/fields/FileInput'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'

interface Props {
  onClose: () => void
}

export interface IUserImageModalProps {
  onSave: (data: {image: PreviewImage, type?: 'logo'|'image'}) => void

}

export default function UserImageModal(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const args: IUserImageModalProps = appContext.modalArguments
  const [type, setType] = useState<'logo'|'image'>(userContext.currentProfile?.useOwnLogo? 'logo' :'image')
  const [image, setImage] = useState<PreviewImage>()

  const onSave = () => {
    args.onSave({image, type})
    props.onClose()    
  }

  const body = (
    <div className={styles.root}>
      <div className={styles.switcher}>
        <div className={classNames(styles.item, type==='logo' && styles.active)} onClick={()=>setType('logo')}>
          <UserPic 
          className={styles.userPic}
          size={88}
          image={userContext?.currentProfile?.logo&&ImageHelper.urlFromFile(userContext?.currentProfile?.logo, Preset.iconCrop)}
          />
          <p>Индивидуальный аватар</p>
        </div>
        <label className={classNames(styles.item, type==='image' && styles.active)} onClick={()=>setType('image')}>
          <FileInput setImages={setImage} accept={['.jpg','.jpeg', '.png']} multiple={false}/>
          <UserPic
          className={styles.userPic}
          size={88}
          image={image
            ?(image?.data?ImageHelper.urlFromFile(image?.data, Preset.iconCrop):URL.createObjectURL(image.image)) 
            :userContext?.currentProfile?.image&&ImageHelper.urlFromFile(userContext?.currentProfile?.image, Preset.iconCrop)}
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
  


  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}