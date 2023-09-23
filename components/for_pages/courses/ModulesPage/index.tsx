
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import ProgressBar from 'components/ui/ProgressBar'
import { useCoursesContext } from 'context/courses_state'
import ICourse, { ICourseBlock, ICourseStep } from 'data/interfaces/ICourse'
import { useRouter} from 'next/router'
import { useEffect, useState } from 'react'
import { CoursesStepType, ModalType } from 'types/enums'
import ModulesNavigation from './ModulesNavigation'
import Questions from './Questions'
import styles from './index.module.scss'
import { useResize } from 'components/hooks/useResize'
import BackBtn from 'components/ui/BackBtn'
import { useAppContext } from 'context/state'

interface Props {
  course?: ICourse,
  modules?: ICourseBlock[]
  blocks?: ICourseBlock[] 
  id: string
  initialBlock?: string
  initialStep?: string
  module?: string
}

export default function ModulesPage(props: Props) {  
  const router = useRouter()
  const appContext = useAppContext()

  const courseContext = useCoursesContext()
  const [page, pager] = useState<number>(1)
  const {isTabletWidth} = useResize()
  const initialBlockIndex = props.blocks.findIndex(f=> f.courseModuleId === props.modules[Number(props.module)-1].id)
  const [activeBlock, setActiveBlock] = useState<ICourseBlock>(props.blocks[initialBlockIndex+(Number(props.initialBlock)-1)]||props.blocks[0])

  
  const [activeStep, setActiveStep] = useState<ICourseStep>()
  const [progressLimit, setProgressLimit] = useState<number>()
  const [loading, setLoading] = useState<boolean>(true)
  const [endOfCourse, setIsEnd] = useState<boolean>(false)

  const progressHandler = (p: number) => {
    if (p > 0 && p <= progressLimit) {
      pager(p)
      setActiveStep(courseContext.courseBlocks?.get(activeBlock)[p - 1])
    }
    else {
      const blocksArr = [...courseContext.courseBlocks.keys()]
      const activeIndex = blocksArr.findIndex((el) => {return el===activeBlock})
      if(activeIndex > -1 && activeIndex < blocksArr.length -1) {
        setIsEnd(false)
        setActiveBlock(blocksArr[activeIndex+1])
      }
      else if(activeIndex === blocksArr.length-1) {
        !endOfCourse&&setIsEnd(true)
        appContext.showModal(ModalType.CongratulationsModal)
      }
    }
  }  

  useEffect(()=>{
    const steps = courseContext?.courseBlocks?.get(activeBlock)
    activeBlock&&setProgressLimit(steps?.length)
    if(steps && steps.length > 0) {      
      setActiveStep(steps[0])
    }
  }, [activeBlock])

  useEffect(()=>{
    const stepNumber = courseContext.courseBlocks?.get(activeBlock)?.indexOf(activeStep) + 1
    if(activeStep && stepNumber > 0) {
      activeStep&&pager(stepNumber)  
      const blockNumber = [...courseContext.courseBlocks.keys()].indexOf(activeBlock)
      router.replace({query: { ...router.query, step: stepNumber, block:  blockNumber+1}}, undefined, {shallow: true});
      ((activeStep.stepType === CoursesStepType.Info && activeStep.answers.length === 0)||(activeStep.stepType === CoursesStepType.Question))
      && courseContext.setStepAnswer({courseBlockStepId: activeStep.id})
    }
  }, [activeStep])

  useEffect(()=>{    
    const steps = courseContext.courseBlocks.get(activeBlock)
    if(steps && steps.length > 0) {
      setProgressLimit(courseContext.courseBlocks.get(activeBlock).length)
      setActiveStep(steps[Number(props.initialStep) - 1])
    }
  }, [courseContext.courseBlocks])

  useEffect(()=>{
    const courseId = Number(props.id)   
    Promise.all([
      courseContext.setCurrentCourse(courseId, props.course),
      courseContext.setCourseModules(courseId, props.modules),
      courseContext.setCourseBlocks(courseId, props.blocks),
    ])
    .then(res=>{
      setLoading(false)
    })
  }, [])

  return (
  <div className={styles.root}> 
    <div className={styles.body}>
      {isTabletWidth&&
        <BackBtn className={styles.backButton} onClick={()=>router.push(`/courses/${props.id}?page=modules`)} bgColor={'transparent'}/>
        ||
        <BackTextButton onClick={()=>router.push(`/courses/${props.id}?page=modules`)}/>
      }
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>{activeBlock?.translations[0]?.title}</h2>
        {progressLimit > 1 && !loading && 
          <ProgressBar itemClassName={styles.progressItem} progress={page} pointsCount={progressLimit} onClick={progressHandler}/>
        }
      </div>
      <div className={styles.textContent}>
        <p className={styles.stepTitle}>{activeStep?.title}</p>
        {activeStep?.stepType === CoursesStepType.Info &&
          <div className={styles.text} dangerouslySetInnerHTML={{__html: activeStep?.body}}></div>
        }
      </div>
      {activeStep?.stepType === CoursesStepType.Question &&
        <Questions activeStep={activeStep}/>
      }
      <Button className={styles.button} onClick={()=> progressHandler(page+1)} >{endOfCourse?'Завершить курс': 'Продолжить'}</Button>
    </div>
    {!isTabletWidth &&
      <ModulesNavigation 
      activeBlock={activeBlock} 
      activeStep={activeStep}
      changeBlock={(b: ICourseBlock)=>setActiveBlock(b)} 
      changeStep={(s: ICourseStep)=> setActiveStep(s)} 
      />
    }
    
  </div>)
}