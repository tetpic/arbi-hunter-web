import UserRegImage from 'components/ui/UserRegImage'
import { ProfileType } from 'data/interfaces/IRegistration'
import { KeyboardEventHandler, use, useEffect, useState } from 'react'
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
import Education from './Education'
import About from './About'
import Skills from './Skills'
import Busyness from './Busyness'
import { useUserContext } from 'context/user_state'
import { useCvContext } from 'context/cv_state'

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
  
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()

  const userContext = useUserContext()
  const cvContext = useCvContext()
  const {progress, setProgress} = cvContext

  const submit = (data: DeepPartial<ICVCreate>) => {

    debugger
  }

  const CVItemsCount = 7

  const formik = useFormik<DeepPartial<ICVCreate>>({
    initialValues: {
      firstName: userContext.user.profiles[0].firstName,
      lastName: userContext.user.profiles[0].lastName,
      patronymic: userContext.user.profiles[0].patronymic,
      birthday: userContext.user.profiles[0].birthday,
      compensation: CompensationType.Salary,
      phone: userContext.user.profiles[0].phone,
      email: userContext.user.profiles[0].email,
      cityId: userContext.user.profiles[0].cityId,
      countryId: userContext.user.profiles[0].countryId,
      currency: Currency.RUB,
      experienceInfo: cvContext.currentCv?.experienceInfo||[],
      educationInfo: cvContext.currentCv?.educationInfo||[],
      coursesInfo: cvContext.currentCv?.coursesInfo||[],
      bio: '',
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
      case 4:
        return [<Education name={'educationInfo'}/>, CvNavigation.Education]
      case 5: 
        return [<About/>, CvNavigation.About]
      case 6: 
        return [<Skills/>, CvNavigation.Skills]
      case 7: 
        return [<Busyness/>, CvNavigation.Busyness]
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
      case CvNavigation.Education:
        return 'Образование'
      case CvNavigation.About:
        return 'Описание'
      case CvNavigation.Skills:
        return 'Навыки и инструменты'
      case CvNavigation.Busyness:
        return 'Занятость'
    }
  }

  const progressHandler = (p: number) => {
    const [element, type] = getComponent(p)
    setTitle(getTitle(type))   
    setPage(element)
  }

  const keyDownHandler:KeyboardEventHandler<HTMLDivElement> = (event) => {    
    if((event.code === 'Enter'||event.code === 'ArrowRight') && progress < CVItemsCount) {
      setProgress(progress+1)      
    }
    if (event.code === "ArrowLeft" && progress > 1) {
      setProgress(progress-1)
    }
    
  }

  useEffect(()=>{
    progressHandler(progress)
  }, [progress])
  

  return <div className={styles.root} onKeyDown={keyDownHandler} tabIndex={0}>
    <UserRegImage type={ProfileType.Employee} className={styles.regImage}/>
    <div className={styles.content}>    
      <p className={styles.title}>{title}</p>
      <ProgressBar progress={progress} pointsCount={CVItemsCount} onClick={(p: number) => setProgress(p)}/>
      <FormikProvider value={formik}>
        <Form >
          {page} 

          <div className={styles.buttonWrapper}>
            {progress > 1 && 
              <Button className={styles.buttonBlack} type='button' onClick={()=>setProgress(progress-1)}>Назад</Button>
            }
            {progress < CVItemsCount &&
              <Button className={styles.buttonYellow} type='button' onClick={()=>setProgress(progress+1)}>Продолжить</Button>
            }
            { progress === CVItemsCount &&
              <Button className={styles.buttonYellow} type='submit' onClick={()=> formik.submitForm()}>Сохранить резюме</Button>
            }
          </div>
        </Form>
      </FormikProvider>
      
    </div>
  </div>
}