import styles from './index.module.scss'
import DropDownInput from 'components/fields/DropdownInput'
import RadioListField from 'components/fields/RadioListField'
import LocationRepository from 'data/repositories/LocationRepository'
import { useCvContext } from 'context/cv_state'
import { ISearchCityResult, ISearchCountryResult } from 'data/interfaces/ILocation'

interface Props {
}

export default function WorkPlace(props: Props) {
  const cvContext = useCvContext()

  const cityHandler = (c: ISearchCityResult) => {
    const cvHelpers = cvContext.helpObjects
    cvContext.setHelpObjects({...cvHelpers, cityId: c.id})
  }

  const countryHandler = (c: ISearchCountryResult) => {
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

    <DropDownInput
    onSetOption={countryHandler} 
    name={'countryId'} 
    value = ''
    labelName={'Страна где находится офис:'}
    requestFn={LocationRepository.searchCountry} 
    />

    <DropDownInput
    onSetOption={cityHandler} 
    name={'cityId'} 
    value = ''
    labelName={'Город где находится офис:'}
    requestFn={LocationRepository.searchCity} 
    />
    
  </>)
}