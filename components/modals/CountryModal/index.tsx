import ModalLayout from '@/components/layout/Modal/ModalLayout'
import styles from './index.module.scss'
import ModalBody from '@/components/layout/Modal/ModalBody'
import { Form, FormikProvider, useFormik } from 'formik'
import { IGeoName } from 'data/interfaces/ILocation'
import { LocationWrapper, useLocationContext } from 'context/location_state'
import InputField from '@/components/fields/InputField'
import CheckboxListField from '@/components/fields/CheckboxListField'
import { useEffect } from 'react'
import LoupeSvg from '@/components/svg/LoupeSvg'
import Button from '@/components/ui/Button'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import { colors } from 'styles/variables'
import useTranslation from 'next-translate/useTranslation'

export interface ICountryModalProps {
  onSubmit: (country: IGeoName[]) => void
  initials?: IGeoName[]
}

interface Props {
  onClose: () => void
}

export default  function CountryModal (props: Props) {
  return (
    <LocationWrapper>
      <CountryModalInner {...props} />
    </LocationWrapper>
   )
}

function CountryModalInner(props: Props) {
  const {t} = useTranslation()
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const args: ICountryModalProps = appContext.modalArguments
  const locationContext = useLocationContext()
  

  const submit = (data: {country: IGeoName[], search: string})=> {
    debugger
    args.onSubmit(data.country)
    props.onClose()
  }

  const formik = useFormik<{country: IGeoName[], search: string}>({
    initialValues: {
      country: args.initials ||[],
      search: '',
    },
    onSubmit: submit
  })

  useEffect(()=>{
    locationContext.getCountries({search: formik.values.search}, null, formik.values.country)  
  }, [formik.values.search])

  const body = (<div className={styles.root}>
    <InputField 
    styleType={'default'} 
    color={'white'} 
    name={'search'} 
    prefix={<LoupeSvg color={isLightTheme?colors.black:''}/>} 
    placeholder={t('search')}
    />
    {locationContext.countries.size > 0 &&
      <CheckboxListField  name={'country'} options={
        [...formik.values.country, ...[ ...locationContext.countries.values()].filter(el=> !formik.values.country.includes(el))].map(el=> ({label: el.locName, value: el}))
      }/>
    }
    <div className={styles.buttonsWrapper}>
      <Button styleType={['grey']} altStyleType={['whitePurple']} type='button' onClick={props.onClose}>{t('cancel')}</Button>
      <Button styleType={['gradient']} type='button' onClick={formik.submitForm}>{t('set')}</Button>
    </div>
  </div>)

  return (
    <ModalLayout className={styles.modalLayout} mobileFullScreen>
      <ModalBody >
        <FormikProvider value={formik}>
          <Form>
          {body}
          </Form>
        </FormikProvider>
      </ModalBody>
    </ModalLayout>
  )
}