import styles from './index.module.scss'

import Image from 'next/image'
import { FILES } from 'types/constants'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useAppContext } from 'context/state'
import EditPencilSvg from 'components/svg/EditPencilSvg'
import DownloadCloudSvg from 'components/svg/DownloadCloudSvg'
import FileInput from 'components/fields/FileInput'
import { PreviewImage } from 'data/interfaces/Common'
import { useState } from 'react'
import { usePersonalContext } from 'context/personal_state'

interface Props {
  isEditing?: boolean
}

export default function PersonalHeader(props: Props) {
  const appContext = useAppContext()
  const personalContext = usePersonalContext()
  const {isTabletWidth} = appContext.size
  const [editedImage, setEditedImage] = useState<PreviewImage>()

  const editingButton = (()=>{
    if(!isTabletWidth) {
      return <label>
      Изменить фон <EditPencilSvg/>
      <FileInput setImages={setEditedImage}/>
      </label>
    }
    else {
      return <label>
      <DownloadCloudSvg color='white'/>
      <div>
        <p>Изменить баннер</p>      
        <span>Фото, видео, gif</span>      
      </div>
      </label>
    }
  })()


  return (<div className={styles.root}> 
    {editedImage &&
    <Image 
    src={editedImage.data?FILES + editedImage.data.source: URL.createObjectURL(editedImage.image)} 
    className={styles.background} 
    alt={'moscow'} 
    width={1148} 
    height={300} />
    ||
    <Image 
    src={personalContext.currentProfile?.profileType===ProfileType.Hirer?'/images/cities/companyDefaultBack.png':'/images/rooms/coworking.png'} 
    className={styles.background} alt={'moscow'} 
    width={1148} 
    height={300} />
    }
    {personalContext.currentProfile?.image &&
      <Image 
      className={styles.userPic} 
      src={personalContext.currentProfile?.image&& FILES+ personalContext.currentProfile?.image.source} 
      alt={'user Picture'} 
      width={300} 
      height={300}/>
    }
    {props.isEditing &&
    <div className={styles.editButton}>{editingButton}</div>
    }
  </div>)
}