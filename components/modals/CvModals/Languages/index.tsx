import styles from './index.module.scss'

import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useEffect,  useState } from 'react'
import Body from '../Body'
import classNames from 'classnames'
import { AppTheme, LanguageKnowLevel, Languages } from 'types/enums'
import Radio from 'components/fields/RadioListField/Radio'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { TranslateLanguage, TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import { useAppContext } from 'context/state'
import BottomSheetLayout from 'components/layout/BottomSheet/BottomSheetLayout'
import BottomSheetBody from 'components/layout/BottomSheet/BottomSheetBody'
import useTranslation from 'next-translate/useTranslation'
import { colors } from 'styles/variables'

interface Props {
  onClose: () => void
  isBottomSheet?: boolean
}

export interface ILangaugesModalArgs {
  onClose?: ()=> void 
  onSubmit?: (data: {language: Languages, level: LanguageKnowLevel})=>void
}
  
export default function LangaugesModal(props: Props) {
  const appContext = useAppContext()
  const isLightTheme = appContext.theme === AppTheme.Light
  const {t} = useTranslation()
  const args: ILangaugesModalArgs = props.isBottomSheet?appContext.bottomSheetArguments:appContext.modalArguments

  const [langs, setLangs] = useState<{ru: string, en: string}[]>([])
  const [activeDropDown, setActiveDropDown] = useState<'langs'|'levels'|undefined>('langs')
  const [langRadioActive, setLangRadioActive] = useState<Languages>(null)
  const [levelRadioActive, setLevelRadioActive] = useState<LanguageKnowLevel>(null)
  
  useEffect(()=>{
    const langsObj = Object.entries(Languages).map(([key, value])=> {return {en: value, ru: TranslateLanguage(value, t)}
    })
    setLangs(langsObj)
  }, [])

  const onSaveHandler = () => {
    args.onSubmit({language: langRadioActive, level: levelRadioActive})
    args?.onClose?args.onClose():props.onClose()
  }


  const body = (
    <Body 
    key={'languageBody'+langRadioActive+levelRadioActive}
    onClose={props.onClose} 
    onSave={onSaveHandler}  
    title={t('foreignLanguages')} 
    withInput={false}
    disabledButton={(!langRadioActive||!levelRadioActive)}
    >
      <div className={styles.wrapper}>
        <p className={styles.title} 
        onClick={()=>{
          activeDropDown==='langs'?setActiveDropDown(undefined):setActiveDropDown('langs')
        }}
        >
          {t('language')} <ArrowDownSvg color={isLightTheme&&colors.black} className={activeDropDown==='langs'&&styles.arrow_active}/>
        </p>
        <div className={classNames(styles.list, activeDropDown==='langs'&&styles.list_active)}>
          {langs&&langs.map((el, index) => {
              return (
                <Radio 
                key={index}
                className={styles.item} 
                isActive={el.en===langRadioActive} 
                value={el.en} 
                label={el.ru} 
                onChange={(s) => setLangRadioActive(s as Languages)}
                />)
            }) 
          }
        </div>
      </div>
      <div className={styles.wrapper}>
        <p className={styles.title} 
        onClick={()=>{
          activeDropDown==='levels'?setActiveDropDown(undefined):setActiveDropDown('levels')
        }} 
        >
          {t('language_knowLevel')}
          <ArrowDownSvg color={isLightTheme&&colors.black} className={activeDropDown==='levels'&&styles.arrow_active}/>
        </p>
        <div className={classNames(styles.list, activeDropDown==='levels'&&styles.list_active)}>
          {Object.values(LanguageKnowLevel).map((el, index)=> {
            return (
              <Radio 
              key={index}
              className={styles.item} 
              value={el} 
              label={TranslateLanguageKnowLevel(el, t)} 
              isActive={el === levelRadioActive} 
              onChange={(l)=> setLevelRadioActive(l as LanguageKnowLevel)}
              />
              )
          })}
        </div>
      </div>
    </Body>
  )

  if(props.isBottomSheet) {
    return (
      <BottomSheetLayout>
        <BottomSheetBody>
          {body}
        </BottomSheetBody>
      </BottomSheetLayout>
    )
  }

  return ( 
    <ModalLayout mobileFullScreen  className={styles.rootLayout}>
      <ModalBody className={styles.modalBody}>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}