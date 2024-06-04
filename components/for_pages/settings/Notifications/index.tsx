import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import SwitchField from '@/components/fields/SwitchField'
import Button from '@/components/ui/Button'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'
import { useAppContext } from 'context/state'
import { useUserContext } from 'context/user_state'
import { IUser } from 'data/interfaces/IUser'
import { SnackbarType } from 'types/enums'

interface Props {
}

interface INotifications extends Pick<IUser, 'emailNotifications' | 'pushNotifications'> {
}

export default function Notifications(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const userContext = useUserContext()

  const formik = useFormik<INotifications>({
    initialValues: {
      emailNotifications: userContext.user.emailNotifications,
      pushNotifications: userContext.user.pushNotifications
    },
    onSubmit: (data) => {
      userContext.updateUser({...userContext.user, ...data})
      .then(_ => {
        appContext.showSnackbar(t('saved'), SnackbarType.success)
      })
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
        <SwitchField {...switchSet} 
        name={'emailNotifications'} 
        label={t('profile_emailNotifications')} 
        fluid 
        className={styles.switch} 
        labelClassName={styles.label}
        
        />

        <SwitchField {...switchSet} 
        name={'pushNotifications'} 
        label={t('profile_pushNotifications')} 
        fluid 
        className={styles.switch} 
        labelClassName={styles.label}
        />
      </div>
      <Button styleType={['gradient', 'phoneWide']}  className={styles.saveButton}>{t('save')}</Button>
    </Form>
  </FormikProvider>

  </div>)
}