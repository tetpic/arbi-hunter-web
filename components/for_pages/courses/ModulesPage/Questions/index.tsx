import CheckboxListField from 'components/fields/CheckboxListField'
import RadioListField from 'components/fields/RadioListField'
import Button from 'components/ui/Button'
import { useCoursesContext } from 'context/courses_state'
import { ICourseStep, ICourseStepAnswer } from 'data/interfaces/ICourse'
import { Form, FormikProvider, useFormik } from 'formik'
import { useState } from 'react'
import { CourseStepAnswerType } from 'types/enums'
import styles from './index.module.scss'

interface Props {
  activeStep: ICourseStep
}

export default function Questions({activeStep}: Props) {
  
  const courseContext = useCoursesContext()

  const [activeRadio, setActiveRadio] = useState<number>()

  const answerHandler = (data: ICourseStepAnswer) => {
    const dataToSend = {
      answers: Array.isArray(data.answers)?data.answers.map(e=> Number(e)): [Number(data.answers)],
      courseBlockStepId: activeStep.id
    }
    courseContext.setStepAnswer(dataToSend, activeStep.courseBlockId)
    .then(_=>{
    })
  }

  const formik = useFormik<ICourseStepAnswer>({
    initialValues: {
      answers: [],
    },
    onSubmit: answerHandler
  })

  return ( <div className={styles.question}>
    <p className={styles.text} dangerouslySetInnerHTML={{__html: activeStep?.body}}></p>
    <FormikProvider value={formik}>
      <Form className={styles.form}>
        {activeStep.answerType === CourseStepAnswerType.Single &&
          <RadioListField  
          itemClassName={styles.answer}
          itemLabelClassName={styles.label}
          activeItemClassName={styles.answer_active}
          itemCircleClassname={styles.hide}
          wrapperClassName={styles.radioWrapper}
          name={'answers'} 
          options={activeStep.variants.map(v=> {
            const isAnswered = activeStep.answers[0]?.answers?.findIndex(e=> e === Number(v.id)) > -1
            return {label: v.answer, value: v.id, className: isAnswered&&(v.correct&&styles.answer_ok||!v.correct&&styles.answer_err)}
          })}/>
          ||
          <CheckboxListField 
          itemClassName={styles.answer}
          activeClassName={styles.answer_active}
          circleClassName={styles.hide}
          itemLabelClassName={styles.label}
          name={'answers'} 
          options={activeStep.variants.map(v=> {
            const isAnswered = activeStep.answers[0]?.answers?.findIndex(e=> e === Number(v.id))>-1
            return {label: v.answer, value: v.id, className: isAnswered&&(v.correct&&styles.answer_ok||!v.correct&&styles.answer_err)}
          })}/>
        }
      </Form>
    </FormikProvider>
    <Button className={styles.answerButton} type={'button'} onClick={formik.submitForm} >Ответить</Button>
  </div>)
}