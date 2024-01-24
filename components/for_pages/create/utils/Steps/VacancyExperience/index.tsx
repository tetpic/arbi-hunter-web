import RadioListField from 'components/fields/RadioListField'
import { ModalType, WorkExperience} from 'types/enums'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useAppContext } from 'context/state'
import AddButton from '@/components/ui/AddButton'
import RemovableItem from '@/components/ui/RemovableItem'

interface Props {
}

export default function VacancyExperience(props: Props) {
  const cvContext = useCreateVcCvContext()
  const appContext = useAppContext()

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
      onClick={()=>{appContext.showModal(ModalType.SourcesModal)}} 
      text={'Источники трафика и гео'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
      /> 
      {cvContext.helpObjects?.activeSources?.size > 0 &&
       <>
         <div className={styles.itemsWrapper}>
            <p className={styles.title}>Источники трафика</p>
            {cvContext.helpObjects && [...cvContext.helpObjects?.activeSources.entries()]
              .map(([key, value])=> 
              <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key)}/>
            )}
          </div>
        </>
      }
      {cvContext.helpObjects?.activeGeos?.size > 0 &&
        <>
          <div className={styles.itemsWrapper}>
          <p className={styles.title}>Гео</p>
            {cvContext.helpObjects && [...cvContext.helpObjects?.activeGeos.entries()]
             .map(([key, value])=> 
             <RemovableItem key={value.id} text={value.title} onClick={()=>removeGeo(key)}/>
            )}
          </div>
        </>
      }

      <AddButton 
      className={styles.addButton} 
      onClick={()=>{appContext.showModal(ModalType.SourcesModal)}} 
      text={'Вертикали'}
      title={'Маркетинг/Геомаркетинг. Сайты, платформы и каналы, с которых аудитория переходит на ваш сайт. Взаимодействие с локальной аудиторией, выделенной по географическому признаку.'} 
      /> 
      {cvContext.helpObjects?.activeSources?.size > 0 &&
        <>
        <div className={styles.itemsWrapper}>
        <p className={styles.title}>Источники трафика</p>
        {cvContext.helpObjects && [...cvContext.helpObjects?.activeSources.entries()]
        .map(([key, value])=> 
        <RemovableItem key={value.id} text={value.title} onClick={()=>removeSource(key)}/>
        )}
        </div>
        </>
      }
      </>
    }
  
  </div>)
}