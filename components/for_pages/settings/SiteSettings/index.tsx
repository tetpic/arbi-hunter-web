import { Form, FormikProvider, useFormik } from 'formik'
import styles from './index.module.scss'
import { ISearchCityResult, ISearchCountryResult } from 'data/interfaces/ILocation'
import { useState } from 'react'
import LocationRepository from 'data/repositories/LocationRepository'
import { useUserContext } from 'context/user_state'
import LocationDropDownInput from '@/components/fields/LocationDropdownInput'
import Button from '@/components/ui/Button'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'
import { useAppContext } from 'context/state'
import { InterfaceLanguage, ModalType } from 'types/enums'
import { IChangeLanguageModalArgs } from '@/components/modals/ChangeLanguageModal'
import { TranslateInterfaceLanguage } from 'utils/enumsTranslations'

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
  const [currentCountryCode, setCurrentCountryCode] = useState<string>('RU')
  const formik = useFormik<SiteSettings>({
    initialValues: {
      countryId: undefined,
      cityId: undefined,
      language: undefined
    },
    onSubmit: (data) => {
    }
  })

  const countryHandler = (c: ISearchCountryResult) => {
    formik.setFieldValue('cityName', '')
    setCurrentCountryCode(c.country_code)
  }

  const cityHandler = (c: ISearchCityResult) => {
  }

  const onLangChange =()=> {
    appContext.showModal<IChangeLanguageModalArgs>(ModalType.ChangeLanguageModal, {
      onSave: (data) => formik.setFieldValue('language', data.value)
    })
  }

  return (
    <div className={styles.root}>
      <FormikProvider value={formik}>
        <Form>
          <LocationDropDownInput
          onSetOption={countryHandler} 
          name={'countryName'} 
          value = {userContext?.currentProfile?.country?.locName}
          labelName={'Страна:'}
          requestFn={LocationRepository.searchCountry} 
          />
          <LocationDropDownInput
          onSetOption={cityHandler} 
          name={'cityName'} 
          value = {userContext?.currentProfile?.city?.locName}
          labelName={'Город:'}
          requestFn={LocationRepository.searchCity} 
          />
          
          <div className={styles.langSelection} onClick={onLangChange}>
            <p className={styles.langTitle}>Язык приложения</p>
            <p className={styles.lang}>{TranslateInterfaceLanguage(formik.values.language)}</p>
            <ArrowRightSvg/>
          </div>




          
          <Button className={styles.button}>Сохранить</Button>
        </Form>
      </FormikProvider>
    </div>
  )

}

