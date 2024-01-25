import RadioListField from 'components/fields/RadioListField'
import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { EducationInfo } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { EducationTypes, ModalType } from 'types/enums'
import styles from './index.module.scss'
import { useAppContext } from 'context/state'
import { ICVCreate } from 'data/interfaces/ICV'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'

interface Props {
  name: string
}

export default function Education(props: Props) {

  const appContext = useAppContext()
  const {values, setFieldValue, setFieldError, setFieldTouched} = useFormikContext<ICVCreate>()

  const removeItem = (e: EducationInfo) => {
    setFieldValue('educationInfo', values.educationInfo?.filter(el=> el !== e))
  }

  const onAddButtonClick = () => {
    appContext.showModal<IDetailsModalProps>(ModalType.DetailsModal, {
      values: {
        educationInfo: [{
          institution: '',
          speciality: '',
          fromDate: '',
          toDate: '',
          toPresent: true,
          faculity: ''
        }]
      },
      type: 'educationInfo',
      onSubmit: (data) => {
        const educationInfo = values.educationInfo
        educationInfo?.push(data.educationInfo[0])
        setFieldValue('educationInfo', educationInfo)
        appContext.hideModal()
      }
    })
  }

  return (<>
  <RadioListField 
  wrapperClassName={styles.radiosWrapper}
  options={[
    {label: 'Нет образования', value: 'no'},
    {label: 'Среднее', value: EducationTypes.Secondary},
    {label: 'Средне специальное', value: EducationTypes.SecondarySpecial},
    {label: 'Неоконченное высшее', value: EducationTypes.IncompleteHigher},
    {label: 'Высшее', value: EducationTypes.Higher},
    {label: 'Бакалавр', value: EducationTypes.Bachelor},
    {label: 'Магистр', value:EducationTypes.Master},
    {label: 'Кандидат наук', value:EducationTypes.PhD},
    {label: 'Доктор наук', value: EducationTypes.Doctor},
  ]} 
  name={'education'} 
  />

  {values.educationInfo&&values.educationInfo.length>0&&values.educationInfo.map(el=> {
    return (
      <div 
      key={el.date} 
      className={styles.educationWrapper} 
      >
        <p className={styles.time}>{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</p>
        <p className={styles.companyName}>{el.institution}</p>
        <p className={styles.description}>{el.speciality}</p>
        <Button type={'button'} className={styles.trashButton} onClick={()=> removeItem(el)}><TrashBasketSvg/></Button>
      </div>)
    }) 
  }
  <AddButton onClick={onAddButtonClick} text={'Добавить место учебы'}/>
  </>)
}