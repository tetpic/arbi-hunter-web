import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import DropDown from 'components/ui/DropDown'
import { ISearchCountryRequest, ISearchCountryResult } from 'data/interfaces/ILocation'
import LocationRepository from 'data/repository/LocationRepository'
import { ChangeEvent, useEffect, useState } from 'react'
import Validator from 'utils/Validator'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import classNames from 'classnames'

interface Props {
  onSetOption: (n: number) => void
  name: string
}

export default function CountryInput(props: Props) {
  const [isDropDownOpen, setDropDownOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [options, setOptions] = useState<ISearchCountryResult[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)


  

  const getCitiesRequest = useThrottleFn((r: ISearchCountryRequest) => {
    setLoading(true)
    LocationRepository.searchCountry(r)
    .then(countries => {
      if(r.page === 1) {
        setOptions(countries)
      } else {
        setOptions(state=> [...state, ...countries])
      }
      setLoading(false)
    })
  }, 300)

  const optionClickHandler = (option: ISearchCountryResult) => {
    setDropDownOpen(false)
    props.onSetOption(option.geoname.geonameid)
    setInputValue(option.name)
  }

  const onNextHandler = () => {
    const options = {
      page: page,
      limit: 10,
      search: inputValue, 
      lang: 'ru', //поменять на динмический
      country: 'RU' //поменять на динамический
    }
    getCitiesRequest.callback(options)
  }

  const onInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    const targetValue = e.target.value
    setInputValue(targetValue)
    if(targetValue.length <1) {
      setDropDownOpen(false)
      return
    }
    setDropDownOpen(true)
    const options = {
      page: 1,
      limit: 10,
      search: targetValue, 
      lang: 'ru', //TODO: поменять на динамический
      country: 'RU' //TODO: поменять на динамический
    }
    getCitiesRequest.callback(options)
  }



  useEffect(()=>{
    onNextHandler()
  }, [page])

  return ( 
    <div className={styles.root}>
      
      <InputField 
      label={'Страна:'}
      className={styles.input} 
      labelType='top' 
      styleType={'default'} 
      color={'default'} 
      name={props.name} 
      onChange={onInputChangeHandler}
      value={inputValue}
      suffix={'icon'}
      suffixIcon={<ArrowDownSvg className={classNames(styles.arrow, isDropDownOpen&&styles.arrowTop)}/>}
      />

      {isDropDownOpen&&
        <DropDown 
        nameField='name'
        options={options}
        classNames={{ optionClassName: styles.option, rootClassName: styles.dropDownRoot }}
        onClick={optionClickHandler} 
        onNext={()=>setPage(page => page + 1)}       
        loading = {loading} 
        />
      }
    </div>
  )
}