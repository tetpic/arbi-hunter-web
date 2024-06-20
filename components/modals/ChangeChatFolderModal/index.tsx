import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import IChat, { IChatFolder, IChatProfile } from 'data/interfaces/IChat'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import RadioListField from '@/components/fields/RadioListField'
import ClosingTitle from '@/components/ui/ClosingTitle'
import Button from '@/components/ui/Button'
import useTranslation from 'next-translate/useTranslation'
import BottomSheetLayout from '@/components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from '@/components/layout/BottomSheet/BottomSheetBody'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface ChangeChatFolderModalArgs {
  folders: IChatFolder[]
  currentChat: IChat
  onSave: (folderid: number) => void

}

export default function ChangeChatFolderModal(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const args:ChangeChatFolderModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments

  const submit = (data: Pick<IChatProfile, 'chatFolderId'>) => {
    args.onSave(data.chatFolderId)
  }

  const formik = useFormik<Pick<IChatProfile, 'chatFolderId'>>({
    initialValues: {
      chatFolderId: args.currentChat.profiles[0].chatFolderId||undefined
    },
    onSubmit: submit
  })
  

  const body = (
    <div className={styles.root}>
      <ClosingTitle classNames={{wrapper:styles.title}} onClose={props.onClose} title={t('chat_chooseFolder')}/>
      <FormikProvider value={formik}>
        <Form>
          <RadioListField name={'chatFolderId'} options={
            args.folders.map(el => {
              return {value: el.id, label: el.name}
            })
          }/>
          
        </Form>
      </FormikProvider>
      <div className={styles.buttonsWrapper}>
        <Button 
        styleType={['grey', 'wide', 'whiteText']} 
        altStyleType={['white','wide']} 
        onClick={props.onClose}>
          {t('cancel')}
        </Button>
        <Button 
        disabled={!formik.values.chatFolderId}
        styleType={['gradient','wide']} 
        onClick={formik.submitForm}>
          {t('save')}
        </Button>
      </div>
    </div>  
  )

  if(props.isBottomSheet) {
    return <BottomSheetLayout>
      <BottomSheetBody>
        {body}
      </BottomSheetBody>
    </BottomSheetLayout>
  }

  return ( 
    <ModalLayout className={styles.modaLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>

  )
}