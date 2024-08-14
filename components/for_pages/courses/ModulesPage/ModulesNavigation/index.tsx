import P from '@/components/ui/P'
import styles from './index.module.scss'

import classNames from 'classnames'
import Accordeon from 'components/ui/Accordeon'
import { useCoursesContext } from 'context/courses_state'
import { ICourseBlock, ICourseStep } from 'data/interfaces/ICourse'

interface Props {
  activeBlock: ICourseBlock
  activeStep: ICourseStep
  changeBlock: (b: ICourseBlock) => void
  changeStep: (s: ICourseStep) => void
}

export default function ModulesNavigation(props: Props) {
  const {courseModules, courseBlocks} = useCoursesContext()

  return (<div className={styles.root}> 
    {courseModules.size >0 && [...courseModules.entries()].map(([k, v], i)=> {
      return (<>
        <P useThemeColor styleType={['w500', 'medium']} className={styles.moduleTitle}>{i+1}.{k.title}</P>
        <div className={styles.moduleWrapper}>
          {courseBlocks.size>0&&[...courseBlocks.entries()].filter(([fk, fv])=> fk.courseModuleId === k.id).map(([key, value], index)=> {
            return (<div className={classNames(styles.module, props.activeBlock === key&&styles.module_active) } key={key.id}>
                <P useThemeColor styleType={['medium', 'w500']} onClick={()=> props.changeBlock(key)} className={styles.title}><span>{index+1}</span>  {key.title}</P>
                {value.length > 0 &&
                  <Accordeon 
                  isActive={props.activeBlock === key}
                  >
                    <div className={styles.itemsWrapper}>
                      {value.map(el=>{
                        return (
                          <p key={el.id} onClick={()=> props.changeStep(el)} className={classNames(styles.item, props.activeStep === el&&styles.item_active)}> <div className={styles.side}></div> <span>{el.title}</span></p>
                        )
                      })}
                    </div>
                    
                  </Accordeon>
                }
              </div>)
            })
          }
        </div>
      </>
      )})}
     </div>
  )
}