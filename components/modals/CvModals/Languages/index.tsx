import ModalBody from 'components/layout/Modal/ModalBody'
import ModalLayout from 'components/layout/Modal/ModalLayout'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import Body from '../Body'
import styles from './index.module.scss'
import languages from '@cospired/i18n-iso-languages'
import DropDown from 'components/ui/DropDown'
import classnames from 'classnames'
import classNames from 'classnames'
import { LanguageKnowLevel } from 'types/enums'
import RadioListField from 'components/fields/RadioListField'
import Radio from 'components/fields/RadioListField/Radio'
import { useFormikContext } from 'formik'
import { useCvContext } from 'context/cv_state'

interface Props {
  onClose: () => void
}

export default function LangaugesModal(props: Props) {
  const cvContext = useCvContext()
 

  const [langs, setLangs] = useState<string[]>([])
  const [langsActive, setLangsActive] = useState<boolean>(false)
  const [langRadioActive, setLangRadioActive] = useState<string>('')
  const [levelsActive, setLevelsActive] = useState<boolean>(false)
  const [levelRadioActive, setLevelRadioActive] = useState<LanguageKnowLevel>()

  const langLevels = [
    {name: LanguageKnowLevel.Beginner,  translate: 'Начинающий'}, 
    {name: LanguageKnowLevel.Intermediate,  translate: 'Средний'}, 
    {name: LanguageKnowLevel.Advanced, translate: 'Продвинутый' }, 
    {name: LanguageKnowLevel.Professional,  translate: 'Профессионал'}, 
  ]
  
  useEffect(()=>{
    languages.registerLocale(require("@cospired/i18n-iso-languages/langs/ru.json"));
    setLangs(Object.values(languages.getNames('ru')))
  }, [])

  const onSaveHandler = () => {
    debugger
    const lansgKnown = cvContext.helpObjects?.languageKnowledges||[]
    console.log(languages.getAlpha2Code(langRadioActive, 'en'))
    cvContext.setHelpObjects({languageKnowledges: [...lansgKnown, {language: languages.getAlpha2Code(langRadioActive, 'en'), level: levelRadioActive}]})
    
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
        <p className={styles.title} onClick={()=>{setLangsActive(!langsActive)}}>Язык</p>
        <div className={classNames(styles.list, langsActive&&styles.list_active)}>
          {langs&&langs.map(el => {
              return (
                <Radio 
                className={styles.item} 
                isActive={el===langRadioActive} 
                value={el} 
                label={el} 
                onChange={(s) => setLangRadioActive(s)}
                />)
            }) 
          }
        </div>
      </div>
      <div className={styles.wrapper}>
        <p className={styles.title} onClick={()=>{setLevelsActive(!levelsActive)}} >Уровень владения</p>
        <div className={classNames(styles.list, levelsActive&&styles.list_active)}>
          {langLevels.map(el=> {
            return (
              <Radio 
              className={styles.item} 
              value={el.name} 
              label={el.translate} 
              isActive={el.name === levelRadioActive} 
              onChange={(s)=> setLevelRadioActive(s as LanguageKnowLevel)}
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