import classNames from 'classnames'
import Accordeon from 'components/ui/Accordeon'
import { useCoursesContext } from 'context/courses_state'
import { ICourseBlock, ICourseStep } from 'data/interfaces/ICourse'
import styles from './index.module.scss'

interface Props {
  activeModule: ICourseBlock
  activeStep: ICourseStep
  changeModule: (b: ICourseBlock) => void
  changeStep: (s: ICourseStep) => void

}

export default function ModulesNavigation(props: Props) {
  const {modules} = useCoursesContext()

  return (<div className={styles.root}> 
    {modules.size>0&&[...modules.entries()].map(([key, value])=> {
      return (<div className={classNames(styles.module, props.activeModule === key&&styles.module_active) }>
        <p onClick={()=> props.changeModule(key)} className={styles.title}>{key.title}</p>
        {value.length > 0 &&
          <Accordeon 
          isActive={props.activeModule === key}
          >
            <div className={styles.itemsWrapper}>
              {value.map(el=>{
                return (
                  <p onClick={()=> props.changeStep(el)} className={classNames(styles.item, props.activeStep === el&&styles.item_active)}>{el.title}</p>
                )
              })}
            </div>
            
          </Accordeon>
        }
      </div>)
    })}

  </div>)
}