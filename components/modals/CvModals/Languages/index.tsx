import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useEffect,  useState } from 'react'
import Body from '../Body'
import languages from '@cospired/i18n-iso-languages'
import classNames from 'classnames'
import { LanguageKnowLevel, Languages } from 'types/enums'
import Radio from 'components/fields/RadioListField/Radio'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import styles from './index.module.scss'

interface Props {
  onClose: () => void
}

export default function LangaugesModal(props: Props) {
  const cvContext = useCreateVcCvContext()

  const [langs, setLangs] = useState<{ru: string, en: string}[]>([])
  const [langsDropdownActive, setLangsActive] = useState<boolean>(false)
  const [langRadioActive, setLangRadioActive] = useState<Languages>(null)
  const [levelsDropdownActive, setLevelsActive] = useState<boolean>(false)
  const [levelRadioActive, setLevelRadioActive] = useState<LanguageKnowLevel>()
  
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'))
    const langsObj = Object.entries(Languages).map(([key, value])=> {return {en: value, ru: languages.getName(value, 'ru')}
    })
    setLangs(langsObj)
  }, [])

  const onSaveHandler = () => {
    const lansgKnown = cvContext.helpObjects?.languageKnowledges||new Map
    cvContext.setHelpObjects({languageKnowledges: new Map([...lansgKnown, [langRadioActive, {language: langRadioActive, level: levelRadioActive}]])})
    props.onClose()
  }

  const body = (
    <Body 
    onClose={props.onClose} 
    onSave={onSaveHandler}  
    title={'Иностранные языки'} 
    withInput={false}
    disabledButton={!langRadioActive || !levelRadioActive}
    >
      <>
      <div className={styles.wrapper}>
        <p className={styles.title} onClick={()=>{setLangsActive(!langsDropdownActive)}}>Язык <ArrowDownSvg className={langsDropdownActive&&styles.arrow_active}/></p>
        <div className={classNames(styles.list, langsDropdownActive&&styles.list_active)}>
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
        <p className={styles.title} onClick={()=>{setLevelsActive(!levelsDropdownActive)}} >Уровень владения <ArrowDownSvg className={levelsDropdownActive&&styles.arrow_active}/></p>
        <div className={classNames(styles.list, levelsDropdownActive&&styles.list_active)}>
          {Object.values(LanguageKnowLevel).map((el, index)=> {
            return (
              <Radio 
              key={index}
              className={styles.item} 
              value={el} 
              label={TranslateLanguageKnowLevel(el)} 
              isActive={el === levelRadioActive} 
              onChange={(l)=> setLevelRadioActive(l as LanguageKnowLevel)}
              />
              )
          })}
        </div>
      </div>
      </>
    </Body>
  )

  return ( 
    <ModalLayout mobileFullScreen  className={styles.rootLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}