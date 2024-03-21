import Button from '@/components/ui/Button'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
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
  const router = useRouter()
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

  // const toPreview = () => {
  //   router.push(props.type === 'cv'? `/preview/cv/${creationContext.draftId.current}`: `/preview/vacancy/${creationContext.draftId.current}`)
  // }

  return (<div className={styles.root}> 
  <P styleType={['huge', 'w600', 'textCenter']}>Выберите тариф</P>
  <div className={styles.tariffItems}>
    {tariffs.size > 0 &&[...tariffs.values()].map(el => {
      return (
        <>
        {/* @ts-ignore */}
        <div className={classnames(styles.tariff)} style={{'--gradientColor1': '#'+el.colors[0], '--gradientColor2': '#'+el.colors[1]}} onClick={()=>props.onSave(undefined, el.id)}>
          <div className={styles.top}>
            <Image src={FILES + el.icon.source} alt={''} width={70} height={70} className={el.key.includes('Vip')?styles.crown:styles.topIcon}/>
            {/* <BriefCaseBigSvg className={styles.topIcon}/> */}
            <P styleType={['w500', 'large']} className={styles.tariffType}>{el.name}</P>
            <P styleType={['w500', 'medium', 'alignCenter']}><ArbiCoinSvg/>{el.price === 0? 'Бесплатно': (<><span className={styles.big}>{el.price}</span>/ {el.period} дней</>)}</P>
          </div>
          <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
            {el.description}
          </P>
          <Button styleType={['gradient', 'wide']} title={'saveVacancy1'} >{props.setText ||'Разместить'}</Button>
        </div>
        </>
      )
    })}
    {/* <div className={classnames(styles.tariff, styles.tariff_red)}>
      <div className={styles.top}>
        <BriefCaseBigSvg className={styles.topIcon}/>
        <P styleType={['w500', 'large']} className={styles.tariffType}>{props.type=== 'cv'? 'Резюме': 'Вакансия'} “Стандарт”</P>
        <P styleType={['w500', 'medium', 'alignCenter']}><ArbiCoinSvg/> Бесплатно</P>
      </div>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Выделяйтесь среди всех
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Чаще получайте отклики
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Выделяйтесь среди всех
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Чаще получайте отклики
      </P>
      <Button styleType={['gradient', 'wide']} title={'saveVacancy1'} onClick={()=>props.onSave()}>{props.setText ||'Разместить'}</Button>
    </div>
    <div className={classnames(styles.tariff, styles.tariff_gold)}>
      <div className={styles.top}>
        <Image className={styles.crown} src={'/icons/crown.png'} width={90} height={79} alt='crown'/>
        <P styleType={['w500', 'large']} className={styles.tariffType}>{props.type=== 'cv'? 'Резюме': 'Вакансия'} “VIP”</P>
        <P styleType={['w500', 'medium', 'alignCenter']} className={styles.tariffPrice}><ArbiCoinSvg className={styles.bigCoin}/> <span className={styles.big}>49</span>/ 30 дней</P>
      </div>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Выделяйтесь среди всех
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Чаще получайте отклики
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Выделяйтесь среди всех
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Чаще получайте отклики
      </P>
      <Button styleType={['gradient', 'wide']} title={'saveVacancy2'} onClick={()=>props.onSave()}>{props.setText ||'Разместить'}</Button>
    </div>
    <div className={classnames(styles.tariff, styles.tariff_blue)}>
      <div className={styles.top}>
        <BigPlusSvg className={styles.topIcon}/>
        <P styleType={['w500', 'large']} className={styles.tariffType}>{props.type=== 'cv'? 'Резюме': 'Вакансия'} “Стандарт +”</P>
        <P styleType={['w500', 'medium', 'alignCenter']} className={styles.tariffPrice}><ArbiCoinSvg className={styles.bigCoin}/> <span className={styles.big}>49</span>/ 30 дней</P>
      </div>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Выделяйтесь среди всех
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Чаще получайте отклики
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Выделяйтесь среди всех
      </P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}>
        <CheckRadialSvg className={styles.check}/> Чаще получайте отклики
      </P>
      <Button styleType={['gradient', 'wide']} title={'saveVacancy3'} onClick={()=>props.onSave()}>{props.setText ||'Разместить'}</Button>
    </div> */}
  </div>
  <div className={styles.buttonsWrapper}>
    <Button styleType={['black']} onClick={props.onBack}>Назад</Button>
    <Button 
    styleType={['gradient']} 
    title={'preview'} 
    onClick={()=> {
      props.onPreview?.()
      // props.onSave(true)
    }
    }>
      Предпросмотр {props.type === 'cv'?  'резюме': 'вакансии'}
    </Button>
  </div>
  </div>)
}