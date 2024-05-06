import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import P from '@/components/ui/P'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from '@/components/fields/InputField'
import SwitchField from '@/components/fields/SwitchField'
import Button from '@/components/ui/Button'
import { IFolderCreate } from 'data/interfaces/IFolder'
import Validator from 'utils/Validator'
import { useAppContext } from 'context/state'
import useTranslation from 'next-translate/useTranslation'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface AddFavoritesFolderArgs {
  onSave: (data: IFolderCreate) => void
  initialData?: IFolderCreate
}



export default function AddFavoritesFolder(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext() 
  const args:AddFavoritesFolderArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments

  const submit = (data: IFolderCreate) => {
    args.onSave(data)
    props.onClose?.()
  }
  

  const formik = useFormik<IFolderCreate>({
    initialValues: {
      name: '',
      default: false,
      ...args?.initialData
    },
    onSubmit:submit
  })

  const body = (
    <div className={styles.root}>
      <P styleType={['w600', 'huge']} useThemeColor>{t('favorites_createFolderTitle')}</P>
      <FormikProvider value={formik}>
        <Form>
          <InputField 
          styleType={'default'} 
          labelType='top' 
          label={t('favorites_enterFolderName')} 
          color={'white'} 
          name={'name'}
          validate={Validator.required}
          />
          {(!args?.initialData || !args.initialData.default) &&
            <div className={styles.makeDeafult}>
              <P styleType={['small', 'w500']} useThemeColor>{t('favorites_makeFolderDefault')}</P>
              <SwitchField name={'default'}/>
            </div>
          }
        </Form>
        <div className={styles.buttonsWrapper}>
          <Button 
          type='button' 
          styleType={['grey', 'wide']} 
          altStyleType={['white', 'wide']}
          onClick={props.onClose}
          >
            {t('close')}
          </Button>
          <Button 
          type='button'
          onClick={formik.submitForm}
          styleType={['gradient', 'wide']}
          >
            {args?.initialData ? t('save') : t('favorites_createFolder')}           
          </Button>
        </div>
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

  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody >
        {body}
      </ModalBody>
    </ModalLayout>
  )
}