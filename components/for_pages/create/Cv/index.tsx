import UserRegImage from 'components/ui/UserRegImage'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import { ICVCreate } from 'data/interfaces/ICV'
import Button from 'components/ui/Button'
import { CompensationType, Currency, EducationTypes, EmploymentType, Languages, ScheduleType, SnackbarType, VacancyLookType, WorkExperiencePresense } from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import CvRepository from 'data/repositories/CvRepository'
import { useResize } from 'components/hooks/useResize'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import Specialization from '../utils/Steps/Specialization'
import Compensation from '../utils/Steps/Compensation'
import Experience from '../utils/Steps/Experience'
import Education from '../utils/Steps/Education'
import About from '../utils/Steps/About'
import Skills from '../utils/Steps/Skills'
import Busyness from '../utils/Steps/Busyness'
import ProgressBar from '../utils/ProgressBar'
import { useAppContext } from 'context/state'
import classNames from 'classnames'

interface Props {
  id?: number
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
  const {isPhoneWidth} = useResize()
  
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()
  const [submitButton, setSubmitButton] = useState<boolean>(true)

  const userContext = useUserContext()
  const appContext = useAppContext()
  const cvContext = useCreateVcCvContext()
  const router = useRouter()
  const {progress, setProgress} = cvContext

  useEffect(()=>{
    if(props.id && !cvContext.currentCv) {
      router.replace('/')
    }  
  }, [])

  const submit = (data: ICVCreate) => {
    
    
    const {activeSources, languageKnowledges, skills, categoryIds} = cvContext?.helpObjects
    if(!categoryIds||categoryIds?.length === 0) {
      setProgress(1)
      appContext.showSnackbar('Укажите специализацию', SnackbarType.error)
      return 
    }
    const sendData: ICVCreate = {
      ...data, 
      skillsIds: skills.map(el=>el.id), 
      salary: Number(data.salary),
      languageKnowledges: languageKnowledges.map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: Array.from(activeSources).map(el=> el.id),
      categoriesIds: categoryIds.map(el=>el.id)
    }
   
    if(props.id) {
      CvRepository.updateCV(props.id, sendData)
      .then(res=>{
        appContext.showSnackbar('Резюме успешно обновлено', SnackbarType.success)
        cvContext.reset()
        setTimeout(()=> {
          router.back()      
        }, 2000)
      })
      .catch(err=>{        
        appContext.showSnackbar(err, SnackbarType.error)
      })

    }
    else {
      CvRepository.createCV(sendData)
      .then(res => {
        appContext.showSnackbar('Резюме успешно сохранено', SnackbarType.success)
        setTimeout(()=> {
          router.push('/')      
        }, 2000)
      })
      .catch(err=>{
        appContext.showSnackbar(err, SnackbarType.error)
      })
    }
  }

  const CVItemsCount = 7

  const formik = useFormik<ICVCreate>({
    initialValues: {
      firstName: userContext.user?.profiles[0]?.firstName,
      lastName: userContext.user?.profiles[0]?.lastName,
      patronymic: userContext.user?.profiles[0]?.patronymic||'unset',
      birthday: userContext.user?.profiles[0]?.birthday,
      compensation: cvContext.currentCv?.compensation||CompensationType.Salary,
      phone: userContext.user?.profiles[0]?.phone,
      email: userContext.user?.profiles[0]?.email,
      telegramNickname: userContext.user?.profiles[0]?.telegramNickname, 
      cityId: userContext.user?.profiles[0]?.cityId,
      countryId: userContext.user?.profiles[0]?.countryId,
      currency: cvContext.currentCv?.currency||Currency.RUB,
      experienceInfo: cvContext.currentCv?.experienceInfo||[],
      educationInfo: cvContext.currentCv?.educationInfo||[],
      coursesInfo: cvContext.currentCv?.coursesInfo||[],
      bio: '',
      skillsIds: cvContext.currentCv?.skillsIds||[],
      vacancyLookType: cvContext.currentCv?.vacancyLookType||userContext.user?.profiles[0].vacancyLookType||VacancyLookType.NotLooking,
      workExperiencePresense: cvContext.currentCv?.workExperiencePresense||WorkExperiencePresense.Absent,
      education: cvContext.currentCv?.education||EducationTypes.Secondary,
      relocation: cvContext.currentCv?.relocation||null,
      position: cvContext.currentCv?.position||'',
      nativeLanguage: cvContext.currentCv?.nativeLanguage||userContext.user?.language||Languages.ru,
      categoriesIds: cvContext.currentCv?.categoriesIds||null,
      sourcesIds: cvContext.currentCv?.sourcesIds||null,
      salary: cvContext.currentCv?.salary||null,
      schedule: cvContext.currentCv?.schedule||ScheduleType.FullDay, 
      employment: cvContext.currentCv?.employment||EmploymentType.FullTime, 
      languageKnowledges: cvContext.currentCv?.languageKnowledges||null, 
      published: cvContext.currentCv?.published||false,
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

  useEffect(()=>{
    if(progress < 1) {
      setProgress(1)
      router.back()
      return
    }
    progressHandler(progress)

  }, [progress])
  

  return <div className={styles.root}>
    <UserRegImage type={ProfileType.Employee} className={styles.regImage}/>
    <div className={styles.content}>    
      <p className={styles.title}>
        {isPhoneWidth && 
          <Button className={styles.buttonBlackSmall} type='button' onClick={()=>setProgress(progress-1)}><ArrowDownSvg className={styles.arrow}/></Button>
        }
        {title}
      </p>
      <ProgressBar progress={progress} pointsCount={CVItemsCount} onClick={(p: number) => setProgress(p)}/>
      <FormikProvider value={formik}>
        <Form  className={styles.form}>
          {page} 

          <div className={styles.buttonWrapper}>
            {progress > 1 && !isPhoneWidth &&
              <Button className={styles.buttonBlack} type='button' onClick={()=>setProgress(progress-1)}>Назад</Button>
            }
            {progress < CVItemsCount &&
              <Button className={styles.buttonYellow} type='button' onClick={()=>setProgress(progress+1)}>Продолжить</Button>
            }
            { progress === CVItemsCount &&
              <Button className={classNames(styles.buttonYellow, !submitButton&&styles.disabled)} type='button' onClick={()=> formik.submitForm()}>Сохранить резюме</Button>
            }
          </div>
        </Form>
      </FormikProvider>
      
    </div>
  </div>
}