import styles from './index.module.scss'

import ModalLayout from 'components/layout/Modal/ModalLayout'
import ModalBody from 'components/layout/Modal/ModalBody'
import { useAppContext } from 'context/state'
import { Form, FormikProvider, useFormik } from 'formik'
import SectionSubtitle from '@/components/for_pages/create/utils/SectionSubtitle'
import DateField from '@/components/fields/DateField'
import InputField from '@/components/fields/InputField'
import TextAreaField from '@/components/fields/TextAreaField'
import SwitchField from '@/components/fields/SwitchField'
import { ICVCreate } from 'data/interfaces/ICV'
import Button from '@/components/ui/Button'
import Spacer from '@/components/ui/Spacer'


interface Props {
  onClose: ()=> void
}

export interface IDetailsModalProps {
  type: 'experienceInfo'|'educationInfo'|'coursesInfo'
  values?: Partial<ICVCreate>
  onSubmit?: (data: Partial<ICVCreate>) => void
}

export default function DetailsModal(props: Props) {
  const appContext = useAppContext()
  const args: IDetailsModalProps = appContext.modalArguments

  const formik = useFormik<Partial<ICVCreate>>({
    initialValues: {
      ...args.values
    },
    onSubmit: args.onSubmit
  })

  const experienceInfoForm = (<>
    <SectionSubtitle text={'Период работы'} title='Укажите место работы' className={styles.title}/>
    <div className={styles.period}>
      <DateField 
      name={'experienceInfo[0].fromDate'} 
      styleType={'default'} 
      label='Начало работы' 
      className={styles.dateField}
      />
      {!formik.values?.experienceInfo?.[0].toPresent &&
        <DateField 
        name={'experienceInfo[0].toDate'} 
        styleType={'default'} 
        label='Окончание работы' 
        className={styles.dateField}
        />
      }
    </div>
    <div className={styles.toPresent} >
      <p>По настоящее время</p> 
      <SwitchField name={'experienceInfo[0].toPresent'}/> 
    </div>

    <SectionSubtitle text={'Организация'} className={styles.title}/>
    <div className={styles.inputsWrapper}>
      <InputField 
      name={'experienceInfo[0].company'} 
      styleType={'default'} 
      color={'default'} 
      label='Название компании' 
      labelType='top'
      />
      <InputField 
      name={'experienceInfo[0].position'} 
      styleType={'default'} 
      color={'default'} 
      label='Должность' 
      labelType='top'
      />
    </div>
    <SectionSubtitle text={'Обязанности и достижения'} className={styles.title} />
    <TextAreaField autoSize name={'experienceInfo[0].description'} value={formik.values.experienceInfo?.[0].description} onChange={(val)=>{formik.setFieldValue('experienceInfo[0].description', val.currentTarget.value)}}/>
  </>)

  const educationInfoForm = (<>
    <SectionSubtitle text={'Годы обучения'} title='Укажите дату начала и конца обучения' className={styles.title}/>
    <div className={styles.period}>
      <DateField 
      name={'educationInfo[0].fromDate'} 
      styleType={'default'} 
      label='Начало обучения' 
      className={styles.dateField}
      />
      {!formik.values.educationInfo?.[0].toPresent &&
        <DateField 
        name={'educationInfo[0].toDate'} 
        styleType={'default'} 
        label='Окончание обучения' 
        className={styles.dateField}
        />
      }
    </div>
    <div className={styles.toPresent} >
      <p>По настоящее время</p> 
      <SwitchField name={'educationInfo[0].toPresent'}/> 
    </div>

    <div className={styles.inputsWrapper}>
      <InputField 
      name={'educationInfo[0].institution'} 
      styleType={'default'} 
      color={'default'} 
      label='Название учебного заведения' 
      labelType='top'
      />
      <InputField 
      name={'educationInfo[0].faculity'} 
      styleType={'default'} 
      color={'default'} 
      label='Факультет' 
      labelType='top'
      />
      <InputField 
      name={'educationInfo[0].speciality'} 
      styleType={'default'} 
      color={'default'} 
      label='Специальность' 
      labelType='top'
      />
    </div>
  </>)

  const coursesInfoForm = (<>
    <SectionSubtitle text={'Повышение квалификации и курсы'} title='Укажите дату начала и конца обучения' className={styles.title}/>
    <Spacer basis={24}/>
    <div className={styles.period}>
      <DateField 
      visibleYearSelector
      visibleMonthSelector={false}
      dateFormat='yyyy'
      name={'coursesInfo[0].date'} 
      styleType={'default'} 
      label='Год окончания:' 
      className={styles.dateField}

      />
    </div>
    <div className={styles.inputsWrapper}>
      <InputField 
      name={'coursesInfo[0].name'} 
      styleType={'default'} 
      color={'default'} 
      label='Название учреждения:' 
      labelType='top'
      />
      <InputField 
      name={'coursesInfo[0].location'} 
      styleType={'default'} 
      color={'default'} 
      label='Название курсов:' 
      labelType='top'
      />
    </div>
  </>)

  return (
    <ModalLayout mobileFullScreen  className={styles.modalLayout}>
      <ModalBody>
        <FormikProvider value={formik}>
          <Form>
            <div className={styles.detailsRoot}>
              {args.type === 'experienceInfo' && formik.values.experienceInfo && experienceInfoForm}
              {args.type === 'educationInfo' && educationInfoForm}
              {args.type === 'coursesInfo' && coursesInfoForm}
            </div>
            <div className={styles.buttonWrapper}>
              <Button className={styles.grayButton} onClick={props.onClose}>Отмена</Button>
              <Button className={styles.sendButton} onClick={formik.submitForm}>Добавить</Button>
            </div>
          </Form>
        </FormikProvider>
      </ModalBody>
    </ModalLayout>
  )
}