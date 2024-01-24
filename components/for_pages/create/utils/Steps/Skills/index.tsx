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
import { DetailsFieldProps } from '../../DetailsField'
import languages from '@cospired/i18n-iso-languages'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IPortfolioModal } from 'components/modals/AddPortfolioModal'
import { ICVCreate } from 'data/interfaces/ICV'
import { TranslateLanguageKnowLevel } from 'utils/enumsTranslations'


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

  const detailsFieldProps: DetailsFieldProps<CoursesInfo> = {
    title:'Повышение квалификации и курсы',
    set: activeDetails,
    onSave: closeModalHandler,
    onEditValidator: (fields) => {
      const today = new Date()
      const fromDate = new Date(fields.date)
      if(fromDate > today) {
        return {error: 'Дата начала не может быть в будущем'}
      }
      else {
        return true
      }
    },
    onClose: ()=> {
      setCoursesDetails(false)
      appContext.hideModal()
    },
    inputsSettings: [
      {label: 'Название учреждения:', name: 'location', value: '', required: true, errorState: 'Введите название учреждения'},
      {label: 'Название курсов:', name: 'name', value: '', required: true, errorState: 'Введите название курсов' }
    ],
    datePickerSettings:{
        on: true,
        formatter: {year: 'numeric'},
        dates: [
          {
            format: 'yyyy',
            pickerType: 'showYearPicker',
            yearDropdown: true,
            inputLabel: 'Год окончания:',
            dateName: 'date',
            dateValue: '',
            required: true,
            errorState: 'Укажите год окончания курсов'
          }
        ]
      }
  }

  const onAddCoursesClick = () => {
    setCoursesDetails(true)
    appContext.showModal(ModalType.DetailsModal, detailsFieldProps)
  }

  const onAddPortfolioClick = () => {
    const portfolioProps: IPortfolioModal = {
      onSubmit: (data) => {
        setFieldValue('portfolio', data.portfolio)
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
      {cvContext.currentCv?.coursesInfo?.length > 0 &&
        <div className={styles.itemsWrapper}>
        {cvContext.currentCv&&cvContext.currentCv?.coursesInfo
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