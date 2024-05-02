import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import { IFolder } from 'data/interfaces/IFolder'
import { useAppContext } from 'context/state'
import RadioListField from '@/components/fields/RadioListField'
import P from '@/components/ui/P'
import useTranslation from 'next-translate/useTranslation'
import Button from '@/components/ui/Button'
import CrossSvg from '@/components/svg/CrossSvg'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

interface FormValues {
  addSavedToDefaultFolder: boolean
  defaultFolderId: number
}

export interface FavoritesSettingModalArgs {
  initialFolders: IFolder[],
  initialData: {addSavedToDefaultFolder: boolean, defaultFolderId: number}
  onSave: (data: FormValues) => void
}



export default function FavoritesSettingModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args:FavoritesSettingModalArgs = props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments

  const submit = (data:  FormValues) => {
    args.onSave(data)
    props.onClose()
  }
  
  const formik = useFormik<FormValues>({
    initialValues: {
      addSavedToDefaultFolder: args.initialData.addSavedToDefaultFolder,
      defaultFolderId: args.initialFolders.find(el => el.default).id
    },
    onSubmit: submit
  })

  const body = (  
    <div className={styles.root}>
      <Button styleType={['icon', 'backTransparent']} altStyleType={['icon', 'invertSvg']} onClick={props.onClose} className={styles.closeBtn}><CrossSvg/></Button>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <P styleType={['w600', 'large']} useThemeColor>{t('favorites_addingFlow')}</P>
          <RadioListField name={'addSavedToDefaultFolder'} options={[
            {value: true, label: t('favorites_addToDefaultFolder')},
            {value: false, label: t('favorites_askFolderEveryTime')}
          ]}/>
          <P styleType={['w600', 'large']} useThemeColor>{t('favorites_defaultFolder')}</P>
          <RadioListField 
          name={'defaultFolderId'} 
          options={args.initialFolders.map(el => ({value: el.id, label: el.name}))}
          />
          <div className={styles.buttonsWrapper}>
            <Button styleType={['grey', 'wide']} type='button' onClick={props.onClose}>{t('cancel')}</Button>
            <Button styleType={['gradient', 'wide']} type='button' onClick={formik.submitForm}>{t('save')}</Button>
          </div>
        </Form>
      </FormikProvider>
    </div>  
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return (<ModalLayout className={styles.modalLayout}>
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}