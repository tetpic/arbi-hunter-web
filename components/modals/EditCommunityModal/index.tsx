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
import TitleForSection from 'components/ui/TitleForSection'
import { useResize } from 'components/hooks/useResize'
import styles from './index.module.scss'
import ImageHelper from 'utils/ImageHelper'
import { Preset } from 'types/enums'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: () => void
}

export default function EditCommunityModal(props: Props) {
  const {t} = useTranslation()
  const communityContext = useCommunityContext()
  const appContext = useAppContext()
  const modalArgs = appContext.modalArguments as ICommunity
  const {isTabletWidth} = useResize()

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
    <TitleForSection onBackClick={()=>{isTabletWidth&&appContext.hideModal()}} title={t('community_editing')}/>
    <FormikProvider value={formik}>
    <Form className={styles.form}>
    <div className={styles.image}>
      {previewLogo &&
        <img className={classnames(styles.image, !previewLogo.loaded&&styles.image_load)}  alt={'name'} src={URL.createObjectURL(previewLogo.image)}/>
      }
      <label className={styles.logoLabel}>
        <FileInput setImages={setPreviewLogo}/>
        {communityContext.currentCommunity?.logo?.source && !previewLogo &&
          <Image 
          unoptimized
          width={114} 
          height={114} 
          src={ImageHelper.urlFromFile(communityContext.currentCommunity.logo, Preset.xsCrop)} 
          alt={communityContext.currentCommunity.name + ' logo'}
          />  
          ||
          !communityContext.currentCommunity?.logo?.source && !previewLogo &&
          <UserSvg className={styles.userSvg}/>
        }
      </label>
      <div className={styles.editSvg}><EditSvg/></div>
    </div>
    <InputField minLength={2} className={styles.input} labelType='top' label={t('community_nameFull')}  styleType={'default'} color={'default'} name={'name'}/>
    <div className={styles.dropZone}>
      <label className={styles.imageLabel}>
      <FileInput setImages={setPreviewImage}/>
      {previewImage  &&
        <img className={classnames(styles.bannerImage, !previewImage.loaded&&styles.bannerImage_load)}  alt={'name'} src={URL.createObjectURL(previewImage.image)}/>
        ||
        !previewImage && !communityContext.currentCommunity?.image?.source &&
        <div className={styles.inputWrapper}>
          <DownloadCloudSvg/>
          <p className={styles.addBanneer}>{t('comunity_addBanner')} <br />
           <span> {t('community_imageFormats')}</span>
          </p>
        </div>
        ||
        <Image 
        unoptimized
        width={340} 
        height={181}  
        className={classnames(styles.bannerImage)} 
        alt={'name'} 
        src={ImageHelper.urlFromFile(communityContext.currentCommunity?.image, Preset.sResize)} 
        />
      }
      </label>
      
    </div>
    <Button type={'button'} className={styles.yellowButton} onClick={formik.submitForm}>{t('save')}</Button>
    </Form>
  </FormikProvider>
  </div>)

  return (<ModalLayout mobileFullScreen className={styles.modalLayout} >
    <ModalBody >
      {body}
    </ModalBody>
  </ModalLayout>)
}