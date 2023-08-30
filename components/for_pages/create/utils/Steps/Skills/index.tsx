import RadioListField from 'components/fields/RadioListField'
import CrossSvg from 'components/svg/CrossSvg'
import AddButton from 'components/ui/AddButton'
import { useCvContext } from 'context/cv_state'
import { useAppContext } from 'context/state'
import { CoursesInfo, ISkill } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { Answer, ModalType } from 'types/enums'
import DetailsField from '../../DetailsField'
import styles from './index.module.scss'


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

  const cvContext = useCvContext()
  const appContext  = useAppContext()

  const [showCoursesDetails, setCoursesDetails] = useState<boolean>(false)
  const [detailsCoursesInfo, setDetailsCoursesInfo] = useState<CoursesInfo[]>(cvContext.currentCv?.coursesInfo||[])
  const [activeDetails, setActiveDetails] = useState<CoursesInfo>(initialCoursesData)
  const {setFieldValue} = useFormikContext()


  const closeModalHandler = (fl: CoursesInfo) => {
    setDetailsCoursesInfo(f=> [...f, {...fl}])
    setCoursesDetails(false)
    setActiveDetails(initialCoursesData)
  }

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


  const removeSource = (el: ISkill) => {
    const helperState = cvContext.helpObjects
    helperState.activeSources.delete(el)
    cvContext.setHelpObjects({...helperState})
  }

  return ( <div className={styles.root}>

    <AddButton 
    className={styles.addButton} 
    onClick={()=>appContext.showModal(ModalType.SkillsModal)} 
    text={'Добавить навык'}
    />
    {cvContext.helpObjects?.skills?.length > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&&cvContext.helpObjects?.skills
        .map((el: ISkill)=> <p className={styles.item}>{el.title} <CrossSvg className={styles.crossSvg}/></p>)
        }
      </div>
    } 

    <AddButton 
    className={styles.addButton} 
    onClick={()=>{appContext.showModal(ModalType.LanguageModal)}} 
    text={'Иностранные языки'}
    />
    {cvContext.helpObjects?.languageKnowledges?.length > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&&cvContext.helpObjects?.languageKnowledges
        .map((el)=> <p className={styles.item}>{el.ru} <CrossSvg className={styles.crossSvg}/></p>)
        }
      </div>
    } 

    {!props.fieldToHide?.courses === true && <>
      <AddButton 
      className={styles.addButton} 
      onClick={()=>{setCoursesDetails(true)}} 
      text={'Повышение квалификации и курсы'}
      /> 
      {cvContext.currentCv?.coursesInfo?.length > 0 &&
        <div className={styles.itemsWrapper}>
        {cvContext.currentCv&&cvContext.currentCv?.coursesInfo
          .map((el)=> 
            <p 
            className={styles.item} 
            onClick={()=>{
              setActiveDetails(el); 
              setCoursesDetails(true)}
            }>
              {el.name} <CrossSvg className={styles.crossSvg}/>
            </p>
          )}
        </div>
      }
    </>}

    <AddButton 
    className={styles.addButton} 
    onClick={()=>{appContext.showModal(ModalType.SourcesModal)}} 
    text={'Источники трафика'}
    title={'Маркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт.'} 
    /> 
     {cvContext.helpObjects?.activeSources?.size > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects && Array.from(cvContext.helpObjects?.activeSources)
        .map((el)=> 
          <p className={styles.item}>
            {el.title} <CrossSvg className={styles.crossSvg} onClick={()=>removeSource(el)}/>
          </p>
        )}
      </div>
    }

    
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

    {!props.fieldToHide?.portfolio  && 
      <AddButton className={styles.addButton} onClick={()=> {}} text={'Добавить порфтолио'} />
    }

    {showCoursesDetails &&
      <DetailsField
      title='Повышение квалификации и курсы'
      set={activeDetails}
      onSave={closeModalHandler}
      onClose={()=> setCoursesDetails(false)}
      inputsSettings={[
        {label: 'Название учреждения:', name: 'setLocation', value: 'location'},
        {label: 'Название курсов:', name: 'setName', value: 'name'}
      ]}
      datePickerSettings={{
        on: true,
        formatter: {year: 'numeric'},
        dates: [
          {
            format: 'yyyy',
            pickerType: 'showYearPicker',
            yearDropdown: true,
            inputLabel: 'Год окончания:',
            dateName: 'setYear',
            dateValue: 'date'
          }
        ]
      }}
      />    
    }
  
  </div>)
}