
import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import ProgressBar from 'components/ui/ProgressBar'
import { useCoursesContext } from 'context/courses_state'
import { ICourseBlock, ICourseStep } from 'data/interfaces/ICourse'
import { useRouter} from 'next/router'
import { useEffect, useState } from 'react'
import { CoursesStepType, ModalType } from 'types/enums'
import ModulesNavigation from './ModulesNavigation'
import Questions from './Questions'
import styles from './index.module.scss'
import { useResize } from 'components/hooks/useResize'
import BackBtn from 'components/ui/BackBtn'
import { useAppContext } from 'context/state'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import { ICongratulationsModalProps } from 'components/modals/CongratulationsModal'



export default function ModulesPage() {  
  const router = useRouter()
  const appContext = useAppContext()

  const courseContext = useCoursesContext()
  const [progress, setProgress] = useState<number>(1)
  const {isTabletWidth} = useResize()
  const [progressLimit, setProgressLimit] = useState<number>()
  const [endOfCourse, setIsEnd] = useState<boolean>(false)

  const progressHandler = (p: number) => {
    if (p > 0 && p <= progressLimit) {
      setProgress(p)
      courseContext.setActiveStep(courseContext.courseBlocks?.get(courseContext.activeBlock)[p - 1])
    }
    else {
      const blocksArr = [...courseContext.courseBlocks.keys()]
      const activeIndex = blocksArr.findIndex((el) => {return el===courseContext.activeBlock})
      if(activeIndex > -1 && activeIndex < blocksArr.length -1) {
        setIsEnd(false)
        courseContext.setActiveBlock(blocksArr[activeIndex+1])
      }
      else if(activeIndex === blocksArr.length-1) {
        !endOfCourse&&setIsEnd(true)
        appContext.showModal(ModalType.CongratulationsModal)
      }
    }
  }  

  const activeBlockHandler = (b: ICourseBlock) => {
    setProgress(1)
    courseContext.setActiveBlock(b)
    const steps = courseContext.courseBlocks.get(b)
    courseContext.setActiveStep(steps[0])
    const blockNumber = [...courseContext.courseBlocks.keys()].findIndex(block => b.id === block.id)
    const moduleNumber = [...courseContext.courseModules.keys()].findIndex(m => m.id === b.courseModuleId)
    router.replace({query: { ...router.query, step: 1, block:  blockNumber+1, module: moduleNumber+1}}, undefined, {shallow: true})
  }

  const activeStepHandler = (s: ICourseStep) => {
    courseContext.setActiveStep(s)
    const stepIndex = courseContext.courseBlocks.get(courseContext.activeBlock).findIndex(step=>step.id === s.id)
    setProgress(stepIndex+1)
    router.replace({query: { ...router.query, step: stepIndex+1,}}, undefined, {shallow: true})
  }

  const nextButtonHandler = () => {
    const currentStepIndex = courseContext.allStepsRef.current.findIndex(el => el.id === courseContext.activeStep.id)
    const currentBlockIndex = [...courseContext.courseBlocks.keys()].findIndex(b=> b===courseContext.activeBlock)
    if(courseContext.allStepsRef.current.length-1 === currentStepIndex+1 ) {
      setIsEnd(true)
    }
    if(courseContext.allStepsRef.current.length === currentStepIndex+1) {
      appContext.showModal<ICongratulationsModalProps>(ModalType.CongratulationsModal, {course: courseContext.currentCourse})
      return
    }
    courseContext.allStepsRef.current.length > currentStepIndex+1 
    && activeStepHandler(courseContext.allStepsRef.current[currentStepIndex+1])
    progress === progressLimit 
    && activeBlockHandler(courseContext.allBlocksRef.current[currentBlockIndex+1])

  }

  useEffect(()=>{  
    const steps = courseContext.courseBlocks.get([...courseContext.courseBlocks.keys()].find(el=> el.id === courseContext.activeBlock?.id))
    if(steps && steps.length > 0) {
      const stepNumber = courseContext.courseBlocks?.get(courseContext.activeBlock)?.findIndex(el=> el?.id === courseContext.activeStep?.id)
      setProgressLimit(courseContext.courseBlocks.get(courseContext.activeBlock)?.length)
      courseContext.setActiveStep(steps[stepNumber])
    }
  }, [courseContext.courseBlocks, courseContext.activeBlock])

  useEffect(()=>{
    courseContext.courseInit() 
  }, [])

  return (
  <div className={styles.root}> 
    <div className={styles.body}>
     {!courseContext.loading && 
     <> {isTabletWidth&&
        <BackBtn className={styles.backButton} onClick={()=>router.push(`/courses/${courseContext.currentCourse.id}?page=modules`)} bgColor={'transparent'}/>
        ||
        <BackTextButton onClick={()=>router.push(`/courses/${courseContext.currentCourse.id}?page=modules`)}/>
      }
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>{courseContext.activeBlock?.translations[0]?.title}</h2>
        {progressLimit > 1 && !courseContext.loading && 
          <ProgressBar itemClassName={styles.progressItem} progress={progress} pointsCount={progressLimit} onClick={progressHandler}/>
        }
      </div>
      <div className={styles.textContent}>
        <p className={styles.stepTitle}>{courseContext.activeStep?.title}</p>
        {courseContext.activeStep?.stepType === CoursesStepType.Info &&
          <div className={styles.text} dangerouslySetInnerHTML={{__html: courseContext.activeStep?.body}}></div>
        }
      </div>
      {courseContext.activeStep?.stepType === CoursesStepType.Question &&
        <Questions activeStep={courseContext.activeStep}/>
      }
      <Button className={styles.button} onClick={nextButtonHandler} >{endOfCourse?'Завершить курс':'Продолжить'}</Button>
      </>
      ||
      <Spinner size={34} color={colors.yellow}/>
      }
    </div>
    {!isTabletWidth && !courseContext.loading &&
      <ModulesNavigation 
      activeBlock={courseContext.activeBlock} 
      activeStep={courseContext.activeStep}
      changeBlock={activeBlockHandler} 
      changeStep={activeStepHandler} 
      />
    }
    
  </div>)
}