import { usePersonalContext } from 'context/personal_state'
import styles from './index.module.scss'
import EditableBlock from '../EditableBlock'

interface Props {
}

export default function PersonalBody(props: Props) {
  const personalContext = usePersonalContext()


  return (<div className={styles.root}> 
    {personalContext.personalPage.blocks.length > 0 &&
      personalContext.personalPage.blocks.map((el, i) => {
        return <EditableBlock key={i} block={el} assets={personalContext.personalPage.assets.filter(a=> el.assets.includes(a.id))}/>
      })
    }
  </div>)
}