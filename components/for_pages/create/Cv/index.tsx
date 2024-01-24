import styles from './index.module.scss'

import { useEffect, useMemo, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import { ICV, ICVCreate } from 'data/interfaces/ICV'
import Button from 'components/ui/Button'
import { Answer, Currency, EducationTypes, EmploymentType, Languages, ScheduleType, SnackbarType, VacancyLookType, WorkExperience, WorkExperiencePresense } from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import CvRepository from 'data/repositories/CvRepository'
import { useRouter } from 'next/router'
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
import Rive from '@rive-app/react-canvas'
import Title from 'components/ui/TitleForSection'


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
  const userContext = useUserContext()
  const appContext = useAppContext()
  const {isPhoneWidth, isTabletWidth} = appContext.size

  const creationContext = useCreateVcCvContext()
  
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const {progress, setProgress} = creationContext
  const CVItemsCount = 7

  const submit = (data: ICVCreate) => {
    setLoading(true)
    const {activeSources, languageKnowledges, skills, categoryIds, activeGeos} = creationContext?.helpObjects

    if(!categoryIds||categoryIds?.length === 0) {
      setProgress(1)
      appContext.showSnackbar('Укажите специализацию', SnackbarType.error)
      return 
    }
    const sendData: ICVCreate = {
      ...data, 
      commission: Number(data.commission),
      skillsIds: [...skills.keys()], 
      salary: Number(data.salary.toString().replaceAll(' ', '')),
      languageKnowledges: [...languageKnowledges.values()].map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: [...activeSources.keys()],
      categoriesIds: categoryIds.map(el=>el.id),
      geosIds: [...activeGeos.keys()],
      experience: WorkExperience.From1to3
    }
   
    if(props.id) {
      CvRepository.updateCV(props.id, sendData)
      .then(_=>{
        appContext.showSnackbar('Резюме успешно обновлено', SnackbarType.success)
        creationContext.reset()
        router.replace('/profile?page=cvs')      
      })
      .catch(err=>{        
        appContext.showSnackbar(err, SnackbarType.error)
      })
    }
    else {
      CvRepository.createCV(sendData)
      .then(_ => {
        appContext.showSnackbar('Резюме успешно сохранено', SnackbarType.success)
        creationContext.reset()
        router.replace('/profile?page=cvs')  
      })
      .catch(err=>{
        appContext.showSnackbar(err, SnackbarType.error)
        setLoading(false)
      })
    }
  }

  const initialValues:ICVCreate  = {
    firstName: userContext.currentProfile?.firstName,
    lastName: userContext.currentProfile?.lastName,
    patronymic: userContext.currentProfile?.patronymic||'unset',
    birthday: userContext.currentProfile?.birthday,
    compensation: props.cv?.compensation||undefined,
    phone: userContext.currentProfile?.phone,
    email: userContext.currentProfile?.email,
    telegramNickname: userContext.currentProfile?.telegramNickname, 
    cityId: userContext.currentProfile?.cityId,
    countryId: userContext.currentProfile?.countryId,
    currency: props.cv?.currency||Currency.RUB,
    experienceInfo: props.cv?.experienceInfo||[],
    educationInfo: props.cv?.educationInfo||[],
    coursesInfo: props.cv?.coursesInfo||[],
    bio: props.cv?.bio||'',
    skillsIds: props.cv?.skillsIds||[],
    commission: props.cv?.commission||null,
    vacancyLookType: props.cv?.vacancyLookType||userContext.currentProfile?.vacancyLookType||VacancyLookType.NotLooking,
    workExperiencePresense: props.cv?.workExperiencePresense||WorkExperiencePresense.Absent,
    education: props.cv?.education||EducationTypes.Secondary,
    relocation: props.cv?.relocation||Answer.No,
    position: props.cv?.position||'',
    nativeLanguage: props.cv?.nativeLanguage||userContext.user?.language||Languages.ru,
    categoriesIds: props.cv?.categoriesIds||null,
    sourcesIds: props.cv?.sourcesIds||null,
    geosIds: props.cv?.geosIds||null,
    salary: props.cv?.salary||null,
    schedule: props.cv?.schedule||ScheduleType.FullDay, 
    employment: props.cv?.employment||EmploymentType.FullTime, 
    languageKnowledges: props.cv?.languageKnowledges||null, 
    published: props.cv?.published||true,
    portfolio: props.cv?.portfolio||'',
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

  const titleTips = ['Специализация', 'Доход', 'Опыт', 'Образование', 'О себе', 'Навыки', 'Занятость']

  const nextPageValidator = (pageNumber?: number) => {
    const setErr = (val: string, err?: string) => {
      formik.setFieldTouched(val, true).then(_=>{
        formik.setFieldError(val, err||' ')
      })
    }

    const salaryNumber: number = Number(formik.values?.salary?.toString().replaceAll(' ', ''))
    switch(progress) {

      case 1:
        creationContext.helpObjects.categoryIds.length > 0 ? 
        setProgress(pageNumber||progress+1)
        : appContext.showSnackbar('Выберите специализацию', SnackbarType.error)
      break
      case 2: 
        // if(formik.values.compensation === CompensationType.Salary && (!formik.values.salary||salaryNumber < 1)) {
        //   setErr('salary')
        //   return
        // }
        // else if(formik.values.compensation === CompensationType.Commission && (!formik.values.commission||formik.values.commission < 1)) {
        //   setErr('commission')
        //   return
        // }
        // else if(formik.values.compensation === CompensationType.Gybrid) {
        //   if(!formik.values.commission||formik.values.commission < 1) {
        //     setErr('commission')
        //   }
        //   if(!formik.values.salary||salaryNumber < 1) {
        //     setErr('salary')
        //   }
        //   if(formik.values.commission > 0 && salaryNumber > 0) {
        //     setProgress(pageNumber||progress+1)
        //   }
        // }
        // else {
        //   setProgress(pageNumber||progress+1)
        // }
      break
      case 5: 
        if(formik.values.bio.trim().length < 1) {
          setErr('bio', 'Напишите подробнее о себе')
        } else {
          setProgress(pageNumber||progress+1)
        }
      break

      default :
        setProgress(pageNumber||progress+1)
    }
  } 

  const changeComponent = (p: number) => {
    const [element, type] = getComponent(p)
    setTitle(getTitle(type))   
    setPage(element)
  }

  const getImage = ():{src: string, animations: string[]} => {
    switch (progress) {
      case 1:
        return {src: '/rive/cvCreate/1.riv', animations: ['Man2-3', 'Man2-2', 'Man2-1', 'Man1-4', 'Man1-3', 'Man1-2', 'Man1-1']}
      case 2: 
        return {src: '/rive/cvCreate/2.riv', animations: ['Hands', 'Flow']}
      case 3: 
        return {src: '/rive/cvCreate/3.riv', animations: ['BubbleFloat', 'Bubbles', 'Eyes', 'Hand', 'Phone', 'Head', 'Body']}
      case 4: 
        return {src: '/rive/cvCreate/4.riv', animations: ['Text']}
      case 5: 
        return {src: '/rive/cvCreate/5.riv', animations: ['Man1', 'Man2', 'Man1Head']}
      case 6: 
        return {src: '/rive/cvCreate/6.riv', animations: ['Bubbles', 'RHandMove', 'RHand', 'Eyes', 'Head', 'LHand', 'Finger']}
      case 7: 
        return {src: '/rive/cvCreate/7.riv', animations: ['DollarsA', 'Stars', 'Body', 'Head', 'Hand']}
      default:
        return {src: '/rive/cvCreate/1.riv', animations: ['Man2-3', 'Man2-2', 'Man2-1', 'Man1-4', 'Man1-3', 'Man1-2', 'Man1-1']}
    }
  }

  const memoedRive = useMemo(()=>{
    const image = getImage()
    return <Rive src={image.src} animations={image.animations}  key={image.src} className={styles.rive}/>
  }, [progress])

  useEffect(()=>{
    if(props.id) {
      creationContext.getCurrentCv(props.id, props.cv)
    }  
    return ()=> {
      formik.resetForm()
      setProgress(1)
      creationContext.setHelpObjects({})
      creationContext.reset()    
    }
  }, [])

  useEffect(()=>{
    if(progress < 1) {
      setProgress(1)
      router.back()
      return
    }
    changeComponent(progress)
  }, [progress])

  useEffect(()=>{
    formik.setValues(initialValues)
  }, [userContext.currentProfile, props.cv])
  

  return <div className={styles.root}>
    {!isTabletWidth&& memoedRive}
    <div className={styles.content}>    
      {isPhoneWidth && 
        <Title title={title} className={styles.title} onBackClick={()=>setProgress(progress-1)}/>
      }
      <ProgressBar progress={progress} pointsCount={CVItemsCount} titles={titleTips} onClick={nextPageValidator}/>
      <FormikProvider value={formik}>
        <Form  className={styles.form}>
          {isTabletWidth && memoedRive}
          {page} 
          <div className={styles.buttonWrapper}>
            {progress > 1 && !isPhoneWidth &&
              <Button className={styles.buttonBlack} type='button' onClick={()=>setProgress(progress-1)}>Назад</Button>
            }
            {progress < CVItemsCount &&
              <Button className={styles.buttonYellow} type='button' onClick={()=>nextPageValidator()}>Продолжить</Button>
            }
            { progress === CVItemsCount &&
              <Button isProcess={loading} spinner={loading} disabled={loading} className={classNames(styles.buttonYellow, loading&&styles.disabled)} type='button' onClick={()=> formik.submitForm()}>Сохранить резюме</Button>
            }
          </div>
        </Form>
      </FormikProvider>
    </div>
  </div>
}