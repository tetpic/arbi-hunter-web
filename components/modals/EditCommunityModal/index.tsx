import classnames from 'classnames'
import FileInput from 'components/fields/FileInput'
import InputField from 'components/fields/InputField'
import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import DownloadCloudSvg from 'components/svg/DownloadCloudSvg'
import EditSvg from 'components/svg/EditSvg'
import UserSvg from 'components/svg/UserSvg'
import Button from 'components/ui/Button'
import { useCommunityContext } from 'context/community_state'
import { useAppContext } from 'context/state'
import { PreviewImage, UpdateCommunityForm } from 'data/interfaces/Common'
import ICommunity from 'data/interfaces/ICommunity'
import { Form, FormikProvider, useFormik } from 'formik'
import Image from 'next/image'
import { useState } from 'react'
import { FILES } from 'types/constants'
import TitleForSection from 'components/ui/TitleForSection'
import { useResize } from 'components/hooks/useResize'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

interface Props {
  onClose: () => void
}

export default function EditCommunityModal(props: Props) {
  const communityContext = useCommunityContext()
  const appContext = useAppContext()
  const modalArgs = appContext.modalArguments as ICommunity
  const {isTabletWidth} = useResize()
  const router = useRouter()

  const [previewLogo, setPreviewLogo] = useState<PreviewImage>()
  const [previewImage, setPreviewImage] = useState<PreviewImage>()

  const submit = (data: UpdateCommunityForm) => {
    const submitData:UpdateCommunityForm = {
      ...data,
      imageId: +previewImage?.id||data.imageId,
      logoId:  +previewLogo?.id||data.logoId
    }
    communityContext.updateCommunity(submitData)    
  }

  const formik = useFormik<UpdateCommunityForm>({
    initialValues: {
      name: modalArgs.name,
      imageId: modalArgs.image?.id||null,
      logoId: modalArgs.logo?.id||null
    },
    onSubmit: submit
  })

  const body = (<div className={styles.body}>
    <TitleForSection onBackClick={()=>{isTabletWidth&&appContext.hideModal()}} title={'Редактирование'}/>
    {/* <p className={styles.title}>Редактирование</p> */}
    <FormikProvider value={formik}>
    <Form className={styles.form}>
    <div className={styles.image}>
      {previewLogo &&
        <img className={classnames(styles.image, !previewLogo.loaded&&styles.image_load)}  alt={'name'} src={URL.createObjectURL(previewLogo.image)}/>
      }
      <label className={styles.logoLabel}>
        <FileInput setImages={setPreviewLogo}/>
        {communityContext.currentCommunity?.logo?.source && !previewLogo &&
          <Image width={114} height={114} src={FILES + communityContext.currentCommunity.logo.source} alt={communityContext.currentCommunity.name + ' logo'}/>  
          ||
          !communityContext.currentCommunity?.logo?.source && !previewLogo &&
          <UserSvg className={styles.userSvg}/>
        }
      </label>
      <div className={styles.editSvg}><EditSvg/></div>
    </div>
    <InputField minLength={2} className={styles.input} labelType='top' label='Название сообщества'  styleType={'default'} color={'default'} name={'name'}/>
    <div className={styles.dropZone}>
      <label className={styles.imageLabel}>
      <FileInput setImages={setPreviewImage}/>
      {previewImage && !communityContext.currentCommunity?.image?.source &&
        <img className={classnames(styles.bannerImage, !previewImage.loaded&&styles.bannerImage_load)}  alt={'name'} src={URL.createObjectURL(previewImage.image)}/>
        ||
        !previewImage && !communityContext.currentCommunity?.image?.source &&
        <div className={styles.inputWrapper}>
          <DownloadCloudSvg/>
          <p className={styles.addBanneer}>Добавить баннер <br />
           <span> Фото, видео, gif</span>
          </p>
        </div>
        ||
        <Image width={340} height={181}  className={classnames(styles.bannerImage)} alt={'name'} src={FILES + communityContext.currentCommunity?.image?.source} />
      }
      </label>
      
    </div>
    <Button type={'button'} className={styles.yellowButton} onClick={formik.submitForm}>Сохранить</Button>
    </Form>
  </FormikProvider>
  </div>)

  return (<ModalLayout mobileFullScreen className={styles.modalLayout} >
    <ModalBody >
      {body}
    </ModalBody>
  </ModalLayout>)
}