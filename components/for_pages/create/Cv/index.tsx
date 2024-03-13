import styles from './index.module.scss'

import { useCallback, useEffect, useMemo,  useRef,  useState } from 'react'
import { Form, FormikProvider, useFormik } from 'formik'
import { ICV, ICVCreate } from 'data/interfaces/ICV'
import Button from 'components/ui/Button'
import { Answer, CompensationType, Currency, EducationTypes, EmploymentType, Languages, ModalType, ScheduleType, SnackbarType, VacancyLookType, WorkExperience, WorkExperiencePresense } from 'types/enums'
import { useUserContext } from 'context/user_state'
import {  useCreateVcCvContext } from 'context/createVcCv_state'
import CvRepository from 'data/repositories/CvRepository'
import { useRouter } from 'next/router'
import Experience from './steps/Experience'
import Education from '../utils/Steps/Education'
import Skills from '../utils/Steps/Skills'
import ProgressBar from '../../../ui/ProgressBar'
import { useAppContext } from 'context/state'
import classNames from 'classnames'
import Rive from '@rive-app/react-canvas'
import Title from 'components/ui/TitleForSection'
import CvName from './steps/CvName'
import CvAbout from './steps/CvAbout'
import CvBusyness from './steps/CvBusyness'
import { ICompensationModalArgs } from '@/components/modals/CompensationModal'
import { ISpecializationModalProps } from '@/components/modals/CvModals/Specialization'
import { clearObject } from 'utils/helpers'
import SetTariff from '../utils/SetTariff'


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
  const creationContext = useCreateVcCvContext()
  const {isPhoneWidth, isTabletWidth} = appContext.size

  
  const [title, setTitle] = useState<string>('Специализация')
  const [page, setPage] = useState<JSX.Element>()
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const {progress, setProgress} = creationContext
  const maxProgress = useRef<number>(props?.cv?.completedSteps?.length||1)
  const CVItemsCount = 7

  const submit = (data: ICVCreate, noReplace?: boolean) => {
    setLoading(true)
    const {activeSources, languageKnowledges, skills,  activeGeos, activeVerticals} = creationContext?.helpObjects

    if(creationContext.activeSubCategory.length === 0) {
      setProgress(1)
      appContext.showSnackbar('Укажите специализацию', SnackbarType.error)
      setLoading(false)
      return 
    }
    const sendData: ICVCreate = {
      ...data, 
      commission: Number(data.commission),
      skillsIds: [...skills.keys()], 
      salary: Number(data.salary?.toString().replaceAll(' ', '')),
      languageKnowledges: [...languageKnowledges.values()].map(el=>{return {language: el.language, level: el.level}}),
      sourcesIds: [...activeSources.keys()],
      categoriesIds: [creationContext.activeSubCategory[0].id],
      geosIds: [...activeGeos.keys()],
      experience: WorkExperience.From1to3,
      verticalsIds: [...activeVerticals.keys()],
      published: true,
    }
   
    if(props.id) {
      CvRepository.updateCV(props.id, clearObject(sendData, 'string') as ICVCreate)
      .then(_=>{
        appContext.showSnackbar('Резюме успешно обновлено', SnackbarType.success)
        if(!noReplace) {
          router.replace('/profile?page=cvs')      
        }
      })
      .catch(err=>{        
        appContext.showSnackbar(err, SnackbarType.error)
      })
    }
    else {
      CvRepository.createCV(clearObject(sendData, 'string') as ICVCreate)
      .then(res => {
        appContext.showSnackbar('Резюме успешно сохранено', SnackbarType.success)
        if(!noReplace) {
          router.replace(`/preview/cv/${res.id}`)  
        }
      })
      .catch(err=>{
        appContext.showSnackbar(err, SnackbarType.error)
        setLoading(false)
      })
    }
  }

  const initialValues:ICVCreate  = {
    firstName: props.cv?.firstName|| userContext.currentProfile?.firstName,
    lastName: props.cv?.lastName|| userContext.currentProfile?.lastName,
    patronymic: props.cv?.patronymic|| userContext.currentProfile?.patronymic,
    birthday: props.cv?.birthday|| userContext.currentProfile?.birthday,
    compensation: props.cv?.compensation||null,
    phone: userContext.currentProfile?.phone,
    email: userContext.currentProfile?.email,
    telegramNickname: props.cv?.telegramNickname||userContext.currentProfile?.telegramNickname, 
    cityId: props.cv?.cityId||userContext.currentProfile?.cityId,
    countryId: props.cv?.countryId||userContext.currentProfile?.countryId,
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
    businessTrips: props.cv?.businessTrips||Answer.No,
    searchPosition: '',
    assetsIds: props.cv?.assetsIds||[],
    gender: props.cv?.gender||undefined,
    whatsapp: props.cv?.whatsapp||'',
    viber: props.cv?.viber||'',
    linkedin: props.cv?.linkedin||'',
    skype: props.cv?.skype||'',
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (v)=>submit(v)
  })

  const nextPageValidator = (pageNumber?: number) => {
    const setErr = (val: string, err?: string) => {
      formik.setFieldTouched(val, true).then(_=>{
        formik.setFieldError(val, err||' ')
      })
    }

    switch(progress) {
      case 1:
        (()=> {
          const args: ICompensationModalArgs = {
            onSubmit: (data) => {
              
              formik.setValues({...formik.values, ...data, compensation: data.compensation||CompensationType.Salary})
               setProgress(pageNumber||progress+1)
             },
             initialValues: formik.values
          }

          if(creationContext.activeSubCategory.length > 0) {
            isTabletWidth?
            appContext.showBottomSheet<ICompensationModalArgs>(ModalType.CompensationModal, args, 420):
            appContext.showModal<ICompensationModalArgs>(ModalType.CompensationModal, args)
          }
          else {
            appContext.showModal<ISpecializationModalProps>(ModalType.SpecializationModal, {
              manyItems: false,
              onSubmit: (data)=>{
                creationContext.setActiveSubcategory(data)
                creationContext.setActiveCategory(null)
                appContext.hideModal()
                isTabletWidth?
                appContext.showBottomSheet<ICompensationModalArgs>(ModalType.CompensationModal, args, 420):
                appContext.showModal<ICompensationModalArgs>(ModalType.CompensationModal, args)
              },
            })
            appContext.showSnackbar('Выберите специализацию', SnackbarType.error)
          }
        })()
        break

      case 2: {
        formik.validateField('birthday')
        .then(v => {
          if(v) {
            setErr('birthday', 'Укажите дату рождения')
          }
          else {
            setProgress(pageNumber||progress+1)
          }
        })
      }
      break
      default :
        
        setProgress(pageNumber||progress+1)
    }
  }


  const getComponent = useCallback((progress: number): [JSX.Element, CvNavigation] => {
    switch (progress) {
      case 1: 
        return [<CvName onSuggestionClick={(data)=> {
          creationContext.setActiveSubcategory(data)
        }}/>, CvNavigation.Specialization]
      case 2: 
        return [<CvAbout/>, CvNavigation.About]
      case 3: 
        return [<Experience name={'experienceInfo'}/>, CvNavigation.Experience]
      case 4:
        return [<Education name={'educationInfo'}/>, CvNavigation.Education]
      case 5: 
        return [<Skills fieldToHide={{relocation: true}}/>, CvNavigation.Skills]
      case 6: 
        return [<CvBusyness/>, CvNavigation.Busyness]
    }
  }, [creationContext])

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

  const changeComponent = (p: number) => {
    if(progress < CVItemsCount) {
      const [element, type] = getComponent(p)
      setTitle(getTitle(type))   
      setPage(element)
    }
  }

  const getImage = ():{src: string, animations: string[], artboards?: string[]} => {
    switch (progress) {
      case 1:
        return {src: '/rive/cvCreate/1.riv', animations: ['Man2-3', 'Man2-2', 'Man2-1', 'Man1-4', 'Man1-3', 'Man1-2', 'Man1-1']}
      case 2: 
        // return {src: '/rive/cvCreate/2.riv', animations: ['Hands', 'Flow']}
        return {src: '/rive/cvCreate/3.riv', animations: ['BubbleFloat', 'Bubbles', 'Eyes', 'Hand', 'Phone', 'Head', 'Body']}
      case 3: 
      return {src: '/rive/cvCreate/4.riv', animations: ['Text'], artboards: ['RU','EN', 'UA']}
      case 4: 
      return {src: '/rive/cvCreate/5.riv', animations: ['Man1', 'Man2', 'Man1Head']}
      case 5: 
      return {src: '/rive/cvCreate/6.riv', animations: ['Bubbles', 'RHandMove', 'RHand', 'Eyes', 'Head', 'LHand', 'Finger']}
      case 6: 
      return {src: '/rive/cvCreate/7.riv', animations: ['DollarsA', 'Stars', 'Body', 'Head', 'Hand']}
      case 7: 
      default:
        return {src: '/rive/cvCreate/1.riv', animations: ['Man2-3', 'Man2-2', 'Man2-1', 'Man1-4', 'Man1-3', 'Man1-2', 'Man1-1']}
    }
  }

  const memoedRive = useMemo(()=>{
    const image = getImage()
    return <Rive src={image.src} animations={image.animations}  key={image.src} artboard={image.artboards&&image.artboards[0]} className={styles.rive}/>
  }, [progress])

  useEffect(()=>{
    if(props.id) {
      creationContext.getCurrentCv(props.id, props.cv)
    }  
  }, [])


  useEffect(()=>{
    if(creationContext.activeSubCategory.length > 0 && progress === 1) {
      nextPageValidator()
    }
  }, [creationContext.activeSubCategory])

  useEffect(()=>{

    if(progress < 1) {
      setProgress(1)
      router.back()
      return
    }
    changeComponent(progress)

    router.replace({query: { ...router.query, id: creationContext.draftId.current, progress: progress}}, undefined, {shallow: true})

    if(maxProgress.current > progress|| props.cv?.completedSteps?.length === CVItemsCount) return 

    maxProgress.current < progress && (maxProgress.current = progress)

    if(progress > 1 &&creationContext.activeSubCategory.length > 0) {
      const formikCleared = {
        ...formik.values, 
        categoriesIds: [creationContext.activeSubCategory[0]?.id],
        salary: Number(formik.values.salary?.toString().replaceAll(' ', '')),
        published: false,
      }
      Object.entries(formikCleared).forEach((entry) => {
        //@ts-ignore
        !Boolean(entry[1])&&(delete formikCleared[entry[0]])
      })
      
      creationContext.saveDraft({cv: {...formikCleared, completedSteps: new Array(maxProgress.current).fill(true).map((e, i) => i)}})
    }
    
  }, [progress])

  useEffect(()=>{
    formik.setValues(initialValues)
  }, [userContext.currentProfile, props.cv])

  

  return <div className={styles.root}>
    {progress === CVItemsCount && 
      <SetTariff setText='Разместить резюме' onSave={(noReplace?: boolean)=>submit(formik.values, noReplace)} onBack={()=>setProgress(progress-1)} type='cv'/>
    }
    {progress < CVItemsCount &&
    <>
    {!isTabletWidth && progress < CVItemsCount&& memoedRive}
    <div className={styles.content}>    
      <FormikProvider value={formik}>
        <Title title={title} className={styles.title} onBackClick={()=>setProgress(progress-1)}/>
        <ProgressBar progress={progress} pointsCount={CVItemsCount} titles={titleTips} onClick={nextPageValidator}/>
        <Form  className={styles.form}>
          {isTabletWidth && memoedRive}
          {page} 
          <div className={styles.buttonWrapper}>
            {progress > 1 && !isPhoneWidth &&
              <Button 
              className={styles.buttonBorderGradient} 
              type='button' 
              title={'prev'} 
              onClick={()=>setProgress(progress-1)}
              >
                Назад
              </Button>
            }
            {progress < CVItemsCount &&
              <Button 
              className={styles.buttonGradient} 
              type='button' 
              title={'next'} 
              onClick={()=>nextPageValidator()}
              >
                Продолжить
              </Button>
            }
            { progress === CVItemsCount &&
              <Button 
              isProcess={loading} 
              spinner={loading} 
              disabled={loading} 
              title={'save'} 
              className={classNames(styles.buttonGradient, loading&&styles.disabled)} 
              type='button' 
              onClick={()=> formik.submitForm()}
              >
                Сохранить резюме
              </Button>
            }
          </div>
        </Form>
      </FormikProvider>
    </div>
    </>}
  </div>
}

