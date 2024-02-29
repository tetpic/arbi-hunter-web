import Button from '@/components/ui/Button'
import styles from './index.module.scss'
import Title from '@/components/ui/TitleForSection'
import { useRouter } from 'next/router'
import { useCreateVcCvContext } from 'context/createVcCv_state'
import Image from 'next/image'
import P from '@/components/ui/P'
import CheckSvg from '@/components/svg/CheckSvg'
import { colors } from 'styles/variables'

interface Props {
  onSave?: () =>void
  onBack?: () =>void
  type?: 'cv'|'vacancy'
}

export default function SetTariff(props: Props) {
  const router = useRouter()
  const creationContext = useCreateVcCvContext()

  const toPreview = () => {
    router.push(props.type === 'cv'? `/preview/cv/${creationContext.draftId.current}`: `/preview/vacancy/${creationContext.draftId.current}`)
  }

  return (<div className={styles.root}> 
  <Title title={'Выберите тариф'}/>
  <div className={styles.tariffItems}>
    <div className={styles.tariff}>
      <Image src={'/images/purpleDiamond.png'} alt={'diamond'} width={123} height={103}/>
      <P styleType={['w600', 'huge']}>VIP тариф</P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}> <CheckSvg color={colors.yellow} className={styles.check}/> Открытые контакты в откликах</P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}><CheckSvg color={colors.yellow} className={styles.check}/>До 15 подходящих резюме к каждой вакансии</P>
      <P styleType={['w600', 'huge', 'alignStart']}> от 350 000 ₽</P>
      <Button styleType={['gradient']} onClick={props.onSave}>Разместить вакансию</Button>
    </div>
    <div className={styles.tariff}>
      <Image src={'/images/purpleDiamond.png'} alt={'diamond'} width={123} height={103}/>
      <P styleType={['w600', 'huge']}>VIP тариф</P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}> <CheckSvg color={colors.yellow} className={styles.check}/> Открытые контакты в откликах</P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}> <CheckSvg color={colors.yellow} className={styles.check}/> До 15 подходящих резюме к каждой вакансии</P>
      <P styleType={['w600', 'huge']}>от 350 000 ₽</P>
      <Button styleType={['gradient']} onClick={props.onSave}>Разместить вакансию</Button>
    </div>
    <div className={styles.tariff}>
      <Image src={'/images/purpleDiamond.png'} alt={'diamond'} width={123} height={103}/>
      <P styleType={['w600', 'huge']}>VIP тариф</P>
      <P styleType={['w600', 'large', 'alignStart']} className={styles.desc}> <CheckSvg color={colors.yellow} className={styles.check}/> Открытые контакты в откликах</P>
      <P  styleType={['w600', 'large', 'alignStart']} className={styles.desc}> <CheckSvg color={colors.yellow} className={styles.check}/> До 15 подходящих резюме к каждой вакансии</P>
      <P  styleType={['w600', 'huge']}>от 350 000 ₽</P>
      <Button styleType={['gradient']} onClick={props.onSave}>Разместить вакансию</Button>
    </div>
  </div>
  <div className={styles.buttonsWrapper}>
    <Button styleType={['black']} onClick={props.onBack}>Назад</Button>
    <Button styleType={['gradient']} onClick={toPreview}>Предпросмотр {props.type === 'cv'?  'резюме': 'вакансии'}</Button>
  </div>
  </div>)
}