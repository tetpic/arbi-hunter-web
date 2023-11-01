import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import Title from 'components/ui/TitleForSection'
import { Form, FormikProvider, useFormik } from 'formik'
import InputField from 'components/fields/InputField'
import { useAppContext } from 'context/state'
import Button from 'components/ui/Button'
import Validator from 'utils/Validator'

interface Props {
  onClose: ()=> void
}

export interface IPortfolioModal {
  onSubmit: (data: {portfolio: string}) => void
  portfolio?: string
}


export default function AddPortfolioModal(props: Props) {
  const appContext = useAppContext()
  const args = appContext.modalArguments as IPortfolioModal

  const submit = (data: {portfolio: string}) => {
    args.onSubmit(data)
    appContext.hideModal()
  }

  const formik = useFormik<{portfolio: string}>({
    initialValues: {
      portfolio: args.portfolio||''
    },
    onSubmit: submit
  })

  const body = (<>
    <Title title={'Добавить портфолио'}/>
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        <InputField 
        styleType={'default'} 
        color={'default'} 
        name={'portfolio'} 
        placeholder='Ссылка на портфолио'
        validate={Validator.combine([Validator.required, Validator.url])}
        />
      </Form>
    </FormikProvider>
    <div className={styles.buttonsWrapper}>
      <Button type='button' className={styles.cancelButton}>Отменить</Button>
      <Button type='button' onClick={formik.submitForm} className={styles.saveButton}>Сохранить</Button>
    </div>
  </>)

  return (
  <ModalLayout className={styles.modalLayout}>
    <ModalBody className={styles.modalBody}>
      {body}
    </ModalBody>
  </ModalLayout>)
}