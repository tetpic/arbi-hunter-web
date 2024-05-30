import styles from './index.module.scss'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import Button from 'components/ui/Button'
import { CompensationType, Currency, EmploymentType, ScheduleType,  SnackbarType,  WorkExperience} from 'types/enums'
import { useUserContext } from 'context/user_state'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import { useRouter } from 'next/router'
import About from '../utils/Steps/About'
import Skills from '../utils/Steps/Skills'
import ProgressBar from '../../../ui/ProgressBar'
import {IVacancy, IVacancyCreate} from 'data/interfaces/IVacancy'
import VacancyRepository from 'data/repositories/VacancyRepository'
import Compensation from '../utils/Steps/Compensation'
import VacancyName from '../utils/Steps/VacancyName'
import VacancyExperience from '../utils/Steps/VacancyExperience'
import { useAppContext } from 'context/state'
import Rive from '@rive-app/react-canvas'
import Busyness from '../utils/Steps/Busyness'
import Contacts from '../utils/Steps/Contacts'
import Spacer from '@/components/ui/Spacer'
import SetTariff from '../utils/SetTariff'
import { clearObject } from 'utils/helpers'
import VacancyPreview from '../../preview/vacancy'
import useTranslation from 'next-translate/useTranslation'
import Title from '@/components/ui/TitleForSection'
import CrossSvg from '@/components/svg/CrossSvg'

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
  Tariff = 'tariff',
  Contacts = 'contacts'

}

