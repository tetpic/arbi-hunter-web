
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import ProgressBar from 'components/ui/ProgressBar'
import { useCoursesContext } from 'context/courses_state'
import ICourse, { ICourseBlock, ICourseStep } from 'data/interfaces/ICourse'
import { useRouter} from 'next/router'
import { useEffect, useState } from 'react'
import { CoursesStepType } from 'types/enums'
import styles from './index.module.scss'
import ModulesNavigation from './ModulesNavigation'
import Questions from './Questions'

interface Props {
  course?: ICourse,
  modules?: ICourseBlock[]
  id: string
  block?: string
  step?: string
}

export default function ModulesPage(props: Props) {
  const router = useRouter()
  const courseContext = useCoursesContext()
  const [page, pager] = useState<number>(Number(props.step)||1)
  const [activeModule, setActiveModule] = useState<ICourseBlock>(props.modules[Number(props.block)-1])
  const [activeStep, setActiveStep] = useState<ICourseStep>()
  const [progressLimit, setProgressLimit] = useState<number>()
  const [loading, setLoading] = useState<boolean>(true)
  

  const progressHandler = (p: number) => {
    if (p > 0 && p <= progressLimit) {
      pager(p)
      setActiveStep(courseContext.modules?.get(activeModule)[p - 1])
    }
  }  

  useEffect(()=>{
    const steps = courseContext?.modules?.get(activeModule)
    activeModule&&setProgressLimit(steps?.length)
    if(steps) {
      setActiveStep(steps[0])
    }
  }, [activeModule])

  useEffect(()=>{
    const stepNumber = courseContext.modules?.get(activeModule)?.indexOf(activeStep) + 1
    if(activeStep) {
      activeStep&&pager(stepNumber)  
      const blockNumber = [...courseContext.modules.keys()].indexOf(activeModule)
      router.replace({query: { ...router.query, step: stepNumber, block:  blockNumber+1}}, undefined, {shallow: true})
    }
  }, [activeStep])

  useEffect(()=>{
    const steps = courseContext.modules.get(activeModule)
    if(steps && steps.length > 0) {
      setProgressLimit(courseContext.modules.get(activeModule).length)
      setActiveStep(steps[Number(router.query.step) - 1])
    }
  }, [courseContext.modules])

  useEffect(()=>{
    Promise.all([courseContext.setCurrentCourse(Number(props.id), props.course),
    courseContext.setCourseBlocks(Number(props.id), props.modules)])
    .then(res=>{
      setLoading(false)
    })
   
  }, [])

  return (
  <div className={styles.root}> 
    <div className={styles.body}>
      <BackTextButton onClick={()=>router.push(`/courses/${props.id}?page=modules`)}/>
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>{activeModule.translations[0].title}</h2>
        {progressLimit > 1 && !loading && 
          <ProgressBar itemClassName={styles.progressItem} progress={page} pointsCount={progressLimit} onClick={progressHandler}/>
        }
      </div>
      <p className={styles.stepTitle}>{activeStep?.title}</p>
      {activeStep?.stepType === CoursesStepType.Info &&
        <div className={styles.text} dangerouslySetInnerHTML={{__html: activeStep?.body}}></div>
      }
      {activeStep?.stepType === CoursesStepType.Question &&
        <Questions activeStep={activeStep}/>
      }
      <Button className={styles.button} onClick={()=> progressHandler(page+1)} >Продолжить</Button>
    </div>
    <ModulesNavigation 
    activeModule={activeModule} 
    activeStep={activeStep}
    changeModule={(b: ICourseBlock)=>setActiveModule(b)} 
    changeStep={(s: ICourseStep)=> setActiveStep(s)} 
    />
    
  </div>)
}