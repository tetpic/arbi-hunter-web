import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import { ISearchCityResult, ISearchCountryResult } from 'data/interfaces/ILocation'
import { useState } from 'react'
import LocationRepository from 'data/repositories/LocationRepository'
import { useUserContext } from 'context/user_state'
import LocationDropDownInput from '@/components/fields/LocationDropdownInput'
import Button from '@/components/ui/Button'
// import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import { useAppContext } from 'context/state'
import { InterfaceLanguage, ModalType, SnackbarType } from 'types/enums'
import { IChangeLanguageModalArgs } from '@/components/modals/ChangeLanguageModal'
// import { TranslateInterfaceLanguage } from 'utils/enumsTranslations'
import Cookies from 'js-cookie'
import setLanguage from 'next-translate/setLanguage'
import useTranslation from 'next-translate/useTranslation'
import UserRepository from 'data/repositories/UserRepository'

interface Props {
}

interface SiteSettings {
  countryId: number, 
  cityId: number,
  language: InterfaceLanguage
} 

export default function SiteSettings(props: Props) {
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()
  const [currentCountryCode, setCurrentCountryCode] = useState<string>('RU')


  const submit = (data: SiteSettings) => {
    
    Cookies.set('NEXT_LOCALE', data.language, {path: '/'})
    setLanguage(data.language, false)
    userContext.editCurrentProfile({countryId: data.countryId, cityId: data.cityId})
    UserRepository.editCurrentUser({language: data.language})
    .then(user => {
      userContext.updateUser(user)
      appContext.showSnackbar(t('saved'), SnackbarType.success)
    })
  }

  const formik = useFormik<SiteSettings>({
    initialValues: {
      countryId: undefined,
      cityId: undefined,
      language: Cookies.get('NEXT_LOCALE') as InterfaceLanguage||undefined
    },
    onSubmit:submit
  })

  const countryHandler = (c: ISearchCountryResult) => {
    
    formik.setFieldValue('countryId', c.geoname.geonameid)
    formik.setFieldValue('cityName', '')
    setCurrentCountryCode(c.country_code)
  }

  const cityHandler = (c: ISearchCityResult) => {
    
    formik.setFieldValue('cityId', c.id)
  }

  const onLangChange =()=> {
    const args:IChangeLanguageModalArgs = {onSave: (data) => formik.setFieldValue('language', data.value)}
    isTabletWidth
    ?appContext.showBottomSheet<IChangeLanguageModalArgs>(ModalType.ChangeLanguageModal, args, 220)
    :appContext.showModal<IChangeLanguageModalArgs>(ModalType.ChangeLanguageModal, args)
  }

  return (
    <div className={styles.root}>
      <FormikProvider value={formik}>
        <Form className={styles.form}>
          <LocationDropDownInput
          onSetOption={countryHandler} 
          name={'countryName'} 
          value = {userContext?.currentProfile?.country?.locName}
          labelName={t('country')}
          requestFn={LocationRepository.searchCountry} 
          />
          <LocationDropDownInput
          onSetOption={cityHandler} 
          name={'cityName'} 
          value = {userContext?.currentProfile?.city?.locName}
          labelName={t('city')}
          requestFn={() => LocationRepository.searchCity({country: currentCountryCode})} 
          />
          
          {/* <div className={styles.langSelection} onClick={onLangChange}>
            <p className={styles.langTitle}>{t('app_language')}</p>
            <p className={styles.lang}>{TranslateInterfaceLanguage(formik.values.language)}</p>
            <ArrowRightSvg/>
          </div> */}
          
          <Button styleType={['gradient', 'phoneWide']} onClick={formik.submitForm} className={styles.button}>{t('save')}</Button>
        </Form>
      </FormikProvider>
    </div>
  )

}

