import RadioListField from 'components/fields/RadioListField'
import { ModalType, WorkExperience} from 'types/enums'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import AddButton from '@/components/ui/AddButton'
import RemovableItem from '@/components/ui/RemovableItem'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'
import { useSourcesContext } from 'context/sources_state'
import { useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import { TranslateWorkExperience } from 'utils/enumsTranslations'
import P from '@/components/ui/P'

interface Props {
}

export default function VacancyExperience(props: Props) {
  const {t} = useTranslation()
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()
  const sourcesContext = useSourcesContext()
  const {isTabletWidth} = appContext.size

  const removeSource = (el: number, type: 'activeSources'|'activeGeos'|'activeVerticals') => {
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
      appContext.showBottomSheet<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet, 0.4)
      return
    }
    appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet)
  }

  useEffect(()=>{
    sourcesContext.init(['geos', 'sources', 'verticals'])
  }, [])

  

  return ( <div className={styles.root}>

    <P className={styles.title} styleType={['medium','w500']} useThemeColor>{t('create_workExperience')}</P>
    <RadioListField 
    name={'experience'}
    wrapperClassName={styles.radioWrapper}
    options={
      Object.values(WorkExperience).map(el => {
        return {value: el, label: TranslateWorkExperience(el, t)}
      })
    } 
    />

    {cvContext?.activeSubCategory[0].withSources && <>
      <AddButton 
      className={styles.addButton} 
      onClick={()=>openSourcesModal({type: 'sources'})} 
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
    </>}

    {cvContext.activeSubCategory[0].withGeos && <>
      <AddButton 
      className={styles.addButton} 
      onClick={()=>openSourcesModal({type: 'geos'})} 
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
    </>}


    <AddButton 
    className={styles.addButton} 
    onClick={()=>openSourcesModal({type: 'verticals'})} 
    text={t('create_addVerticals')}
    title={t('create_sourcesDescription')} 
    /> 
    {cvContext.helpObjects?.activeVerticals?.size > 0 &&<>
      <div className={styles.itemsWrapper}>
      {cvContext.helpObjects && cvContext.helpObjects?.activeVerticals &&[...cvContext.helpObjects?.activeVerticals?.entries()]
      .map(([key, value])=> 
      <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key, 'activeVerticals')}/>
      )}
      </div>
    </>}

  
  </div>)
}