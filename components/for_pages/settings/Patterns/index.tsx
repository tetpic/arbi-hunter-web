import styles from './index.module.scss'
import Button from 'components/ui/Button'
import { usePatternContext } from 'context/pattern_state'
import { useEffect, useState } from 'react'
import PatternItem from './PatternItem'
import useTranslation from 'next-translate/useTranslation'


export default function Patterns() {
  const [creation, setCreation] = useState<boolean>(false)
  const patternContext = usePatternContext()
  const {t} = useTranslation()

  const createPatternHandler = () => {
    setCreation(true)
  }

  useEffect(()=>{
    patternContext.setPatterns()
  }, [])


  return (<div className={styles.root}> 
  <div className={styles.wrapper}>
      {patternContext.patterns && patternContext.patterns.size > 0 && 
      [...patternContext.patterns.values()].map(el=> 
        <PatternItem pattern={el} key={el.id}/>
        )}
      {creation&& patternContext.patternsNotExist?.size >0 &&
      <PatternItem new/>
    }
  </div>
    {patternContext.patternsNotExist?.size > 0 && !creation &&
    <Button styleType={['gradient']} className={styles.createNew} onClick={createPatternHandler}>{t('create')}</Button>
    }
  </div>)
}