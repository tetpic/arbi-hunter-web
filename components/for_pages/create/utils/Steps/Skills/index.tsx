import styles from './index.module.scss'

import RadioListField from 'components/fields/RadioListField'
import AddButton from 'components/ui/AddButton'
import RemovableItem from 'components/ui/RemovableItem'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import { CoursesInfo, ISource, PreviewImage } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { Answer, ModalType } from 'types/enums'
import languages from '@cospired/i18n-iso-languages'
import { ILanguageKnowledge } from 'data/interfaces/IJob'
import { IPortfolioModal } from 'components/modals/AddPortfolioModal'
import { ICVCreate } from 'data/interfaces/ICV'
import { TranslateLanguage, TranslateLanguageKnowLevel } from 'utils/enumsTranslations'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'
import { ISkillModalProps } from '@/components/modals/CvModals/Skills'
import { ILangaugesModalArgs } from '@/components/modals/CvModals/Languages'
import FilesList from '@/components/ui/FilesList'
import { useSourcesContext } from 'context/sources_state'
import useTranslation from 'next-translate/useTranslation'
import P from '@/components/ui/P'
import TagList from '@/components/ui/TagList'
import Spacer from '@/components/ui/Spacer'


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
  const cvContext = useCreateVcCvContext()
  const appContext  = useAppContext()
  const sourcesContext = useSourcesContext()
  const {isTabletWidth} = appContext.size
  const {t} = useTranslation()

  const initialCoursesData: CoursesInfo = {
    date: '',
    location: '',
    name: ''
  }

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
      cvContext.setRecommendedSkills()
  }, [cvContext.activeSubCategory])
  

  useEffect(()=>{
    languages.registerLocale(require('@cospired/i18n-iso-languages/langs/ru.json'))
    if(cvContext?.activeSubCategory[0]?.withGeos || cvContext?.activeSubCategory[0]?.withSources) {
      sourcesContext.init(['geos', 'sources', 'verticals'])
    }
    else {
      sourcesContext.init(['verticals'])
    }
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

  const removeSource = (el: number, type: 'activeSources' | 'activeGeos'| 'activeVerticals') => {
    const helperState = cvContext.helpObjects
    helperState[type].delete(el)
    cvContext.setHelpObjects({...helperState})
  }

  const openSourcesModal = (t: Pick<ISoursesModalArgs, 'type'>) => {
    
    const dataToSet:ISoursesModalArgs = {
      type: t.type,
      onSubmit: (activeSources)=>{
        const newObject = {...cvContext.helpObjects, [t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']: activeSources}
        cvContext.setHelpObjects(newObject)
        isTabletWidth?appContext.hideBottomSheet():appContext.hideModal()
      },
      data: [...sourcesContext[t.type].values()],
      choosenElements: new Map(cvContext.helpObjects[t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals'])
    }
    if (isTabletWidth) {
      appContext.showBottomSheet<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet, (t.type ==='verticals'&&380||t.type === 'geos'&&250||460))
      return
    }
    appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet)
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
      onSubmit: (data, fs) => {
        
        setFieldValue('portfolio', data.portfolio)
        setFieldValue('assetsIds', data.assetsIds)
        cvContext.setHelpObjects({...cvContext.helpObjects, assets: fs})
      },
      portfolio: values.portfolio,
      initialFiles: cvContext.helpObjects?.assets
    }
    if(isTabletWidth) {
      appContext.showBottomSheet<IPortfolioModal>(ModalType.AddPortfolioModal, portfolioProps, 280)
    }
    else {
      appContext.showModal<IPortfolioModal>(ModalType.AddPortfolioModal, portfolioProps)
    }
  }

  return ( <div className={styles.root}>
    {cvContext.recommendedSkills.size>0 &&
      <>
      <P styleType={['w600', 'large']} useThemeColor>{t('create_recommendedSkills')}</P>
      <Spacer basis={16}/>
      <TagList tags={[...cvContext.recommendedSkills.values()].filter(el => !cvContext.helpObjects.skills?.get(el.id)).map(s => ({name: s.title, isActive: false, onClick: ()=>{
        cvContext.setHelpObjects({...cvContext.helpObjects, skills: new Map([...cvContext.helpObjects.skills, [s.id, s]])})
      }}))}/>
      </>
    }
    <AddButton 
    test={'addSkill'}
    className={styles.addButton} 
    onClick={()=>appContext.showModal<ISkillModalProps>(ModalType.SkillsModal, {
      choosenSkills: cvContext.helpObjects?.skills,
      onSubmit: (data) => {
        const helpSkills = cvContext.helpObjects?.skills
        cvContext.setHelpObjects({...cvContext.helpObjects, skills: new Map([...data])})
        appContext.hideModal()
      }
    })} 
    text={t('create_addSkill')}
    />
    {cvContext.helpObjects?.skills?.size > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&&[...cvContext.helpObjects?.skills.values()]
        .map((el: ISource)=> <RemovableItem key={el.id} onClick={()=>removeSkill(el)} text={el.title}/>)
        }
      </div>
    } 

    {
      (cvContext?.activeSubCategory[0]?.withGeos || cvContext?.activeSubCategory[0]?.withSources) && !props.fieldToHide?.traffic &&
      <>
      <AddButton 
      test={'addSources'}
      className={styles.addButton} 
      onClick={()=>{openSourcesModal({type: 'sources'})}} 
      text={t('create_addSources')}
      title={t('create_sourcesDescription')} 
      /> 
      {cvContext.helpObjects?.activeSources?.size > 0 &&
       <>
         <div className={styles.itemsWrapper}>
            {cvContext.helpObjects && [...cvContext.helpObjects?.activeSources.entries()]
              .map(([key, value])=> 
              <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeSources')}/>
            )}
          </div>
        </>
      }
      <AddButton 
      test={'addGeos'}
      className={styles.addButton} 
      onClick={()=>{openSourcesModal({type: 'geos'})}} 
      text={t('create_addGeos')}
      title={t('create_sourcesDescription')} 
      /> 
      {cvContext.helpObjects?.activeGeos?.size > 0 &&
        <>
          <div className={styles.itemsWrapper}>
            {cvContext.helpObjects && [...cvContext.helpObjects?.activeGeos.entries()]
             .map(([key, value])=> 
             <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeGeos')}/>
            )}
          </div>
        </>
      }
      </>
    }

    {!props.fieldToHide?.traffic && <>
      <AddButton 
      test={'addVerticals'}
      className={styles.addButton} 
      onClick={()=>{openSourcesModal({type: 'verticals'})}} 
      text={t('create_addVerticals')}
      title={t('create_sourcesDescription')} 
      /> 
      {cvContext.helpObjects?.activeVerticals?.size > 0 &&
        <>
        <div className={styles.itemsWrapper}>
        {cvContext.helpObjects && [...cvContext.helpObjects?.activeVerticals.entries()]
          .map(([key, value])=> 
          <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
          )}
          </div>
          </>
        }
    </>}

    <AddButton 
    test={'addLanguage'}
    className={styles.addButton} 
    onClick={()=>{appContext.showModal<ILangaugesModalArgs>(ModalType.LanguageModal, {
      onSubmit: (data) => {
        const lansgKnown = cvContext.helpObjects?.languageKnowledges||new Map
        lansgKnown.set(data.language, data)
        cvContext.setHelpObjects({languageKnowledges: new Map(lansgKnown)})
        appContext.hideModal()
      },
    })}} 
    text={t('foreignLanguages')}
    />
    {cvContext.helpObjects?.languageKnowledges?.size > 0 &&
      <div className={styles.itemsWrapper}>
        {cvContext.helpObjects&& [...cvContext.helpObjects?.languageKnowledges.values()]
        .map((el)=> <RemovableItem key={el.language} onClick={()=>removeLanguage(el)} text={(TranslateLanguage(el.language, t) + ', ' + TranslateLanguageKnowLevel(el.level, true))} /> )
        }
      </div>
    } 


    {!props.fieldToHide?.relocation===true && 
      <div className={styles.radioSection}>
        <p className={styles.subTitle}>
          {t('create_cv_relocation')}
        </p>
        <RadioListField 
        name={'relocation'} 
        wrapperClassName={styles.radioWrapper}
        options={[
          {value: Answer.Yes, label: t('create_cv_relocationYes')},
          {value: Answer.No, label: t('create_cv_relocationNo')}
        ]}/>
      </div>
    }

    {!props.fieldToHide?.portfolio  && <>
      <AddButton 
      test={'addPortfolio'}
      className={styles.addButton} 
      onClick={onAddPortfolioClick} 
      text={t('create_addPortfolio')} />
      {values.portfolio &&
        <div className={styles.itemsWrapper}>
          <RemovableItem text={values.portfolio} onClick={()=>setFieldValue('portfolio', '')}/>
        </div>
      }
      <FilesList 
      previews={cvContext.helpObjects.assets.map(el=> ({data: el, loaded: true, id: el.id })) as PreviewImage[]} 
      onRemove={(rawId, id)=>{
        cvContext.setHelpObjects({...cvContext.helpObjects, assets: cvContext.helpObjects.assets.filter(el=> el.id !== Number(id))})

      }}
      />
    </>}
  </div>)
}