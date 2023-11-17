import { IVacancySearchParams } from 'data/interfaces/IVacancy'
import styles from './index.module.scss'
import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import CheckboxListField from 'components/fields/CheckboxListField'
import { EmploymentType, ScheduleType } from 'types/enums'
import { useEffect } from 'react'

interface Props {
  onFilterChange: (data: IVacancySearchParams) => void
}

export default function Filters(props: Props) {

  const formik = useFormik<IVacancySearchParams>({
    initialValues: {
      employment: [],
      schedule: [],


    },
    onSubmit: null
  })

  useEffect(()=>{
    props.onFilterChange(formik.values)
  }, [formik.values])

  return (<div className={styles.root}> 
    <FormikProvider value={formik}>
      <Form>
        <p className={styles.fieldTitle}>Занятость</p>
        <CheckboxListField 
        name={'employment'} 
        options={[
          {value: EmploymentType.FullTime, label: 'Полная'},
          {value: EmploymentType.PartTime, label: 'Частичная'},
          {value: EmploymentType.Project, label: 'Проектная'}
        ]}/>

        <p className={styles.fieldTitle}>График работы</p>
        <CheckboxListField 
        name={'schedule'}
        options={[
          {value: ScheduleType.Flexible, label: 'Гибкий график'},
          {value: ScheduleType.FullDay, label: 'Полный день'},
          {value: ScheduleType.Remote, label: 'Удаленная работа'}
        ]} 
        />

      </Form>
    </FormikProvider>
    <Button>Сбросить всё</Button>

  </div>)
}