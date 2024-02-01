import RadioListField from 'components/fields/RadioListField'
import { ModalType, WorkExperience} from 'types/enums'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import AddButton from '@/components/ui/AddButton'
import RemovableItem from '@/components/ui/RemovableItem'
import { ISoursesModalArgs } from '@/components/modals/CvModals/Sourses'

interface Props {
}

export default function VacancyExperience(props: Props) {
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const removeSource = (el: number, type: 'activeSources'|'activeGeos'|'activeVerticals') => {
    const helperState = cvContext.helpObjects
    helperState[type].delete(el)
    cvContext.setHelpObjects({...helperState})
  }

  const openSourcesModal = (t: Pick<ISoursesModalArgs, 'type'>) => {
    const dataToSet:ISoursesModalArgs = {
      type: t.type,
      onClose: (activeSources)=>{
        const newObject = {...cvContext.helpObjects, [t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']: activeSources}
        cvContext.setHelpObjects(newObject)
        appContext.hideModal()
      },
      data: cvContext.helpObjects[t.type === 'sources'? 'sources':t.type === 'geos'? 'geos':'verticals'],
      choosenElements: cvContext.helpObjects[t.type === 'sources'? 'activeSources':t.type === 'geos'? 'activeGeos':'activeVerticals']
    }
    if (isTabletWidth) {
      appContext.showBottomSheet<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet, 0.4)
      return
    }
    appContext.showModal<ISoursesModalArgs>(ModalType.SourcesModal, dataToSet)
  }

  

  return ( <div className={styles.root}>

    <p className={styles.title}>Опыт работы</p>
    <RadioListField 
    name={'experience'}
    wrapperClassName={styles.radioWrapper}
    options={[
      {value: WorkExperience.NoExperience, label: 'Без опыта'},
      {value: WorkExperience.From1to3, label: '1-3 года'},
      {value: WorkExperience.From3to6, label: '3-6 лет'},
      {value: WorkExperience.From6, label: 'От 6 лет'}
    ]} 
    />

    {
      (cvContext?.helpObjects?.categoryIds[0]?.withGeos || cvContext?.helpObjects?.categoryIds[0]?.withSources) &&
      <>
      <AddButton 
      className={styles.addButton} 
      onClick={()=>openSourcesModal({type: 'sources'})} 
      text={'Добавить источники'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
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
      className={styles.addButton} 
      onClick={()=>openSourcesModal({type: 'geos'})} 
      text={'Добавить гео'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
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

    <AddButton 
    className={styles.addButton} 
    onClick={()=>openSourcesModal({type: 'verticals'})} 
    text={'Добавить вертикали'}
    title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
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