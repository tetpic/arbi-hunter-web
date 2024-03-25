import Button from '@/components/ui/Button'
import styles from './index.module.scss'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import P from '@/components/ui/P'
import classnames from 'classnames'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import { useEffect } from 'react'
import TariffRepository from 'data/repositories/TariffRepository'
import { PurchaseType } from 'types/enums'
import Image from 'next/image'
import { FILES } from 'types/constants'

interface Props {
  onSave?: (replace?: boolean, tariffId?: number) =>void
  onBack?: () =>void
  onPreview?: ()=>void
  type?: 'cv'|'vacancy'
  setText?: string
}

export default function SetTariff(props: Props) {
  const creationContext = useCreateVcCvContext()
  const tariffs = creationContext.tariffs

  useEffect(()=>{
    if(tariffs.size === 0) {
      TariffRepository.getTariff(props.type==='cv'? PurchaseType.CvTariff:PurchaseType.VacancyTariff).then(res=>{
        creationContext.setTariffs(state => {
          res.forEach(el => {
            state.set(el.id, el)
          })
          return new Map(state)
        })
      })
    }
  }, [])


  return (<div className={styles.root}> 
  <P styleType={['huge', 'w600', 'textCenter']}>Выберите тариф</P>
  <div className={styles.tariffItems}>
    {tariffs.size > 0 &&[...tariffs.values()].filter(el => {
      if(creationContext.currentCv?.subscriptions||creationContext.currentVc?.subscriptions) {
        return el.price >= tariffs.get(creationContext.currentCv?.subscriptions?.tariff.id||creationContext.currentVc?.subscriptions?.tariff.id).price
      }
      else {
        return true
      }
    }).map(el => {
      return (
        <>
        {/* @ts-ignore */}
        <div className={classnames(styles.tariff)} style={{'--gradientColor1': '#'+el.colors[0], '--gradientColor2': '#'+el.colors[1]}} key={el.id} onClick={()=>props.onSave(undefined, el.id)}>
          <div className={styles.top}>
            <Image src={FILES + el.icon.source} alt={''} width={70} height={70} className={el.key.includes('Vip')?styles.crown:styles.topIcon}/>
            <P styleType={['w500', 'large']} className={styles.tariffType}>{el.name}</P>
            <P styleType={['w500', 'medium', 'alignCenter']}><ArbiCoinSvg/>{el.price === 0? 'Бесплатно': (<><span className={styles.big}>{el.price}</span>/ {el.period} дней</>)}</P>
          </div>
          <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
            {el.description}
          </P>
          <Button 
          styleType={['gradient', 'wide']} 
          title={'save_'+el.key} 
          >
            {
            ((el.id === creationContext.currentCv?.subscriptions?.tariff.id||el.id === creationContext.currentVc?.subscriptions?.tariff.id)&& 'Сохранить')||
            props.setText ||'Разместить'}
          </Button>
        </div>
        </>
      )
    })}
  </div>
  <div className={styles.buttonsWrapper}>
    <Button styleType={['black']} onClick={props.onBack}>Назад</Button>
    <Button 
    styleType={['gradient']} 
    title={'preview'} 
    onClick={()=> {
      props.onPreview?.()
    }
    }>
      Предпросмотр {props.type === 'cv'?  'резюме': 'вакансии'}
    </Button>
  </div>
  </div>)
}