import classNames from 'classnames'
import ArrowDownSvg from 'components/svg/ArrowDownSvg'
import CheckSvg from 'components/svg/CheckSvg'
import Accordeon from 'components/ui/Accordeon'
import Spinner from 'components/ui/Spinner'
import { useCoursesContext } from 'context/courses_state'
import ICourse, { ICourseBlock } from 'data/interfaces/ICourse'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { colors } from 'styles/variables'
import Formatter from 'utils/formatter'
import styles from './index.module.scss'

interface Props {
  course: ICourse
}

export default function CourseModules({course}: Props) {
  const {modules, setCourseBlocks} = useCoursesContext()
  const [loadingBlocks, setLoadingBlocks] = useState<boolean>(true)
  const [activeModule, setActiveModule] = useState<ICourseBlock>(null)
  const itemsRefs = useRef<Map<ICourseBlock, HTMLDivElement>>(new Map())
  const filePath = process.env.files

  useEffect(()=>{
    if(modules.size === 0) {
      setCourseBlocks(course.id)
      .then(res => {
        setLoadingBlocks(false)
      })
    }  
    else {
      setLoadingBlocks(false)
    }
  }, [])

  const onTitleClick = (c: ICourseBlock) => {
    setActiveModule(state=> state===c?null:c)
  }

  return (<div className={styles.root}> 
    {!loadingBlocks && modules.size > 0 &&
      [...modules.entries()].map(([k, v])=> (
        <div className={styles.item}>
          <div className={styles.top} onClick={() => onTitleClick(k)}>
            <Image className={styles.image} src={filePath + k.image.source} width={65} height={48} alt={'course title'}/>
            <p className={styles.title}>{k.title}</p>
            <p className={styles.counter}>{k.stepsCount} {Formatter.pluralize(Number(k.stepsCount), 'урок', 'урока', 'уроков')}</p>
            <ArrowDownSvg className={classNames(styles.arrow, activeModule === k&&styles.arrow_active)}/>
          </div>
          <Accordeon isActive={activeModule === k}>
            <>
            {v.length > 0 && 
              v.map((el, index) => {
                return (
                  <div className={classNames(styles.step)}>
                      <p className={styles.stepTitle}>{index + 1}. {el.title} <CheckSvg className={styles.checkSvg}/></p>
                      <div className={styles.stepBody} dangerouslySetInnerHTML={{__html: el.body}}></div>
                  </div>
                )
              })
            }
          </>
          </Accordeon>
        </div>
      ))
      ||
      loadingBlocks && <Spinner size={32} color={colors.yellow}/>
    }
  </div>)
}