import styles from './index.module.scss'

import RadioListField from 'components/fields/RadioListField'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { ExperienceInfo } from 'data/interfaces/Common'
import { ICVCreate } from 'data/interfaces/ICV'
import { useFormikContext } from 'formik'
import { useAppContext } from 'context/state'
import { ModalType } from 'types/enums'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'

interface Props {
  name: string
}

export default function Experience(props: Props) {
  const appContext = useAppContext()
  const formikContext = useFormikContext<ICVCreate>()
  const values = formikContext.values

  const removeExp = (e: ExperienceInfo) => {
    const filtered = formikContext.values.experienceInfo.filter(exp => exp !== e)
    formikContext.setValues({...formikContext.values, experienceInfo: filtered})
  }

  const onAddButtonClick = () => {
    appContext.showModal<IDetailsModalProps>(ModalType.DetailsModal, {
      type: 'experienceInfo', 
      values: {
        experienceInfo:[{
          company: '',
          position: '',
          toDate: '',
          fromDate: '',
          toPresent: true,
          description: ''
        }]
      },
      onSubmit: (data) => {
        const exp = formikContext.values.experienceInfo
        exp.push(...data.experienceInfo)
        formikContext.setValues({...formikContext.values, ...exp})
        appContext.hideModal()
      }
    })
  }


  return (
    <div className={styles.root}>
      <RadioListField 
      name={'workExperiencePresense'}     
      itemCircleClassname={styles.radioCircle}
      activeItemClassName={styles.radioItemActive}
      wrapperClassName={styles.radioWrapper}
      options={[
        {label: 'Есть опыт', value: 'present'},
        {label: 'Нет опыта', value: 'absent'},
      ]} 
      />   
      
      {values.workExperiencePresense === 'present' 
      &&values.experienceInfo.length>0
      &&values.experienceInfo
      .map((el, index)=> {
        return (<div 
          key={index}
        className={styles.experienceWrapper} 
        >
          <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по н.в.'}</p>
          <p className={styles.companyName}>{el.company}</p>
          <p className={styles.description}>{el.description}</p>
          <Button type='button' className={styles.trashButton} onClick={()=>removeExp(el)}><TrashBasketSvg/></Button>
        </div>)
      }) 
      }

      {values.workExperiencePresense === 'present' &&
        <AddButton onClick={onAddButtonClick} text='Добавить место работы'/>
      }
    </div>
  )
}