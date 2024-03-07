import styles from './index.module.scss'
import RadioListField from 'components/fields/RadioListField'
// import TrashBasketSvg from 'components/svg/TrashBasketSvg'
import AddButton from 'components/ui/AddButton'
import Button from 'components/ui/Button'
import { EducationInfo } from 'data/interfaces/Common'
import { useFormikContext } from 'formik'
import { EducationTypes, ModalType } from 'types/enums'
import { useAppContext } from 'context/state'
import { ICVCreate } from 'data/interfaces/ICV'
import { IDetailsModalProps } from '@/components/modals/DetailsModal'
import P from '@/components/ui/P'
import ArrowRightSvg from '@/components/svg/ArrowRightSvg'

interface Props {
  name: string
}

export default function Education(props: Props) {

  const appContext = useAppContext()
  const {values, setFieldValue, setFieldError, setFieldTouched} = useFormikContext<ICVCreate>()

  const removeItem = (e: EducationInfo) => {
    setFieldValue('educationInfo', values.educationInfo?.filter(el=> el !== e))
  }

  const onAddButtonClick = (initial?: EducationInfo, index?: number) => {
    appContext.showModal<IDetailsModalProps>(ModalType.DetailsModal, {
      values: {
        educationInfo: [{
          institution: '',
          speciality: '',
          fromDate: '',
          toDate: '',
          toPresent: true,
          faculity: '',
        }]
      },
      initialValues: initial? {educationInfo: [{...initial, toPresent: !initial.toDate}]}:null,

      type: 'educationInfo',
      onSubmit: (data) => {
        const educationInfo = values.educationInfo
        if(index !== undefined) {
          educationInfo[index] = data.educationInfo[0]
          if(educationInfo[index].toPresent) {
            delete educationInfo[index].toDate
          }
        }
        else {
          educationInfo?.push(data.educationInfo[0])
        }
        setFieldValue('educationInfo', educationInfo)
        appContext.hideModal()
      },
      onDelete: (data) => {
        const educationInfo = values.educationInfo
        const filtered =educationInfo.filter((_, i) => i !== index)
        setFieldValue('educationInfo', filtered)
      },
    })
  }

  return (<>
  <RadioListField 
  wrapperClassName={styles.radiosWrapper}
  options={[
    {label: 'Нет образования', value: EducationTypes.No},
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

  {values.educationInfo&&values.educationInfo.length>0&& 
    <div className={styles.educationItems}>
      {values.educationInfo.map((el, index)=> {
        return (
          <div 
          key={el.date} 
          className={styles.educationWrapper} 
          onClick={()=> onAddButtonClick(el, index)}
          >
            <P styleType={['large', 'w600']} >{el.institution}</P>
            <P styleType={['medium', 'w500']} >{el.speciality}</P>
            <P styleType={['small', 'greyLight']} >{el.fromDate} {el.toDate?'- '+el.toDate:' - по настоящее время'}</P>
            <Button type={'button'} className={styles.trashButton}><ArrowRightSvg/></Button>
          </div>)
        }) 
      }
    </div>
  }
  {values.education !== EducationTypes.No && values.education !== EducationTypes.Secondary &&
  <AddButton test={'addEducation'} onClick={()=> onAddButtonClick()} text={'Добавить место учебы'}/>
  }
  </>)
}