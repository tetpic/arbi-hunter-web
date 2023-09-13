import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { useEffect,  useState } from 'react'
import Body from '../Body'
import languages from '@cospired/i18n-iso-languages'
import classNames from 'classnames'
import { LanguageKnowLevel, Languages } from 'types/enums'
import Radio from 'components/fields/RadioListField/Radio'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import styles from './index.module.scss'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'

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

  const langLevels = [
    {name: LanguageKnowLevel.Beginner,  translate: 'Начинающий'}, 
    {name: LanguageKnowLevel.Intermediate,  translate: 'Средний'}, 
    {name: LanguageKnowLevel.Advanced, translate: 'Продвинутый' }, 
    {name: LanguageKnowLevel.Professional,  translate: 'Профессионал'}, 
  ]
  
  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/en.json'))
    const langsObj = Object.entries(Languages).map(([key, value])=> {return {en: value, ru: languages.getName(value, 'ru')}
    })
    setLangs(langsObj)
  }, [])

  const onSaveHandler = () => {
    const lansgKnown = cvContext.helpObjects?.languageKnowledges||[]
    cvContext.setHelpObjects({languageKnowledges: [...lansgKnown, {language: langRadioActive, level: levelRadioActive, ru: languages.getName(langRadioActive, 'ru')}]})
    props.onClose()
  }

  const body = (
    <Body 
    onClose={props.onClose} 
    onSave={onSaveHandler}  
    title={'Иностранные языки'} 
    withInput={false}
    >
      <>
      <div className={styles.wrapper}>
        <p className={styles.title} onClick={()=>{setLangsActive(!langsDropdownActive)}}>Язык <ArrowDownSvg className={langsDropdownActive&&styles.arrow_active}/></p>
        <div className={classNames(styles.list, langsDropdownActive&&styles.list_active)}>
          {langs&&langs.map(el => {
              return (
                <Radio 
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
          {langLevels.map(el=> {
            return (
              <Radio 
              className={styles.item} 
              value={el.name} 
              label={el.translate} 
              isActive={el.name === levelRadioActive} 
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
    <ModalLayout  className={styles.rootLayout}>
      <ModalBody>
        {body}
      </ModalBody>
    </ModalLayout>
  )
}