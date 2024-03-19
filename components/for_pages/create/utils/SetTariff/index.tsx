import Button from '@/components/ui/Button'
import styles from './index.module.scss'
import { useRouter } from 'next/router'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import P from '@/components/ui/P'
import classnames from 'classnames'
import BriefCaseBigSvg from '@/components/svg/BriefCaseBigSvg'
import BigPlusSvg from '@/components/svg/BigPlusSvg'
import ArbiCoinSvg from '@/components/svg/ArbiCoinSvg'
import Image from 'next/image'
import CheckRadialSvg from '@/components/svg/CheckRadialSvg'

interface Props {
  onSave?: (replace?: boolean) =>void
  onBack?: () =>void
  onPreview?: ()=>void
  type?: 'cv'|'vacancy'
  setText?: string
}

export default function SetTariff(props: Props) {
  const router = useRouter()
  const creationContext = useCreateVcCvContext()

  // const toPreview = () => {
  //   router.push(props.type === 'cv'? `/preview/cv/${creationContext.draftId.current}`: `/preview/vacancy/${creationContext.draftId.current}`)
  // }

  return (<div className={styles.root}> 
  <P styleType={['huge', 'w600', 'textCenter']}>Выберите тариф</P>
  <div className={styles.tariffItems}>
    <div className={classnames(styles.tariff, styles.tariff_red)}>
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
    </div>
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