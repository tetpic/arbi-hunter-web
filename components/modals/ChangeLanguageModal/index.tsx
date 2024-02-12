import { useAppContext } from 'context/state'
import styles from './index.module.scss'
import ModalLayout from '@/components/layout/Modal/ModalLayout'
import ModalBody from '@/components/layout/Modal/ModalBody'
import Title from '@/components/ui/TitleForSection'
import { Form, FormikProvider, useFormik } from 'formik'
import RadioListField from '@/components/fields/RadioListField'
import Button from '@/components/ui/Button'
import { InterfaceLanguage } from 'types/enums'
import { TranslateInterfaceLanguage } from 'utils/enumsTranslations'

interface Props {
  onClose: () => void
}

interface FormikValues {
  value?: InterfaceLanguage
}

export interface IChangeLanguageModalArgs {
  onSave?: (data: FormikValues) => void
  initial?: InterfaceLanguage
}

export default function ChangeLanguageModal(props: Props) {
  const appContext = useAppContext()
  const args: IChangeLanguageModalArgs = appContext.modalArguments
  
  const submit = (data: FormikValues) => {
    args.onSave(data)
    props.onClose()
  }

  const formik = useFormik<FormikValues>({
    initialValues: {
      value: args?.initial||undefined,
    },
    onSubmit:submit
  })

  const body = (
    <div className={styles.root}>
      <Title title={'Язык приложения'} className={styles.title}/>
      <RadioListField name={'value'} 
      options={[
        {value: InterfaceLanguage.English, label: TranslateInterfaceLanguage(InterfaceLanguage.English)},
        {value: InterfaceLanguage.Russian, label: TranslateInterfaceLanguage(InterfaceLanguage.Russian)},
        {value: InterfaceLanguage.Ukranian, label: TranslateInterfaceLanguage(InterfaceLanguage.Ukranian)},
      ]}
      />
      <div className={styles.buttonsWrapper}>
        <Button className={styles.greyBtn}>Отменить</Button>
        <Button className={styles.blueBtn}>Сохранить</Button>
      </div>
    </div>
  )

  return (<ModalLayout>
    <ModalBody>
      <FormikProvider value={formik}>
        <Form>
          {body}
        </Form>
      </FormikProvider>
    </ModalBody>
  </ModalLayout>)
}