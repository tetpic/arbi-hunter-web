import P from '@/components/ui/P'
import styles from './index.module.scss'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

interface Props {
  type: 'cvCreate'|'vacancyCreate'|'vipCv'|'vipVacancy'
}

export default function MobileBanners(props: Props) {
  const {t} = useTranslation()

  const vacancyCreate = (
    <div className={styles.vacancyBanner}>
    <P style={{gridArea: 't'}} styleType={['w800', 'huge']} useThemeColor>{t('banner_createVacancy')}</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>{t('banner_hireTheBest')}</P>
    <Button href={'/create/vacancy'} styleType={['gradient']} className={styles.create}>{t('create')}</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateCvBanner.png'} alt={''} width={115} height={115}/>
    </div>
  </div>
  )

  const cvCreate = (
    <div className={styles.cvBanner}>
    <P style={{gridArea: 't'}} styleType={['w800', 'huge']} useThemeColor>{t('banner_createCv')}</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>{t('banner_findThebestJob')}</P>
    <Button href={'/create/cv'} styleType={['gradient']} className={styles.create}>{t('create')}</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateCvBanner.png'} alt={''} width={115} height={115}/>
    </div>
  </div>
  )

  const vipCv = (
    <div className={styles.vipCv}>
    <P style={{gridArea: 't'}} styleType={['w800', 'huge']} useThemeColor>{t('banner_vipCvs')}</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>{t('banner_hireTheBest')}</P>
    <Button href={'/recruiting'} styleType={['gradient', 'phoneWide']} className={styles.create}>{t('banner_watchAllVipCvs')}</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateVacancyBanner.png'} alt={''} width={480} height={328}/>
    </div>
  </div>
  )
  const vipVacancy = (
    <div className={styles.vipVacancy}>
    <P style={{gridArea: 't'}} styleType={['w800', 'huge']} useThemeColor>{t('banner_vipVacancies')}</P>
    <P style={{gridArea: 'd'}}  styleType={['small']} useThemeColor>{t('banner_findThebestJob')}</P>
    <Button href={'/recruiting'} styleType={['gradient', 'phoneWide']} className={styles.create}>{t('banner_watchAllVipVacancies')}</Button>
    <div className={styles.imageWrapper} style={{gridArea: 'i'}}>
      <Image src={'/images/forCreateVacancyBanner.png'} alt={''} width={480} height={328}/>
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