import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import DropDown from 'components/ui/DropDown'
import { ISearchLocalyRequest } from 'data/interfaces/ILocation'
import { ChangeEvent, useEffect, useState } from 'react'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import classNames from 'classnames'

interface Props<C> {
  onSetOption: (n: C) => void
  name: string
  requestFn: (r: ISearchLocalyRequest) => Promise<C[]>
  labelName: string
}

export default function DropDownInput<C extends {name?: string}>(props: Props<C>) {
  const [isDropDownOpen, setDropDownOpen] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [options, setOptions] = useState<C[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  const request = useThrottleFn((r: ISearchLocalyRequest) => {
    setLoading(true)
    props.requestFn(r).then(res => {
      if(r.page === 1) {
        setOptions(res)
      } else {
        setOptions(state=> [...state, ...res])
      }
      setLoading(false)
    })
  }, 300)


  const optionClickHandler = (option: C) => {
    setDropDownOpen(false)
    props.onSetOption(option)
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
    request.callback(options)
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
    request.callback(options)
  }



  useEffect(()=>{
    onNextHandler()
  }, [page])

  return ( 
    <div className={styles.root}>
      
      <InputField 
      label={props.labelName}
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