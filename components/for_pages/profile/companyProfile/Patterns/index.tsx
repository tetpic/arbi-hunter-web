import styles from './index.module.scss'
import Button from 'components/ui/Button'
import { usePatternContext } from 'context/pattern_state'
import Scrollbars from 'rc-scrollbars'
import { useEffect, useState } from 'react'
import PatternItem from './PatternItem'


export default function Patterns() {
  const [creation, setCreation] = useState<boolean>(false)
  const patternContext = usePatternContext()

  const createPatternHandler = () => {
    setCreation(true)
  }

  useEffect(()=>{
    patternContext.setPatterns()
  }, [])

  return (<div className={styles.root}> 
    <Scrollbars universal autoHide>
  <div className={styles.wrapper}>
      {patternContext.patterns && patternContext.patterns.size > 0 && 
      [...patternContext.patterns.values()].map(el=> 
        <PatternItem pattern={el} key={el.id}/>
        )}
      {creation&& 
      <PatternItem new/>
    }
  </div>
    </Scrollbars>
    {patternContext.patternsNotExist?.size > 0 && !creation &&
    <Button className={styles.createNew} onClick={createPatternHandler}>Создать</Button>
    }
  </div>)
}