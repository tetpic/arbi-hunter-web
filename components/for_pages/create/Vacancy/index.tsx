import UserRegImage from 'components/ui/UserRegImage'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useEffect, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import { CompensationType, Currency, EmploymentType, ScheduleType,  SnackbarType,  WorkExperience} from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useResize } from 'components/hooks/useResize'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import { useRouter } from 'next/router'
import About from '../utils/Steps/About'
import Skills from '../utils/Steps/Skills'
import ProgressBar from '../../../ui/ProgressBar'
import WorkPlace from '../utils/Steps/WorkPlace'
import {IVacancy, IVacancyCreate} from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import Compensation from '../utils/Steps/Compensation'
import VacancyName from '../utils/Steps/VacancyName'
import VacancyExperience from '../utils/Steps/VacancyExperience'
import { useAppContext } from 'context/state'
import styles from './index.module.scss'

interface Props {
  id?: number
  vacancy?: IVacancy
}

enum VacancyNavigation {
  Name = 'name',
  Specialization = 'specialization',
  WorkPlace = 'workPlace',
  Salary = 'salary',
  Experience = 'experience',
  Education = 'education',
  About = 'about',
  Skills = 'skills',
  Busyness = 'busyness',
  Tariff = 'tariff'
}

export default function Vacancy(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const creationContext = useCreateVcCvContext()

  const {isPhoneWidth} = useResize()
  const router = useRouter()
  const {progress, setProgress} = creationContext
  
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()
  const [loading, setLoading] = useState<boolean>(false)

  const CVItemsCount = 6
  const titles = ['Название', 'Специализация', 'Место работы', 'Опыт и график', 'Уровень дохода', 'Описание', 'Навыки и инструменты']


  const initialValues: IVacancyCreate = {
    name: props.vacancy?.name||'',
    description: props.vacancy?.description||'',
    experience: props.vacancy?.experience||WorkExperience.From1to3, 
    contactName: props.vacancy?.contactName||userContext.currentProfile?.firstName, 
    company: props.vacancy?.company||userContext.currentProfile?.company, 
    isRemote: props.vacancy?.isRemote||false,
    compensation: props.vacancy?.compensation||CompensationType.Salary,
    phone: props.vacancy?.phone||userContext.currentProfile?.phone,
    email: props.vacancy?.email||userContext.currentProfile?.email,
    telegramNickname: props.vacancy?.telegramNickname||userContext.currentProfile?.telegramNickname, 
    cityId: null,
    countryId: null,
    commission: props.vacancy?.commission||null,
    currency: props.vacancy?.currency|| Currency.RUB,
    skillsIds: props.vacancy?.skillsIds|| [],
    categoriesIds: props.vacancy?.categoriesIds||  null,
    sourcesIds: props.vacancy?.sourcesIds|| null,
    salary: props.vacancy?.salary|| null,
    schedule: props.vacancy?.schedule|| ScheduleType.FullDay, 
    employment: props.vacancy?.employment||EmploymentType.FullTime, 
    languageKnowledges: props.vacancy?.languageKnowledges|| null, 
    published: props.vacancy?.published||true,
  }

  const submit = (data: IVacancyCreate) => {
    setLoading(true)
    const {activeSources, languageKnowledges, cityId, skills, countryId, categoryIds} = creationContext?.helpObjects
    const sendData: IVacancyCreate = {
      ...data, 
      commission: (data.commission&&Number(data.commission))||null,
      skillsIds: [...skills.keys()], 
      salary: Number(data.salary),
      languageKnowledges: [...languageKnowledges.values()].map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: [...activeSources.keys()],
      cityId,
      countryId,
      categoriesIds: categoryIds.map(el=> el.id)
    }
    if(props.id) {
      VacancyRepository.editVacancyById(sendData, props.id)
      .then(res=>{
        appContext.showSnackbar('Вакансия успешно обновлена', SnackbarType.success)
        creationContext.reset()   
        router.replace('/profile?page=vacancies')  
      })
      .catch(err=>{        
        appContext.showSnackbar(err.toString(), SnackbarType.error)
      })
    }
    else {
      VacancyRepository.createVacancy(sendData)
      .then(res => {
        setLoading(false)
        appContext.showSnackbar('Вакансия успешно сохранена', SnackbarType.success)
        setTimeout(()=> {
          router.push('/')    
        }, 2000)
      })
      .catch(err=>{
        alert(err.toString())
      })
    }
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: submit
  })

  const getComponent = (progress: number): [JSX.Element, VacancyNavigation] => {
    switch (progress) {
      case 1:
        return [<VacancyName/>, VacancyNavigation.Name] 
      // case 2: 
      //   return [<Specialization/>, VacancyNavigation.Specialization]
      case 2: 
        return [<WorkPlace/>, VacancyNavigation.WorkPlace]
      case 3:
        return [<VacancyExperience/>, VacancyNavigation.Experience]
      case 4: 
        return [<Compensation/>, VacancyNavigation.Salary]
      case 5: 
        return [<About title={'Описание вакансии'} fieldName={'description'}/> , VacancyNavigation.About]
      case 6:
        return [<Skills fieldToHide={{courses: true, portfolio: true, relocation: true}}/>, VacancyNavigation.Skills]
    }
  }

  const getTitle = (t: VacancyNavigation): string => {
    switch(t) {
      case VacancyNavigation.Specialization: 
        return 'Специализация'
      case VacancyNavigation.Name:
        return 'Название вакансии'
      case VacancyNavigation.Salary:
        return 'Уровень дохода'
      case VacancyNavigation.WorkPlace:
        return 'Место работы'
      case VacancyNavigation.Experience:
        return 'Опыт и график работы'
      case VacancyNavigation.Education:
        return 'Образование'
      case VacancyNavigation.About:
        return 'Описание'
      case VacancyNavigation.Skills:
        return 'Навыки и инструменты'
      case VacancyNavigation.Busyness:
        return 'Занятость'
    }
  }

  const nextPageValidator = (pageNumber?: number) => {
    switch(progress) {
      case 1:
        formik.validateForm()
        .then(res=> {
          res.name && formik.setFieldTouched('name', true)
          creationContext.helpObjects.categoryIds.length > 0
          ? setProgress(pageNumber||progress+1)
          : appContext.showSnackbar('Выберите специализацию', SnackbarType.error)
        })
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


  useEffect(()=>{
    if(progress < 1) {
      setProgress(1)
      router.back()
      return
    }
    changeComponent(progress)
  }, [progress])

  useEffect(()=>{
    if(creationContext.currentVc) {
      formik.setValues(initialValues)
    }
  }, [userContext.currentProfile])

  useEffect(()=>{
    if(props.id) {
      creationContext.getCurrentVc(props.id, props.vacancy)
    }  
    return ()=> {
      formik.resetForm()
      setProgress(1)
      creationContext.setHelpObjects()
      creationContext.reset()
    }
  }, [])
  

  return <div className={styles.root}>
    <UserRegImage type={ProfileType.Hirer} className={styles.regImage}/>
    <div className={styles.content}>    
      <p className={styles.title}>
        {isPhoneWidth &&
          <Button className={styles.buttonBlackSmall} type='button' onClick={()=>setProgress(progress-1)}><ArrowDownSvg className={styles.arrow}/></Button>
        }
        {title}
      </p>
      <ProgressBar progress={progress} pointsCount={CVItemsCount} titles={titles} onClick={nextPageValidator}/>
      <FormikProvider value={formik}>
        <Form  className={styles.form}>
          {page} 

          <div className={styles.buttonWrapper}>
            {progress > 1 && !isPhoneWidth &&
              <Button className={styles.buttonBlack} type='button' onClick={()=>setProgress(progress-1)}>Назад</Button>
            }
            {progress < CVItemsCount &&
              <Button className={styles.buttonYellow} type='button' onClick={()=>nextPageValidator()}>Продолжить</Button>
            }
            { progress === CVItemsCount &&
              <Button isProcess={loading} spinner={loading} disabled={loading} className={styles.buttonYellow}  type='button' onClick={()=> formik.submitForm()}>{creationContext.currentVc?'Обновить': 'Сохранить'} вакансию</Button>
            }
          </div>
        </Form>
      </FormikProvider>
      
    </div>
  </div>
}