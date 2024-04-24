import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import P from '@/components/ui/P'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from '@/components/fields/InputField'
import SwitchField from '@/components/fields/SwitchField'
import Button from '@/components/ui/Button'

interface Props {
  onClose: () => void
}

interface FormikValues {
  name: string, 
  default: boolean
}

export default function AddFavoritesFolder(props: Props) {

  const submit = (data: FormikValues) => {
    debugger
  }
  

  const formik = useFormik<FormikValues>({
    initialValues: {
      name: '',
      default: false
    },
    onSubmit:submit
  })

  const body = (
    <div className={styles.root}>
      <P styleType={['w600', 'huge']}>Новая папка избранного</P>
      <FormikProvider value={formik}>
        <Form>
          <InputField 
          styleType={'default'} 
          labelType='top' 
          label='Введите название папки' 
          color={'white'} 
          name={'name'}
          />
          <div className={styles.makeDeafult}>
            <P styleType={['small', 'w500']}>Сделать папкой по умолчанию</P>
            <SwitchField name={'default'}/>
          </div>
        </Form>
        <div className={styles.buttonsWrapper}>
          <Button 
          type='button' 
          styleType={['grey', 'wide']} 
          onClick={props.onClose}
          >
            Закрыть
          </Button>
          <Button 
          type='submit' 
          styleType={['gradient', 'wide']}
          >
            Создать папку
          </Button>
        </div>
      </FormikProvider>
    </div>
  )

  return (
    <ModalLayout className={styles.modalLayout}>
      <ModalBody >
        {body}
      </ModalBody>
    </ModalLayout>
  )
}