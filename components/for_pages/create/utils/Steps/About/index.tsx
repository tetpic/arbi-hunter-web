import { useResize } from 'components/hooks/useResize'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import styles from './index.module.scss'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import RichTextField from '@/components/fields/RichTextField'
// import DateField from 'components/fields/DateField'
// import Spacer from 'components/ui/Spacer'

interface Props {
  title?: string
  fieldName?: string
}

export default function About(props: Props) {

  const cvContext = useCreateVcCvContext()
  const {isPhoneWidth} = useResize()
  const {values, setFieldValue } = useFormikContext<IVacancyCreate>()

  const onTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    cvContext.setCurrentCv({...cvContext.currentCv, bio: e.currentTarget.value})
    setFieldValue(props.fieldName||'bio', e.currentTarget.value)
  }
  /*
  const today = new Date()
  const newMaxDate = new Date(today).setFullYear(today.getFullYear()-16)
  */
  return (
  <div className={styles.root}>    
    <p className={styles.name}>{values.name}</p>
    <p className={styles.disclaimer}>
      Помните, что нельзя ограничивать кандидатов по&nbsp;полу, возрасту и&nbsp;другим неделовым качествам&nbsp;&mdash; это запрещено законом
    </p>
    {/* <TextAreaField 
    areaClassname={styles.textarea} name={props.fieldName||'bio'} 
    value={cvContext.currentCv?.bio||cvContext.currentVc?.description} 
    onChange={onTextAreaChange}  
    autoSize={true}
    placeholder={'Напишите о работе подробнее, хотя бы 2-3 строки'}
    /> */}
    <RichTextField name={props.fieldName||'bio'} 
    className={styles.textField}
    hideButtons={{helpers: true, headings: [2,3]}}
    returnValueType={'html'}
    placeholderClassName={styles.placeholder}
    editorClassName={styles.editor}
    label='Напишите о работе подробнее, хотя бы 2-3 строки'
    labelClassName={styles.label}
    />
    {/* <Spacer basis={16}/>
    <DateField maxDate={new Date(newMaxDate)} className={styles.birthday} visibleYearSelector styleType={'profile'} label='Дата рождения' name={'birthday'}/> */}
  </div>)
}