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
import styles from './index.module.scss'
import Specialization from '../utils/Steps/Specialization'
import About from '../utils/Steps/About'
import Skills from '../utils/Steps/Skills'
import ProgressBar from '../utils/ProgressBar'
import WorkPlace from '../utils/Steps/WorkPlace'
import { IVacancyCreate } from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import Compensation from '../utils/Steps/Compensation'
import VacancyName from '../utils/Steps/VacancyName'
import VacancyExperience from '../utils/Steps/VacancyExperience'
import { useAppContext } from 'context/state'

interface Props {
  id?: number
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
  
  const {isPhoneWidth} = useResize()
  
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()
  const [loading, setLoading] = useState<boolean>(false)
  

  const userContext = useUserContext()
  const appContext = useAppContext()
  const cvContext = useCreateVcCvContext()

  const router = useRouter()
  const {progress, setProgress} = cvContext

  


  const submit = (data: IVacancyCreate) => {
    
    setLoading(true)
    const {activeSources, languageKnowledges, cityId, skills, countryId, categoryIds} = cvContext?.helpObjects
    const sendData: IVacancyCreate = {
      ...data, 
      skillsIds: skills.map(el=>el.id), 
      salary: Number(data.salary),
      languageKnowledges: languageKnowledges.map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: Array.from(activeSources).map(el=> el.id),
      cityId,
      countryId,
      categoriesIds: categoryIds.map(el=> el.id)
    }

    if(props.id) {
      VacancyRepository.editVacancyById(sendData, props.id)
      .then(res=>{
        appContext.showSnackbar('Вакансия успешно обновлена', SnackbarType.success)
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

  const CVItemsCount = 7

  const formik = useFormik<IVacancyCreate>({
    initialValues: {
      name: cvContext?.currentVc?.name||'',
      description: cvContext?.currentVc?.description||'',
      experience: cvContext?.currentVc?.experience||WorkExperience.From1to3, 
      contactName: cvContext?.currentVc?.contactName||userContext.currentProfile.firstName, 
      company: cvContext?.currentVc?.company||userContext.currentProfile.company, 
      isRemote: cvContext?.currentVc?.isRemote||false,
      compensation: cvContext?.currentVc?.compensation||CompensationType.Salary,
      phone: cvContext?.currentVc?.phone||userContext.currentProfile.phone,
      email: cvContext?.currentVc?.email||userContext.user?.profiles[0]?.email,
      telegramNickname: cvContext?.currentVc?.telegramNickname||userContext.user?.profiles[0]?.telegramNickname, 
      cityId: cvContext?.currentVc?.cityId||null,
      countryId: cvContext?.currentVc?.countryId||null,
      currency: cvContext?.currentVc?.currency|| Currency.RUB,
      skillsIds: cvContext?.currentVc?.skillsIds|| [],
      categoriesIds: cvContext?.currentVc?.categoriesIds||  null,
      sourcesIds: cvContext?.currentVc?.sourcesIds|| null,
      salary: cvContext?.currentVc?.salary|| null,
      schedule: cvContext?.currentVc?.schedule|| ScheduleType.FullDay, 
      employment: cvContext?.currentVc?.employment||EmploymentType.FullTime, 
      languageKnowledges: cvContext?.currentVc?.languageKnowledges|| null, 
      published: cvContext?.currentVc?.published||false,
    },
    onSubmit: submit
  })


  const getComponent = (progress: number): [JSX.Element, VacancyNavigation] => {
    switch (progress) {
      case 1:
        return [<VacancyName/>, VacancyNavigation.Name] 
      case 2: 
        return [<Specialization/>, VacancyNavigation.Specialization]
      case 3: 
        return [<WorkPlace/>, VacancyNavigation.WorkPlace]
      case 4:
        return [<VacancyExperience/>, VacancyNavigation.Experience]
      case 5: 
        return [<Compensation/>, VacancyNavigation.Salary]
      case 6: 
        return [<About title={'Описание вакансии'}/>, VacancyNavigation.About]
      case 7:
        return [<Skills fieldToHide={{courses: true, portfolio: true}}/>, VacancyNavigation.Skills]
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

  const progressHandler = (p: number) => {
    const [element, type] = getComponent(p)
    setTitle(getTitle(type))   
    setPage(element)
  }

  useEffect(()=>{
    if(progress < 1) {
      router.back()
      return
    }
    progressHandler(progress)

  }, [progress])
  

  return <div className={styles.root}>
    <UserRegImage type={ProfileType.Hirer} className={styles.regImage}/>
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
              <Button spinner={loading} disabled={loading} className={styles.buttonYellow}  type='submit' onClick={()=> formik.submitForm()}>Сохранить резюме</Button>
            }
          </div>
        </Form>
      </FormikProvider>
      
    </div>
  </div>
}