export default function Vacancy(props: Props) {
  const appContext = useAppContext()
  const userContext = useUserContext()
  const creationContext = useCreateVcCvContext()
  const {t} = useTranslation()

  const {isPhoneWidth, isTabletWidth} = appContext.size
  const router = useRouter()
  const {progress, setProgress} = creationContext
  const [showPreview, setShowPreview] = useState<boolean>(false)
  
  const [title, setTitle] = useState<string>(t('create_vacancy_specialization'))
  const [page, setPage] = useState<JSX.Element>()
  const maxProgress = useRef<number>(props.vacancy?.completedSteps?.length||1)
  const initialDescription = `<p>${t('create_vacancy_responsibilities')}</p><ul><li></li><li></li><li></li></ul><p>${t('create_vacancy_requirements')}</p><ul><li></li><li></li><li></li></ul><p>${t('create_vacancy_conditions')}</p><ul><li></li><li></li><li></li></ul>`

  const {activeSources, activeGeos, activeVerticals, languageKnowledges, cityId, skills, countryId, categoryIds} = creationContext?.helpObjects

  const VCItemsCount = 8
  const titles = [
    t('create_vacancy_nameShort'), 
    t('create_vacancy_specialization'), 
    t('create_vacancy_workPlace'), 
    t('create_vacancy_experience'), 
    t('create_vacancy_salary'), 
    t('create_vacancy_descriptionShort'), 
    t('create_vacancy_skills')]

  const getContactName = () => {
    if(props.vacancy) {
      const arr = [props.vacancy.profile.firstName, props.vacancy.profile.lastName, props.vacancy.profile.patronymic]
      return arr.filter(Boolean).join(' ')
    }
    else if(userContext.currentProfile) {
      const arr = [userContext.currentProfile?.firstName, userContext.currentProfile?.lastName, userContext.currentProfile?.patronymic]
      return arr.filter(Boolean).join(' ')
    }
    else {
      return ''
    }
  }

  const initialValues: IVacancyCreate = {
    name: props.vacancy?.name||'',
    description: props.vacancy?.description||initialDescription,
    experience: props.vacancy?.experience||WorkExperience.From1to3, 
    contactName: props.vacancy?.contactName||getContactName(), 
    company: props.vacancy?.company||userContext.currentProfile?.company, 
    isRemote: props.vacancy?.isRemote||false,
    compensation: props.vacancy?.compensation||CompensationType.Salary,
    phone: props.vacancy?.phone||userContext.currentProfile?.phone,
    email: props.vacancy?.email||userContext.currentProfile?.email,
    telegramNickname: props.vacancy?.telegramNickname||userContext.currentProfile?.telegramNickname, 
    cityId: props.vacancy?.cityId||userContext.currentProfile?.cityId,
    countryId: props.vacancy?.countryId||userContext.currentProfile?.countryId,
    commission: props.vacancy?.commission||null,
    currency: props.vacancy?.currency|| Currency.RUB,
    skillsIds: props.vacancy?.skillsIds|| [],
    categoriesIds: props.vacancy?.categoriesIds||  null,
    sourcesIds: props.vacancy?.sourcesIds|| null,
    salary: props.vacancy?.salary|| null,
    salaryMin: props.vacancy?.salaryMin|| null,
    salaryMax: props.vacancy?.salaryMax|| null,
    schedule: props.vacancy?.schedule|| ScheduleType.FullDay, 
    employment: props.vacancy?.employment||EmploymentType.FullTime, 
    languageKnowledges: props.vacancy?.languageKnowledges|| null, 
    published: props.vacancy?.published||true,
    showContactName: props.vacancy?.showContactName,
    showEmail: props.vacancy?.showEmail,
    showPhone: props.vacancy?.showPhone,
    showTelegramNickname: props.vacancy?.showTelegramNickname,
  }

  const getSendData = (data: IVacancyCreate) => {
    const sendData: IVacancyCreate = {
      ...data, 
      salary: null,
      commission: (data.commission&&Number(data.commission))||null,
      skillsIds: [...skills.keys()], 
      salaryMin: Number(data.salaryMin?.toString().replaceAll(' ', '')),
      salaryMax: Number(data.salaryMax?.toString().replaceAll(' ', '')),
      languageKnowledges: [...languageKnowledges.values()].map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: [...activeSources.keys()],
      verticalsIds: [...activeVerticals.keys()],
      geosIds: [...activeGeos.keys()],
      categoriesIds: [creationContext.activeSubCategory[0]?.id],
      description: data.description === initialDescription||data.description === '<p></p>'||data.description === ''? '<p></p>' : data.description,
      published: true
    }
    return clearObject(sendData) as IVacancyCreate
  }

  const getDataToSend = (data: IVacancyCreate):IVacancyCreate => {
    const sendData = getSendData(data)

    if(data.isRemote) {
      sendData.cityId = null
      sendData.countryId = null
    }
    else if (cityId || countryId) {
      cityId&&(sendData.cityId = cityId)
      countryId&&(sendData.countryId = countryId)
    }
    return sendData
  }

  const saveVacancy = (data: IVacancyCreate, noRedirect?: boolean) => {
    const sendData = getDataToSend(data)

    if(props.id) {
      VacancyRepository.editVacancyById(sendData, props.id)
      .then(res=>{
        appContext.showSnackbar(t('create_vacancy_refreshed'), SnackbarType.success)
        !noRedirect&&router.push('/vacancies')  
      })
      .catch(err=>{        
        appContext.showSnackbar(err.toString(), SnackbarType.error)
      })
    }
    else {
      VacancyRepository.editVacancyById(sendData, creationContext.draftId.current)
      .then(res => {
        appContext.showSnackbar(t('create_vacancy_saved'), SnackbarType.success)
        setTimeout(()=> {
          !noRedirect&&router.push('/vacancies')  
        }, 1500)
      })
      .catch(err=>{
        setTimeout(()=> {
        }, 1500)
        alert(err.toString())
      })
    }
  }

  const submit = (data: IVacancyCreate, noRedirect?: boolean) => {
      saveVacancy(data, noRedirect)
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (v)=>submit(v)
  })

  const setErr = (val: string, err?: string) => {
    formik.setFieldTouched(val, true).then(_=>{
      formik.setFieldError(val, err||' ')
    })
  }

  const nextPageValidator = (pageNumber?: number):boolean => {
    switch(progress) {
      case 1:
        if(formik.values.name.trim().length < 1) {
          setErr('name', t('create_vacancy_setName'))
          return false
        }
        if(creationContext.activeSubCategory.length === 0) {
          appContext.showSnackbar(t('create_vacancy_setNameFromList'), SnackbarType.error)
          return false
        }

        setProgress(pageNumber||progress+1)
        return false
      case 2: 
        const salaryMinNumber: number = Number(formik.values.salaryMin?.toString().replaceAll(' ', ''))
        const salaryMaxNumber: number = Number(formik.values.salaryMax?.toString().replaceAll(' ', ''))
        if(!salaryMinNumber && !salaryMaxNumber && formik.values.compensation !== CompensationType.Contract) {
          setErr('salaryMin')
          setErr('salaryMax')
        }
        else {
          setProgress(pageNumber||progress+1)
        }

        // if(formik.values.compensation === CompensationType.Salary && (!formik.values.salary||salaryNumber < 1)) {
        //   setErr('salary')
        //   return false
        // }
        // else if(formik.values.compensation === CompensationType.Commission && (!formik.values.commission||formik.values.commission < 1)) {
        //   setErr('commission')
        //   return false
        // }
        // else if(formik.values.compensation === CompensationType.Gybrid) {
        //   const salaryNumber: number = Number(formik.values.salary.toString().replaceAll(' ', ''))
        //   if(!formik.values.commission||formik.values.commission < 1) {
        //     setErr('commission')
        //     return false
        //   }
        //   if(!formik.values.salary||salaryNumber < 1) {
        //     setErr('salary')
        //     return false
        //   }
        //   if(formik.values.commission > 0 && salaryNumber > 0) {
        //     setProgress(pageNumber||progress+1)
        //     return true
        //   }
        // }
        // else {
        //   setProgress(pageNumber||progress+1)
        //   return false
        // }
      break
      case 7: {      
        const vals = [
          formik.values.showContactName && formik.values.contactName.trim().length === 0,
          formik.values.showEmail && formik.values.email.trim().length === 0,
          formik.values.showTelegramNickname && formik.values.telegramNickname.trim().length === 0,
          formik.values.showPhone && formik.values.phone.trim().length === 0
        ]
        if(vals.filter(Boolean).length > 0) {
          vals[0]&&setErr('contactName', 'Заполните поле')
          vals[1]&&setErr('email', 'Заполните поле')
          vals[2]&&setErr('telegramNickname', 'Заполните поле')
          vals[3]&&setErr('phone', 'Заполните поле')     
        }
        else {
          setProgress(pageNumber||progress+1)
          return true
        }
        // if(formik.values.showContactName && formik.values.contactName.trim().length === 0) {
        //   setErr('contactName')
        // }
        // if (formik.values.showEmail && formik.values.email.trim().length === 0) {
        //   setErr('email')
        // }
        // if (formik.values.showTelegramNickname && formik.values.telegramNickname.trim().length === 0){
        //   setErr('telegramNickname')
        // }
        // if (formik.values.showPhone && formik.values.phone.trim().length === 0) {
        //   setErr('phone')
        // }
        // else {
        //   setProgress(pageNumber||progress+1)
        //   return true
        // }



        // if(formik.values.description.trim().length < 1) {
        //   setErr('description', t('create_vacancy_writeDetails'))
        //   return false
        // } 
        // else {
        //   setProgress(pageNumber||progress+1)
        //   return false
        // }
      }
      break
      case 8:
          setProgress(pageNumber||progress+1)
          return true
      // case 7:
      //   return true
      default :
        setProgress(pageNumber||progress+1)
        return true
    }
  } 

  const getComponent = (progress: number): [JSX.Element, VacancyNavigation] => {
    switch (progress) {
      case 1:
        return [<VacancyName onSuggestClick={(val)=> {
          setProgress(2)
        }}/>, VacancyNavigation.Name] 
      case 2: 
        // return [<Specialization/>, VacancyNavigation.Specialization]
        return [<Compensation/>, VacancyNavigation.Salary]
      case 3: 
      return [<Busyness/>, VacancyNavigation.Busyness]
      case 4:
        return [<VacancyExperience/>, VacancyNavigation.Experience]
      case 5: 
      return [<Skills fieldToHide={{courses: true, portfolio: true, relocation: true, traffic: true}}/>, VacancyNavigation.Skills]
      case 6: 
      return [<About title={t('create_vacancy_description')} fieldName={'description'}/> , VacancyNavigation.About]
      case 7:
        return [<Contacts/>, VacancyNavigation.Contacts]

    }
  }

  const getTitle = (n: VacancyNavigation): string => {
    switch(n) {
      case VacancyNavigation.Specialization: 
        return t('create_vacancy_caterory')
      case VacancyNavigation.Name:
        return t('create_vacancy_name')
      case VacancyNavigation.Salary:
        return t('create_vacancy_salary')
      case VacancyNavigation.WorkPlace:
        return t('create_vacancy_workPlace')
      case VacancyNavigation.Experience:
        return t('create_vacancy_experience')
      case VacancyNavigation.Education:
        return t('create_vacancy_education')
      case VacancyNavigation.About:
        return t('create_vacancy_description')
      case VacancyNavigation.Skills:
        return t('create_vacancy_skills')
      case VacancyNavigation.Busyness:
        return t('create_vacancy_bysiness')
      case VacancyNavigation.Contacts:
        return t('create_vacancy_contactInfo')
    }
  }

  const changeComponent = (p: number) => {
    if(progress < VCItemsCount) {
      const [element, type] = getComponent(p)
      setTitle(getTitle(type))   
      setPage(element)
    }
  }

  const getImage = ():{src: string, animations: string[], artboards?: string[]} => {
    switch (progress) {
      case 1:
        return {src: '/rive/vacancyCreate/1.riv', animations: ['Timeline 2', 'Timeline 1']}
      case 2: 
        return {src: '/rive/vacancyCreate/2.riv', animations: ['Text']}
      case 3: 
      return {src: '/rive/vacancyCreate/3.riv', animations: ['Text'], artboards: ['RU', 'EN', 'UA']}
      case 4: 
      return {src: '/rive/vacancyCreate/4.riv', animations: ['Man1','Man2', 'Man1Head'], artboards: ['RU', 'EN', 'UA']}
      case 5: 
      return {src: '/rive/vacancyCreate/5.riv', animations: ['Head', 'Baks', 'Wrist', 'Hand', 'Tors', 'Legs', 'Eyes']}
      case 6: 
      return {src: '/rive/vacancyCreate/6.riv', animations: ['Stars', 'Mag', 'Float', 'Back']}
      case 7: 
      return {src: '/rive/vacancyCreate/7.riv', animations: ['Stars', 'Mag', 'Float', 'Back']}
      case 8: 
      // case 9: 
      //   return {src: '/rive/vacancyCreate/7.riv', animations: ['Stars', 'Mag', 'Float', 'Back']}
      default:
        return {src: '/rive/vacancyCreate/1.riv', animations: ['Timeline 2', 'Timeline 1']}
    }
  }

  const progressBar = <ProgressBar progress={progress} pointsCount={VCItemsCount} titles={titles} onClick={nextPageValidator}/>


  const memoedRive = useMemo(()=>{
    const image = getImage()
    return <Rive stateMachines={'State Machine 1'} src={image.src} animations={image.animations} artboard={image.artboards&&image.artboards[1]}    key={image.src} className={styles.rive}/>
  }, [progress])

  useEffect(()=>{
    if(progress < 1) {
      router.back()
      return
    }

    if(progress <=VCItemsCount) {
      router.replace({query: {...router.query, id: creationContext.draftId.current,  progress: progress <=VCItemsCount?progress: VCItemsCount}}, undefined, {shallow: true})
    }

    changeComponent(progress)
    if(props.vacancy?.subscriptions) return 
    maxProgress.current < progress && (maxProgress.current = progress)
    
    if(progress > 1 && creationContext.activeSubCategory.length > 0) {
      const sendData = getSendData(formik.values)

      const formikCleared = {
        ...sendData, 
        salaryMin: Number(formik.values.salaryMin?.toString().replaceAll(' ', '')),
        salaryMax: Number(formik.values.salaryMax?.toString().replaceAll(' ', '')),
        published: false,
      }
      Object.entries(formikCleared).forEach((entry) => {
        //@ts-ignore
        !Boolean(entry[1])&&(delete formikCleared[entry[0]])
      })
      creationContext.saveDraft({vacancy: {...formikCleared, completedSteps: new Array(maxProgress.current).fill(true).map((e, i) => i)}})
    }
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
  }, [])

  return <div className={styles.root}>
    {showPreview && 
      <VacancyPreview 
      onBack={(page)=>{
        if(page){
          setProgress(page)
        }
        setShowPreview(false)
      }} 
      onPublish={()=> {
        if(!props.vacancy||!props.vacancy?.subscriptions) {
          setShowPreview(false)
        }
        else {
          formik.submitForm()
        }
      }}
      vacancy={getDataToSend({...creationContext.draftItem.current, ...props.vacancy, ...formik.values}) as IVacancy}/>
    }

    {progress === VCItemsCount && !showPreview &&
      <SetTariff 
      setText={t('create_vacancy_publish')} 
      onPreview={()=>setShowPreview(true)} 
      onSave={(noReplace?: boolean)=>submit(formik.values, noReplace)} 
      onBack={()=>setProgress(progress-1)} type='vacancy'
      progressBar={isTabletWidth &&progressBar}
      />
    }  

    {progress < VCItemsCount &&<>
    {!isTabletWidth && progress < VCItemsCount && memoedRive}
    <div className={styles.content}>    
      <FormikProvider value={formik}>
        <Title 
        title={title} 
        className={styles.title} 
        onBackClick={()=>setProgress(progress-1)}
        rightButton={isTabletWidth &&
          <Button 
          onClick={()=> {
            router.back()
          }}
          styleType={['black', 'icon']}>
            <CrossSvg/>
          </Button>
        }
        />
        {progressBar}
        <Form  className={styles.form}>
          {isTabletWidth && memoedRive}
          {page} 

          {isTabletWidth && <Spacer basis={24}/>}

          <div className={styles.buttonWrapper}>
            {progress > 1 && !isPhoneWidth &&
              <Button styleType={['black']} altStyleType={['white']} type='button' title='back' onClick={()=>setProgress(progress-1)}>{t('back')}</Button>
            }
            {progress < VCItemsCount &&
              <Button styleType={['gradient', 'phoneWide']} type='button' title='next' onClick={()=>nextPageValidator()}>{t('continue')}</Button>
            }
            { progress === VCItemsCount &&
              <Button 
              isProcess={formik.isSubmitting} 
              title='create' 
              spinner={formik.isSubmitting} 
              disabled={formik.isSubmitting} 
              className={styles.buttonGradient} 
           
              type='button' 
              onClick={()=> formik.submitForm()}
              >
                {creationContext.currentVc?t('create_vacancy_refresh'): t('create_vacancy_save')}
              </Button>
            }
          </div>
        </Form>
      </FormikProvider>
      
    </div>
    </>}
  </div>
}