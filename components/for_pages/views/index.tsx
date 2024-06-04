import Title from '@/components/ui/TitleForSection'
import styles from './index.module.scss'
import { ProfileType } from 'data/interfaces/IRegistration'
import { useCvContext } from 'context/cv_state'
import { useVacancyContext } from 'context/vacancy_state'
import { useEffect, useRef, useState } from 'react'
import ViewItem from './ViewItem'
import ViewsRepository from 'data/repositories/ViewsRepository'
import { IView } from 'data/interfaces/IView'
import P from '@/components/ui/P'
import Spinner from '@/components/ui/Spinner'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  profileType:ProfileType
}

export default function Views(props: Props) {
  const cvContext = useCvContext()
  const vacancyContext = useVacancyContext()
  const {t} = useTranslation()
  const activeCvsItem = (cvContext.savedCvs.filter(el=> el.published === true&&el.subscriptions))
  const activeVacanciesItem = (vacancyContext.activeVacancies)
  const [views, setViewsState] = useState<Map<number, IView>>(new Map)
  const isInited = useRef<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)


  useEffect(()=>{
    props.profileType === ProfileType.Employee && cvContext.setSavedCvs()
    ||
    props.profileType === ProfileType.Hirer &&  vacancyContext.setVacancies()
  }, [])

  const getCvViews = async() => {
    const res = await Promise.all(activeCvsItem.map(el => ViewsRepository.getCvViews(el.id)))
    res.forEach(el => {
      setViewsState(state => {
        el.data.forEach(elItem => {
          state.set(elItem.id, elItem)
        })
        return new Map(state)
      })
    })
    setTimeout(() => {
      setIsLoaded(true)
    }, 50)
  }

  const getVacancyViews = async() => {
    const res = await Promise.all([...activeVacanciesItem.keys()].map(el => ViewsRepository.getVacancyViews(el)))
    res.forEach(el => {
      setViewsState(state => {
        el.data.forEach(elItem => {
          state.set(elItem.id, elItem)
        })
        return new Map(state)
      })
    })
    setTimeout(() => {
      setIsLoaded(true)
    }, 50)

  }

  useEffect(()=>{
    
    if(activeCvsItem.length > 0 && !isInited.current) {
      getCvViews()
      isInited.current = true
    }
    if(activeVacanciesItem&&activeVacanciesItem?.size > 0 && !isInited.current) {
      getVacancyViews()
      isInited.current = true
    }
  }, [activeCvsItem, activeVacanciesItem])



  return (<div className={styles.root}> 
    <Title title={t('views_allTime')} />
    <div className={styles.itemsWrapper}>
      {isLoaded&&views&&[...views.values()].map(view => {
        return <ViewItem key={view.id} view={view} />
      })
      ||
      isLoaded &&views&& views.size === 0 && <P styleType={['w500', 'medium']}>{t('views_empty')}</P>
      ||
      !isLoaded && <Spinner size={24}/>
    }
    </div>
  </div>)
}