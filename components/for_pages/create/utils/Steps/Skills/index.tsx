import styles from './index.module.scss'

import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import RemovableItem from 'components/ui/RemovableItem'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import { CoursesInfo, ISource } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { Answer, ModalType } from 'types/enums'
import languages from '@cospired/i18n-iso-languages'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IPortfolioModal } from 'components/modals/AddPortfolioModal'
import { ICVCreate } from 'data/interfaces/ICV'
import { TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'


type SkillsFields = {
  skills?: boolean,
  langs?: boolean,
  courses?: boolean,
  traffic?: boolean,
  relocation?: boolean,
  portfolio?: boolean
}

interface Props {
  fieldToHide?: SkillsFields
}

export default function Skills(props: Props) {

  const initialCoursesData: CoursesInfo = {
    date: '',
    location: '',
    name: ''
  }

  const cvContext = useCreateVcCvContext()
  const appContext  = useAppContext()
  const {isTabletWidth} = appContext.size

  const [showCoursesDetails, setCoursesDetails] = useState<boolean>(false)
  const [detailsCoursesInfo, setDetailsCoursesInfo] = useState<CoursesInfo[]>(cvContext.currentCv?.coursesInfo||[])
  const [activeDetails, setActiveDetails] = useState<CoursesInfo>(initialCoursesData)
  const {values, setFieldValue, setFieldError, setFieldTouched} = useFormikContext<ICVCreate>()

  const closeModalHandler = (fl: CoursesInfo) => {
    setDetailsCoursesInfo(f=> [...f, {...fl}])
    setCoursesDetails(false)
    setActiveDetails(initialCoursesData)
    appContext.hideModal()
  }


  useEffect(()=>{
    const values =  ['setName', 'setLocation', 'setYear']
    if(!showCoursesDetails) {
     values.map(el=> {
        setFieldTouched(el, false)
      })
    }
    else {
      values.map(el=> {
        setFieldTouched(el, true)
      })
    }
  }, [showCoursesDetails])

  useEffect(()=>{    
    if(!props.fieldToHide?.courses) {
      setFieldValue('coursesInfo', [...detailsCoursesInfo])
      let currentCv = cvContext.currentCv
      cvContext.setCurrentCv({...currentCv, coursesInfo: [...detailsCoursesInfo]})
    }
  }, [detailsCoursesInfo, props.fieldToHide?.courses])

  useEffect(()=>{
    setFieldValue('skillsIds', cvContext.currentCv?.skillsIds)
  }, [cvContext.currentCv])

  useEffect(()=>{
  }, [cvContext.helpObjects])

  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
  }, [])

  const removeLanguage = (l: ILanguageKnowledge) => {
    const helperState = cvContext.helpObjects
    const filteredLangs = helperState.languageKnowledges
    filteredLangs.delete(l.language)
    cvContext.setHelpObjects({...helperState, languageKnowledges: filteredLangs})
  }

  const removeSkill = (s: ISource) => {
    const helperState = cvContext.helpObjects
    const filteredSkills = [...helperState.skills.values()].filter(e=> e.id !== s.id)
    cvContext.setHelpObjects({...helperState, skills: new Map(filteredSkills.map(el=> [el.id, el]))})
  }

  const removeSource = (el: number) => {
    const helperState = cvContext.helpObjects
    helperState.activeSources.delete(el)
    cvContext.setHelpObjects({...helperState})
  }
  
  const removeGeo = (el: number) => {
    const helperState = cvContext.helpObjects
    helperState.activeGeos.delete(el)
    cvContext.setHelpObjects({...helperState})
  }


  const removeVertical= (el: number) => {
    const helperState = cvContext.helpObjects
    helperState.activeVerticals.delete(el)
    cvContext.setHelpObjects({...helperState})
  }

  const onAddCoursesClick = () => {
    setCoursesDetails(true)
    appContext.showModal<IDetailsModalProps>(ModalType.DetailsModal, {
      type: 'coursesInfo',
      values: {
        coursesInfo: [{
          name: '',
          location: '',
          date: '',
        }]
      },
      onSubmit: (data) => {
        const coursesInfo = values.coursesInfo
        coursesInfo?.push(data.coursesInfo[0])
        setFieldValue('coursesInfo', coursesInfo)
        appContext.hideModal()
      }
    })
  }

  const onAddPortfolioClick = () => {
    const portfolioProps: IPortfolioModal = {
      onSubmit: (data) => {
        debugger
        setFieldValue('portfolio', data.portfolio)
        setFieldValue('assetsIds', data.assetsIds)
      },
      portfolio: values.portfolio
    }
    if(isTabletWidth) {
      appContext.showBottomSheet<IPortfolioModal>(ModalType.AddPortfolioModal, portfolioProps, 240)
    }
    else {
      appContext.showModal<IPortfolioModal>(ModalType.AddPortfolioModal, portfolioProps)
    }
  }

  return ( <div className={styles.root}>
    <AddButton 
    className={styles.addButton} 
    onClick={()=>appContext.showModal(ModalType.SkillsModal)} 
    text={'Добавить навык'}
    />
    {cvContext.helpObjects?.skills?.size > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&&[...cvContext.helpObjects?.skills.values()]
        .map((el: ISource)=> <RemovableItem key={el.id} onClick={()=>removeSkill(el)} text={el.title}/>)
        }
      </div>
    } 

    {
      (cvContext?.activeSubCategory[0].withGeos || cvContext?.activeSubCategory[0].withSources) && !props.fieldToHide?.traffic &&
      <>
      <AddButton 
      className={styles.addButton} 
      onClick={()=>{appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, {type: 'sources'})}} 
      text={'Добавить источники'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
      /> 
      {cvContext.helpObjects?.activeSources?.size > 0 &&
       <>
         <div className={styles.itemsWrapper}>
            {cvContext.helpObjects && [...cvContext.helpObjects?.activeSources.entries()]
              .map(([key, value])=> 
              <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key)}/>
            )}
          </div>
        </>
      }
      <AddButton 
      className={styles.addButton} 
      onClick={()=>{appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, {type: 'geos'})}} 
      text={'Добавить гео'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
      /> 
      {cvContext.helpObjects?.activeGeos?.size > 0 &&
        <>
          <div className={styles.itemsWrapper}>
            {cvContext.helpObjects && [...cvContext.helpObjects?.activeGeos.entries()]
             .map(([key, value])=> 
             <RemovableItem key={value.id} text={value.title} onClick={()=>removeGeo(key)}/>
            )}
          </div>
        </>
      }
      </>
    }

    {!props.fieldToHide?.traffic && <>
      <AddButton 
      className={styles.addButton} 
      onClick={()=>{appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, {type: 'verticals'})}} 
      text={'Добавить вертикали'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
      /> 
      {cvContext.helpObjects?.activeVerticals?.size > 0 &&
        <>
        <div className={styles.itemsWrapper}>
        {cvContext.helpObjects && [...cvContext.helpObjects?.activeVerticals.entries()]
          .map(([key, value])=> 
          <RemovableItem key={value.id} text={value.title} onClick={()=>removeVertical(key)}/>
          )}
          </div>
          </>
        }
    </>}

    <AddButton 
    className={styles.addButton} 
    onClick={()=>{appContext.showModal(ModalType.LanguageModal)}} 
    text={'Иностранные языки'}
    />
    {cvContext.helpObjects?.languageKnowledges?.size > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&& [...cvContext.helpObjects?.languageKnowledges.values()]
        .map((el)=> <RemovableItem key={el.language} onClick={()=>removeLanguage(el)} text={(languages.getName(el.language, 'ru') + ', ' + TranslateLanguageKnowLevel(el.level, true))} /> )
        }
      </div>
    } 

    {!props.fieldToHide?.courses === true && <>
      <AddButton 
      className={styles.addButton} 
      onClick={onAddCoursesClick} 
      text={'Повышение квалификации и курсы'}
      /> 
      {values?.coursesInfo?.length > 0 &&
        <div className={styles.itemsWrapper}>
        {values?.coursesInfo
          .map((el)=> 
            <RemovableItem key={el.date} text={el.name} onClick={()=>{
              setDetailsCoursesInfo(state=> state.filter(f=> f.name !== el.name))
              }
            }/>
          )}
        </div>
      }
    </>}



    {!props.fieldToHide?.relocation===true && 
      <div className={styles.radioSection}>
        <p className={styles.subTitle}>
          Переезд
        </p>
        <RadioListField 
        name={'relocation'} 
        wrapperClassName={styles.radioWrapper}
        options={[
          {value: Answer.Yes, label: 'Возможен'},
          {value: Answer.No, label: 'Не возможен'}
        ]}/>
      </div>
    }

    {!props.fieldToHide?.portfolio  && <>
      <AddButton 
      className={styles.addButton} 
      onClick={onAddPortfolioClick} 
      text={'Добавить порфтолио'} />
      {values.portfolio &&
        <div className={styles.itemsWrapper}>
          <RemovableItem text={values.portfolio} onClick={()=>setFieldValue('portfolio', '')}/>
        </div>
      }
    </>}
  </div>)
}