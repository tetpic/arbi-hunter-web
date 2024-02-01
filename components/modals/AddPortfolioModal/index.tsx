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
import FilesField from '@/components/fields/FilesField'
import CloudSvg from '@/components/svg/CloudSvg'
import { ICVCreate } from 'data/interfaces/ICV'
import { IFile } from 'data/interfaces/Common'
import { useState } from 'react'

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
    <Title title={'Добавить портфолио'} className={styles.title}/>
    <p className={styles.disclaimer}>
      Прикрепите ссылку на портфолио <br/>
      или загрузите фото, видео или PDF - файл
    </p>
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'portfolio'} 
        label='Добавить ссылку на портфолио'
        labelType='top'
        validate={Validator.url}
        />
        <FilesField initialImages={args.initialFiles} getImages={(setFiles)}  name={'assetsIds'} className={styles.filesWrapper} inputClassName={styles.filesInput} buttonName={<p className={styles.uploadButton}><CloudSvg/> Загрузить файл</p>} />
      </Form>
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button type='button' onClick={props.onClose} className={styles.cancelButton}>Отменить</Button>
      <Button type='button' onClick={formik.submitForm} className={styles.saveButton}>Сохранить</Button>
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