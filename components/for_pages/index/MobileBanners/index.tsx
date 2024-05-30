import P from '@/components/ui/P'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import Image from 'next/image'

interface Props {
  type: 'cvCreate'|'vacancyCreate'|'vipCv'|'vipVacancy'
}

export default function MobileBanners(props: Props) {

  const vacancyCreate = (
    <div className={styles.vacancyBanner}>
    <P style={{gridArea: 't'}} styleType={['w800', 'large']} useThemeColor>Создайте вакансию</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>Нанимай лучших в своем деле!</P>
    <Button href={'/create/vacancy'} styleType={['gradient']} className={styles.create}>Создать</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateCvBanner.png'} alt={''} width={115} height={115}/>
    </div>
  </div>
  )

  const cvCreate = (
    <div className={styles.cvBanner}>
    <P style={{gridArea: 't'}} styleType={['w800', 'large']} useThemeColor>Создайте резюме</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>Найди работу мечты в лучшей компании!</P>
    <Button href={'/create/cv'} styleType={['gradient']} className={styles.create}>Создать</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateCvBanner.png'} alt={''} width={115} height={115}/>
    </div>
  </div>
  )

  const vipCv = (
    <div className={styles.vipCv}>
    <P style={{gridArea: 't'}} styleType={['w800', 'large']} useThemeColor>VIP-резюме</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>Нанимай лучших в своем деле</P>
    <Button href={'/recruiting'} styleType={['gradient', 'phoneWide']} className={styles.create}>Смотреть все vip-резюме</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateVacancyBanner.png'} alt={''} width={120} height={82}/>
    </div>
  </div>
  )
  const vipVacancy = (
    <div className={styles.vipVacancy}>
    <P style={{gridArea: 't'}} styleType={['w800', 'large']} useThemeColor>VIP-вакансии</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>Найди работу мечты в лучшей компании!</P>
    <Button href={'/recruiting'} styleType={['gradient', 'phoneWide']} className={styles.create}>Смотреть все vip-вакансии</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateVacancyBanner.png'} alt={''} width={120} height={82}/>
    </div>
  </div>
  )

  const getItem = () => {
    switch(props.type) {
      case 'cvCreate':
        return cvCreate
      case 'vacancyCreate':
        return vacancyCreate
      case 'vipCv':
        return vipCv
      case 'vipVacancy':
        return vipVacancy
    }
  }

  return (<>
  {getItem()}
  </>)
}