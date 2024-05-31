import styles from './index.module.scss'

import BackTextButton from 'components/ui/BackTextButton'
import Button from 'components/ui/Button'
import ProgressBar from 'components/ui/ProgressBar'
import { useCoursesContext } from 'context/courses_state'
import { ICourseBlock, ICourseStep } from 'data/interfaces/ICourse'
import { useRouter} from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { CoursesStepType, ModalType } from 'types/enums'
import ModulesNavigation from './ModulesNavigation'
import Questions from './Questions'
import { useResize } from 'components/hooks/useResize'
import BackBtn from 'components/ui/BackBtn'
import { useAppContext } from 'context/state'
import Spinner from 'components/ui/Spinner'
import { colors } from 'styles/variables'
import { ICongratulationsModalProps } from 'components/modals/CongratulationsModal'
import useTranslation from 'next-translate/useTranslation'
import HtmlText from '@/components/ui/HtmlText'



export default function ModulesPage() {  
  const {t} = useTranslation()
  const appContext = useAppContext()
  const courseContext = useCoursesContext()
  const router = useRouter()

  const [progress, setProgress] = useState<number>(1)
  const [progressLimit, setProgressLimit] = useState<number>()
  const [endOfCourse, setIsEnd] = useState<boolean>(false)

  const currentStepIndex = useRef<number>()
  const currentBlockIndex = useRef<number>()
  const {isTabletWidth} = useResize()

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

  const checkIsEnd =(buttonPushed?: boolean)=> {
    currentStepIndex.current = courseContext.allStepsRef.current.findIndex(el => el.id === courseContext?.activeStep?.id)
    currentBlockIndex.current = [...courseContext.courseBlocks.keys()].findIndex(b=> b===courseContext.activeBlock)
 
    if(courseContext.allStepsRef.current.length === currentStepIndex.current+1 && buttonPushed) {
      appContext.showModal<ICongratulationsModalProps>(ModalType.CongratulationsModal, {course: courseContext.currentCourse})
      return
    }
    if(courseContext.allStepsRef.current.length === currentStepIndex.current+1 ) {
      setIsEnd(true)
      return
    }
    setIsEnd(false)
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
    if(!endOfCourse) {
      courseContext.allStepsRef.current.length > currentStepIndex.current+1 
      && activeStepHandler(courseContext.allStepsRef.current[currentStepIndex.current+1])
      progress === progressLimit 
      && activeBlockHandler(courseContext.allBlocksRef.current[currentBlockIndex.current+1])
    }
    else {
      checkIsEnd(true)
    }
  }

  useEffect(()=>{
    checkIsEnd()
  }, [courseContext.activeStep])

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
     {!courseContext.blocksLoading && 
     <> {isTabletWidth&&
        <BackBtn className={styles.backButton} onClick={()=>router.push(`/courses/${courseContext.currentCourse.id}?page=modules`)} bgColor={'transparent'}/>
        ||
        <BackTextButton onClick={()=>router.push(`/courses/${courseContext.currentCourse.id}?page=modules`)}/>
      }
      <div className={styles.titleWrapper}>
        <h2 className={styles.title}>{courseContext.activeBlock?.translations[0]?.title}</h2>
        {progressLimit > 1 && !courseContext.blocksLoading && 
          <ProgressBar itemClassName={styles.progressItem} progress={progress} pointsCount={progressLimit} onClick={progressHandler}/>
        }
      </div>
      <div className={styles.textContent}>
        <p className={styles.stepTitle}>{courseContext.activeStep?.title}</p>
        {courseContext.activeStep?.stepType === CoursesStepType.Info &&
          <HtmlText text={courseContext.activeStep?.body}/>
        }
      </div>
      {courseContext.activeStep?.stepType === CoursesStepType.Question &&
        <Questions activeStep={courseContext.activeStep}/>
      }
      <Button className={styles.button} styleType={['gradient', 'phoneWide']} onClick={nextButtonHandler} >{!endOfCourse?t('continue'):t('courses_finish')}</Button>
      </>
      ||
      <Spinner size={34} color={colors.blue}/>
      }
    </div>
    {!isTabletWidth && !courseContext.blocksLoading &&
      <ModulesNavigation 
      activeBlock={courseContext.activeBlock} 
      activeStep={courseContext.activeStep}
      changeBlock={activeBlockHandler} 
      changeStep={activeStepHandler} 
      />
    }
    
  </div>)
}