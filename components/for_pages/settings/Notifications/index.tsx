import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import SwitchField from '@/components/fields/SwitchField'
import Button from '@/components/ui/Button'
import { colors } from 'styles/variables'

interface Props {
}

interface INotifications {
  sms?: boolean,
  email?: boolean,
  push?: boolean
}

export default function Notifications(props: Props) {

  const formik = useFormik<INotifications>({
    initialValues: {
      sms: true,
      email: true,
      push: true
    },
    onSubmit: (data) => {
    }
  })

  const switchSet = {
    offColor: colors.greyLight,
    onColor: colors.green,
    offHandleColor: colors.white,
    onHandleColor: colors.white
  }

  return (<div className={styles.root}> 
  <FormikProvider value={formik}>
    <Form>
      <div className={styles.wrapper}>
        <SwitchField {...switchSet} name={'sms'} label='СМС-уведомления' fluid className={styles.switch} labelClassName={styles.label}/>
        <SwitchField {...switchSet} name={'email'} label='Почтовые рассылки' fluid className={styles.switch} labelClassName={styles.label}/>
        <SwitchField {...switchSet} name={'push'} label='Пуш-уведомления' fluid className={styles.switch} labelClassName={styles.label}/>
      </div>
      <Button className={styles.saveButton}>Сохранить</Button>
    </Form>
  </FormikProvider>

  </div>)
}