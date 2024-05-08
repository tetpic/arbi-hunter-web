import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import SwitchField from '@/components/fields/SwitchField'
import Button from '@/components/ui/Button'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'

interface Props {
}

interface INotifications {
  sms?: boolean,
  email?: boolean,
  push?: boolean
}

export default function Notifications(props: Props) {
  const {t} = useTranslation()

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
    <Form className={styles.form}>
      <div className={styles.wrapper}>
        <SwitchField {...switchSet} name={'email'} label={t('profile_emailNotifications')} fluid className={styles.switch} labelClassName={styles.label}/>
        <SwitchField {...switchSet} name={'push'} label={t('profile_pushNotifications')} fluid className={styles.switch} labelClassName={styles.label}/>
      </div>
      <Button styleType={['gradient', 'phoneWide']}  className={styles.saveButton}>{t('save')}</Button>
    </Form>
  </FormikProvider>

  </div>)
}