import Button from 'components/ui/Button'
import { usePatternContext } from 'context/pattern_state'
import { useEffect } from 'react'
import styles from './index.module.scss'
import PatternItem from './PatternItem'

interface Props {
}



export default function Patterns(props: Props) {

  const patternContext = usePatternContext()

  useEffect(()=>{
    patternContext.setPatterns()
  
  }, [])

  return (<div className={styles.root}> 
    {patternContext.patterns && patternContext.patterns.size > 0 && 
    [...patternContext.patterns.values()].map(el=> 
      <PatternItem pattern={el}/>
    )}
    <Button className={styles.createNew}>Создать</Button>
  </div>)
}