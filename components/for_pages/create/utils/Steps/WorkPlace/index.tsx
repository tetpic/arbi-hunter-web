import styles from './index.module.scss'
import DropDownInput from 'components/fields/LocationDropdownInput'
import RadioListField from 'components/fields/RadioListField'
import LocationRepository from 'data/repositories/LocationRepository'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { ISearchCityResult, ISearchCountryResult } from 'data/interfaces/ILocation'
import { useState } from 'react'
import { useFormikContext } from 'formik'
import { IVacancyCreate } from 'data/interfaces/IVacancy'

interface Props {
  id?: number
}

export default function WorkPlace(props: Props) {
  const cvContext = useCreateVcCvContext()

  const [currentCountryCode, setCurrentCountryCode] = useState<string>('RU')

  const formikContext = useFormikContext<IVacancyCreate>()

  const cityHandler = (c: ISearchCityResult) => {
    const cvHelpers = cvContext.helpObjects
    cvContext.setHelpObjects({...cvHelpers, cityId: c.id})
  }

  const countryHandler = (c: ISearchCountryResult) => {
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

    {!formikContext.values.isRemote &&
    <>
      <DropDownInput
      onSetOption={countryHandler} 
      name={'countryName'} 
      value = {cvContext?.currentVc?.country?.locName||''}
      labelName={'Страна где находится офис:'}
      requestFn={LocationRepository.searchCountry} 
      />

      <DropDownInput
      onSetOption={cityHandler} 
      name={'cityName'} 
      country={currentCountryCode}
      value = {cvContext?.currentVc?.city?.locName||''}
      labelName={'Город где находится офис:'}
      requestFn={LocationRepository.searchCity} 
      />
    </>
    }
    
  </>)
}