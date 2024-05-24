import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import Title from 'components/ui/TitleForSection'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from 'components/fields/InputField'
import { useAppContext } from 'context/state'
import Button from 'components/ui/Button'
import Validator from 'utils/Validator'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'

import { ICVCreate } from 'data/interfaces/ICV'
import { IFile } from 'data/interfaces/Common'
import { useState } from 'react'

import useTranslation from 'next-translate/useTranslation'

interface Props {
  onClose: ()=> void
  isBottomSheet?: boolean
}

interface PortfolioFields extends Pick<ICVCreate, 'portfolio'|'assetsIds'> {

}

export interface IPortfolioModal {
  onSubmit: (data: PortfolioFields, files?: IFile[]) => void
  portfolio?: string
  initialFiles?: IFile[]
}




export default function AddPortfolioModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args:IPortfolioModal = appContext.modalArguments||appContext.bottomSheetArguments
  const [files, setFiles] = useState<IFile[]>([])

  const submit = (data: PortfolioFields) => {
    args.onSubmit(data, files)
    appContext.hideModal()
  }

  const formik = useFormik<PortfolioFields>({
    initialValues: {
      portfolio: args.portfolio||'',
      assetsIds: []
    },
    onSubmit: submit
  })

  const body = (<>
    <Title title={t('create_cv_addPortfolio')} className={styles.title}/>
    {/* <P styleType={['w500', 'medium']} useThemeColor className={styles.description}>
      {t('create_cv_portfolioText1')} <br/>
      
    </P> */}
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'portfolio'} 
        label={t('create_cv_addPortfolioLink')}
        labelType='top'
        validate={Validator.url}
        />
        {/* <FilesField 
        name={'assetsIds'} 
        initialImages={args.initialFiles} 
        accept={['image/*', '.doc', '.docx','application/msword', 'application/pdf']}
        getImages={(setFiles)}  
        className={styles.filesWrapper} 
        buttonClassName={styles.filesInput} 
        buttonName={<p className={styles.uploadButton}><CloudSvg/> {t('download')}</p>} 
        /> */}
      </Form>
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button type='button' title={'back'} onClick={props.onClose} styleType={['grey']} altStyleType={['whitePurple']}>{t('cancel')}</Button>
      <Button type='button' title='save' onClick={formik.submitForm} styleType={['gradient']}>{t('save')}</Button>
    </div>
  </>)

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    ) 
  }

  return (
  <ModalLayout className={styles.modalLayout}>
    <ModalBody className={styles.modalBody}>
      {body}
    </ModalBody>
  </ModalLayout>)
}