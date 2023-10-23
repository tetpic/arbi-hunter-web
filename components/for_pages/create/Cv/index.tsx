import UserRegImage from 'components/ui/UserRegImage'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import { ICV, ICVCreate } from 'data/interfaces/ICV'
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
import ProgressBar from '../../../ui/ProgressBar'
import { useAppContext } from 'context/state'
import classNames from 'classnames'

interface Props {
  id?: number
  cv?: ICV
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
  const [loading, setLoading] = useState<boolean>(false)

  const userContext = useUserContext()
  const appContext = useAppContext()
  const creationContext = useCreateVcCvContext()
  const router = useRouter()
  const {progress, setProgress} = creationContext

  useEffect(()=>{
    if(props.id && !creationContext.currentCv) {
      creationContext.getCurrentCv(props.id)
    }  
  }, [])

  const submit = (data: ICVCreate) => {
    
    const {activeSources, languageKnowledges, skills, categoryIds} = creationContext?.helpObjects
    if(!categoryIds||categoryIds?.length === 0) {
      setProgress(1)
      appContext.showSnackbar('Укажите специализацию', SnackbarType.error)
      return 
    }
    const sendData: ICVCreate = {
      ...data, 
      commission: Number(data.commission),
      skillsIds: [...skills.keys()], 
      salary: Number(data.salary),
      languageKnowledges: [...languageKnowledges.values()].map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: [...activeSources.keys()],
      categoriesIds: categoryIds.map(el=>el.id)
    }
   
    if(props.id) {
      CvRepository.updateCV(props.id, sendData)
      .then(res=>{
        appContext.showSnackbar('Резюме успешно обновлено', SnackbarType.success)
        creationContext.reset()
        router.back()      
      })
      .catch(err=>{        
        appContext.showSnackbar(err, SnackbarType.error)
      })

    }
    else {
      CvRepository.createCV(sendData)
      .then(res => {
        appContext.showSnackbar('Резюме успешно сохранено', SnackbarType.success)
          router.push('/')      
      })
      .catch(err=>{
        appContext.showSnackbar(err, SnackbarType.error)
      })
    }
  }

  const CVItemsCount = 7

  const initialValues:ICVCreate  = {
    firstName: userContext.user?.profiles[0]?.firstName,
    lastName: userContext.user?.profiles[0]?.lastName,
    patronymic: userContext.user?.profiles[0]?.patronymic||'unset',
    birthday: userContext.user?.profiles[0]?.birthday,
    compensation: props.cv?.compensation||CompensationType.Salary,
    phone: userContext.user?.profiles[0]?.phone,
    email: userContext.user?.profiles[0]?.email,
    telegramNickname: userContext.user?.profiles[0]?.telegramNickname, 
    cityId: userContext.user?.profiles[0]?.cityId,
    countryId: userContext.user?.profiles[0]?.countryId,
    currency: props.cv?.currency||Currency.RUB,
    experienceInfo: props.cv?.experienceInfo||[],
    educationInfo: props.cv?.educationInfo||[],
    coursesInfo: props.cv?.coursesInfo||[],
    bio: props.cv?.bio||'',
    skillsIds: props.cv?.skillsIds||[],
    commission: props.cv?.commission||null,
    vacancyLookType: props.cv?.vacancyLookType||userContext.user?.profiles[0].vacancyLookType||VacancyLookType.NotLooking,
    workExperiencePresense: props.cv?.workExperiencePresense||WorkExperiencePresense.Absent,
    education: props.cv?.education||EducationTypes.Secondary,
    relocation: props.cv?.relocation||null,
    position: props.cv?.position||'',
    nativeLanguage: props.cv?.nativeLanguage||userContext.user?.language||Languages.ru,
    categoriesIds: props.cv?.categoriesIds||null,
    sourcesIds: props.cv?.sourcesIds||null,
    salary: props.cv?.salary||null,
    schedule: props.cv?.schedule||ScheduleType.FullDay, 
    employment: props.cv?.employment||EmploymentType.FullTime, 
    languageKnowledges: props.cv?.languageKnowledges||null, 
    published: props.cv?.published||false,
  }

  const formik = useFormik({
    initialValues: initialValues,
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

  const titles = ['Специализация', 'Доход', 'Опыт', 'Образование', 'О себе', 'Навыки', 'Занятость']

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

  useEffect(()=>{
      formik.setValues(initialValues)
  }, [userContext.currentProfile, props.cv])
  

  return <div className={styles.root}>
    <UserRegImage type={ProfileType.Employee} className={styles.regImage}/>
    <div className={styles.content}>    
      <p className={styles.title}>
        {isPhoneWidth && 
          <Button className={styles.buttonBlackSmall} type='button' onClick={()=>setProgress(progress-1)}><ArrowDownSvg className={styles.arrow}/></Button>
        }
        {title}
      </p>
      <ProgressBar progress={progress} pointsCount={CVItemsCount} titles={titles} onClick={setProgress}/>
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
              <Button spinner={loading} disabled={loading} className={classNames(styles.buttonYellow, loading&&styles.disabled)} type='button' onClick={()=> formik.submitForm()}>Сохранить резюме</Button>
            }
          </div>
        </Form>
      </FormikProvider>
      
    </div>
  </div>
}