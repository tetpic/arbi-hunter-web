import styles from './index.module.scss'
import InputField from 'components/fields/InputField'
import DropDown from 'components/ui/InfiniteDropDown'
import { ISearchLocalyRequest } from 'data/interfaces/ILocation'
import { ChangeEvent, MouseEventHandler, useEffect, useRef, useState } from 'react'
import { useThrottleFn } from '@react-cmpt/use-throttle'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import classNames from 'classnames'
import { useDetectOutsideClick } from 'components/hooks/useDetectOutsideClick'
import { useFormikContext } from 'formik'

interface Props<C> {
  onSetOption: (n: C) => void
  name: string
  requestFn: (r: ISearchLocalyRequest) => Promise<C[]>
  labelName: string
  country?: string 
  value?: string
  onChange?: (e: string) => void
  className?: string
  error?: string
}

export default function DropDownInput<C extends {name?: string}>(props: Props<C>) {
  // const [inputValue, setInputValue] = useState<string>(props.value)
  const [options, setOptions] = useState<C[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null!)
  const [isDropDownOpen, setDropDownOpen] = useDetectOutsideClick(dropdownRef, false)
  const {values, setFieldValue } = useFormikContext()

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
    setFieldValue(props.name, option.name)
    // setInputValue(option.name)
  }

  const requestHandler = (pageNumber?: number, value?: string) => {
    
    const options = {
      page: pageNumber?pageNumber:page,
      limit: 10,
      search: value?value:props.value, 
      lang: 'ru', //поменять на динмический
      country: props.country?props.country:'RU' //поменять на динамический
    }
    request.callback(options)
  }

  const onInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    const targetValue = e.target.value
    // setInputValue(targetValue)
    setFieldValue(props.name, targetValue)

    if(props.onChange) {props.onChange(targetValue)}
    if(targetValue.length <1) {
      setDropDownOpen(false)
      return
    }
    setDropDownOpen(true)
    requestHandler(1, targetValue)
  }

  const onClickHandler: MouseEventHandler<HTMLInputElement> = (event) => {
    const targetValue = event.currentTarget.value
    setDropDownOpen(true)
    requestHandler(1, targetValue)
  }

  useEffect(()=>{
    requestHandler()
  }, [page])

  return ( 
    <div className={classNames(styles.root, props.className)}>
      
      <InputField 
      label={props.labelName}
      className={styles.input} 
      labelType='top' 
      styleType={'default'} 
      color={'default'} 
      name={props.name} 
      onChange={onInputChangeHandler}
      // value={inputValue}
      suffix={'icon'}
      suffixIcon={<ArrowDownSvg className={classNames(styles.arrow, isDropDownOpen&&styles.arrowTop)}/>}
      onClick={onClickHandler}
      autocompleteOff
      validate={(value)=> {return props.error?props.error:undefined}}
      />
    
      <DropDown 
      reference={(ref) => {dropdownRef.current = ref}}
      isActive={isDropDownOpen}
      nameField='name'
      options={options}
      classNames={{ optionClassName: styles.option, rootClassName: styles.dropDownRoot }}
      onClick={optionClickHandler} 
      onNext={()=>setPage(page => page + 1)}       
      loading = {loading} 
      />
      
    </div>
  )
}