import styles from './index.module.scss'
import LocationDropDownInput from 'components/fields/LocationDropdownInput'
import RadioListField from 'components/fields/RadioListField'
import LocationRepository from 'data/repositories/LocationRepository'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISearchCityResult, ISearchCountryResult } from 'data/interfaces/ILocation'
import { useState } from 'react'
import { useFormikContext } from 'formik'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import { useUserContext } from 'context/user_state'
import Spacer from '@/components/ui/Spacer'

interface Props {
  id?: number
}

export default function WorkPlace(props: Props) {
  const cvContext = useCreateVcCvContext()
  const userContext = useUserContext()

  const [currentCountryCode, setCurrentCountryCode] = useState<string>('RU')

  const formikContext = useFormikContext<IVacancyCreate>()

  const cityHandler = (c: ISearchCityResult) => {
    const cvHelpers = cvContext.helpObjects
    cvContext.setHelpObjects({...cvHelpers, cityId: c.id})
  }

  const countryHandler = (c: ISearchCountryResult) => {
    
    formikContext.setFieldValue('cityName', '')
    setCurrentCountryCode(c.country_code)
    const cvHelpers = cvContext.helpObjects
    cvContext.setHelpObjects({...cvHelpers, countryId: c.geoname.geonameid})
  }

  return (<>
    <RadioListField 
    name={'isRemote'} 
    options={[
      {label: 'Удаленная', value: true},
      {label: 'В офисе', value: false},
    ]}
    wrapperClassName={styles.radioWrapper}
    />

    <Spacer basis={16}/>

    {!formikContext.values.isRemote &&
    <>
      <LocationDropDownInput
      onSetOption={countryHandler} 
      name={'countryName'} 
      value = {cvContext?.currentVc?.country?.locName||userContext?.currentProfile?.country.locName}
      labelName={'Страна где находится офис:'}
      requestFn={LocationRepository.searchCountry} 
      />

      <Spacer basis={16}/>

      <LocationDropDownInput
      onSetOption={cityHandler} 
      name={'cityName'} 
      country={currentCountryCode}
      value = {cvContext?.currentVc?.city?.locName||userContext?.currentProfile?.city.locName}
      labelName={'Город где находится офис:'}
      requestFn={LocationRepository.searchCity} 
      />
    </>
    }
    
  </>)
}