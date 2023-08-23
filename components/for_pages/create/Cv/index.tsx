import UserRegImage from 'components/ui/UserRegImage'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import ProgressBar from './ProgressBar'
import { Form, FormikProvider, useFormik } from 'formik'
import { DeepPartial } from 'types/types'
import { ICVCreate } from 'data/interfaces/ICV'
import Button from 'components/ui/Button'
import Specialization from './Specialization'
import styles from './index.module.scss'
import { CompensationType, Currency } from 'types/enums'
import Compensation from './Compensation'
import Experience from './Experience'

interface Props {
}

enum CvNavigation {
  Specialization = 'specialization',
  Salary = 'salary',
  Experience = 'experience',
  Education = 'education',
  About = 'about',
  Skills = 'skills',
  Busyness = 'busyness',
  Tariff = 'tariff'
}

export default function Cv(props: Props) {

  const [progress, setProgress] = useState<number>(1)
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()

  const submit = () => {

  }

  const formik = useFormik<DeepPartial<ICVCreate>>({
    initialValues: {
      position: '',
      compensation: CompensationType.Salary,
      currency: Currency.RUB,
      experienceInfo: [],
      
    },
    onSubmit: submit
  })


  const getComponent = (progress: number): [JSX.Element, CvNavigation] => {
    switch (progress) {
      case 1: 
        return [<Specialization/>, CvNavigation.Specialization]
      case 2: 
        return [<Compensation/>, CvNavigation.Salary]
      case 3: 
        return [<Experience name={'experienceInfo'}/>, CvNavigation.Experience]
    }
  }

  const getTitle = (t: CvNavigation): string => {
    switch(t) {
      case CvNavigation.Specialization: 
        return 'Специализация'
      case CvNavigation.Salary:
        return 'Уровень дохода'
      case CvNavigation.Experience:
        return 'Опыт работы'
    }
  }

  const progressHandler = (p: number) => {
    const [element, type] = getComponent(p)
    setTitle(getTitle(type))   
    setPage(element)
  }

  useEffect(()=>{
    progressHandler(progress)
  }, [progress])




  
  

  return <div className={styles.root}>
    <UserRegImage type={ProfileType.Employee}/>
    <div className={styles.content}>    
      <p className={styles.title}>{title}</p>
      <ProgressBar progress={progress} pointsCount={9}/>
      <FormikProvider value={formik}>
        <Form>
          {page} 
        </Form>
      </FormikProvider>
      <div className={styles.buttonWrapper}>
        {progress > 1 && 
          <Button className={styles.buttonBlack} onClick={()=>setProgress(state=> state-1)}>Назад</Button>
        }
        <Button className={styles.buttonYellow} onClick={()=>setProgress(state=> state+1)}>Продолжить</Button>
    </div>
    </div>
  </div>
}