import styles from './index.module.scss'
import { FieldConfig } from 'formik'
import classNames from 'classnames'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useTranslation } from 'next-i18next'
import { listenForOutsideClicks } from 'hooks/useDetectOutsideClick'
import flags from 'country-flag-icons/react/3x2'
import { usePopper } from 'react-popper'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
interface IOption {
  value: string
  label: string
  divider: boolean
}

interface Props {
  offsetLeft: number
  offsetTop: number
  value: string
  className: string
  options: IOption[]
  onChange: (value: string) => void
  country?: string
}
const FlagComponent = ({country, countryName,}: {country: string, countryName: string}) => {
  //@ts-ignore
  if (flags && flags[country]) {
    //@ts-ignore
    return flags[country]({ title: '' })
  }
  return null
}

const sameWidth = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  fn: ({ state }: any) => {
    state.styles.popper.width = `${state.rects.reference.width}px`
  },
  effect: ({ state }: any) => {
    state.elements.popper.style.width = `${state.elements.reference.offsetWidth
      }px`
  }
}
const sameWidthWithOffset = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  //@ts-ignore
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width - 20}px`
  },
  //@ts-ignore
  effect: ({ state }) => {
    state.elements.popper.style.width = `${state.elements.reference.offsetWidth - 20
      }px`
  }
}


export default function CountrySelect(props: Props & FieldConfig) {
  const [first, ...options] = props.options
  const customOptions = [{label: 'Russia', value: 'RU'} as IOption, ...options]
  const { t, i18n } = useTranslation() 
  const dropdownRef = useRef(null)
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
    strategy: 'fixed',
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [props.offsetLeft ?? 0, props.offsetTop ?? 0],
        },
      },
      props.offsetLeft > 0 ? sameWidthWithOffset : sameWidth as any
    ]
  })
  useEffect(() => {
    setTimeout(() => {
      setReferenceElement(document.querySelector('#phone-field'))
    }, 100)

  }, [])
  const currentOption = useMemo<IOption>(() =>  props.value ? props.options.find(i => i.value === props.value) : props.country ? props.options.find(i => i.value === props.country) : null, [props.value, props.country])
  const [listening, setListening] = useState(false)
  const [isActive, setIsActive] = useState(false)
  useEffect(listenForOutsideClicks(
    listening,
    setListening,
    dropdownRef,
    setIsActive,
  ))



  const handleClick = () => {
    setIsActive(!isActive)
  }
  const handleChange = (item: IOption) => {
    props.onChange(item.value)
  }

  return (
    <div ref={(ref) => {
      dropdownRef.current = ref
    }} className={classNames(styles.root)} onClick={handleClick}>
      <div className={styles.dropDownTrigger}>
        <div className={styles.icon}>
          <FlagComponent countryName={currentOption?.label} country={props.value ?? props.country}></FlagComponent>
        </div>
          <ArrowDownSvg className={classNames({[styles.arrow]: true, [styles.reversed]: isActive })}/>
      </div>
      {isActive && <div ref={setPopperElement} style={popperStyles.popper} className={classNames(styles.dropDown, props.className)} {...attributes.popper}
        >
        <div className={styles.options}>
          <Scrollbars 
          style={{ height: 200 }}
          renderTrackVertical={props => <div {...props} className={styles.track} />}
          renderView={props => <div {...props} className={styles.view} />}
          >
            {customOptions.map((item, index) =>
              <div className={styles.option} onClick={() => handleChange(item)} key={index}>
                <div className={styles.icon}>
                  <FlagComponent countryName={item.label} country={item.value}></FlagComponent>
                </div> <div className={styles.label}>{item.label}</div>
              </div>
            )}
          </Scrollbars>
        </div>
      </div>}
    </div>)
}
