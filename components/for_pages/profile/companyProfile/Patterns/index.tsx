import Button from 'components/ui/Button'
import { usePatternContext } from 'context/pattern_state'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import PatternItem from './PatternItem'

interface Props {
}



export default function Patterns(props: Props) {

  const [creation, setCreation] = useState<boolean>(false)
  const patternContext = usePatternContext()

  const createPatternHandler = () => {
    setCreation(true)
  }


  useEffect(()=>{
    patternContext.setPatterns()
  
  }, [])

  return (<div className={styles.root}> 
    {patternContext.patterns && patternContext.patterns.size > 0 && 
    [...patternContext.patterns.values()].map(el=> 
      <PatternItem pattern={el}/>
    )}
    {creation&& 
    <PatternItem new/>
    }
    {patternContext.patternsNotExist?.size > 0 && !creation &&
    <Button className={styles.createNew} onClick={createPatternHandler}>Создать</Button>
    }
  </div>)
}