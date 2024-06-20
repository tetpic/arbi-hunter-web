import { IFolder } from 'data/interfaces/IFolder'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import RadioListField from '@/components/fields/RadioListField'
import Button from '@/components/ui/Button'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import CrossSvg from '@/components/svg/CrossSvg'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'

interface Props {
  onClose?: ()=>void
  isBottomSheet?: boolean
}

export interface ChooseFolderToSaveArgs {
  onChoose?: (folderId: number)=>void
  initialFolders: IFolder[]
}

export default function ChooseFolderToSave(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args: ChooseFolderToSaveArgs = props.isBottomSheet?appContext.bottomSheetArguments: appContext.modalArguments

  const submit = (data: {folderId: number}) => {
    args.onChoose?.(data.folderId)
    props.onClose?.()
  }

  const formik = useFormik<{folderId: number}>({
    initialValues: {
      folderId: args.initialFolders.find(el=>el.default)?.id
    },
    onSubmit: submit
  })

  const body = (
    <div className={styles.root}>
      <P styleType={['w600', 'large', 'alignCenter']} useThemeColor className={styles.title}>
        {t('favorites_chooseFolderToSave')}       
        <Button 
        styleType={['icon', 'backTransparent']} 
        altStyleType={['icon', 'backTransparent', 'invertSvg']} 
        onClick={props.onClose}
        className={styles.closeButton}
        >
          <CrossSvg/>
        </Button>
      </P>      
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <RadioListField name={'folderId'} options={args.initialFolders.map(el=> ({label: el.name, value: el.id}))}/>
          <div className={styles.buttonsWrapper}>
            <Button styleType={['grey', 'wide', 'whiteText']} altStyleType={['white', 'wide']} onClick={props.onClose}>{t('cancel')}</Button>
            <Button styleType={['gradient', 'wide']} onClick={formik.submitForm}>{t('save')}</Button>
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

  return (<ModalLayout className={styles.modalLayout} >
    <ModalBody>
      {body}
    </ModalBody>
  </ModalLayout>)
}