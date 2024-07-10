import styles from './index.module.scss'

import Image from 'next/image'
import bucket from 'images/recruiting/bucket.png'
import bucketLight from 'images/recruiting/bucketLight.png'
import hirer1reason from 'images/recruiting/hirer1reason.png'
import employee1reason from 'images/recruiting/employee1reason.png'
import hirer2reason from 'images/recruiting/hirer2reason.png'
import hirer3reason from 'images/recruiting/hirer3reason.png'
import { useRef } from 'react'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { ProfileType } from 'data/interfaces/IRegistration'


interface Props {
  profileType: ProfileType
}

export default function Reasons({profileType}: Props) {
  const {t} = useTranslation()
  const {theme} = useAppContext()
  const isLightTheme = theme === AppTheme.Light
  const triggerRef = useRef<HTMLDivElement>(null!)
  useTriggerOnVisible(triggerRef, ()=> {
    const bucket = document.querySelector(`.${styles.bucket}`)
    const items = document.querySelectorAll(`.${styles.item}`)
    if(!bucket || !items) return

    bucket.classList.add(`${styles.bucket_active}`)
    items.forEach((el, index)=> {
      setTimeout(()=> {
        el.classList.add(`${styles.item_active}`)
      }, 300 * index+1)
    })
  },
  {offset: 100}
  )  

  const hireTexts = {
    title1: 'landing_hir_reason_title1',
    title2: 'landing_hir_reason_title2',
    subtitle1: 'landing_hir_reason_subTitile1',
    subtitle2: 'landing_hir_reason_subTitile2',
    subtitle3: 'landing_hir_reason_subTitile3',
    desc1: 'landing_hir_reason_desc1',
    desc2: 'landing_hir_reason_desc2',
    desc3: 'landing_hir_reason_desc3',
  }

  const employeeTexts = {
    title1: 'landing_em_reason_title1',
    title2: 'landing_em_reason_title2',
    subtitle1: 'landing_em_reason_subTitile1',
    subtitle2: 'landing_em_reason_subTitile2',
    subtitle3: 'landing_em_reason_subTitile3',
    desc1: 'landing_em_reason_desc1',
    desc2: 'landing_em_reason_desc2',
    desc3: 'landing_em_reason_desc3',
  }

  const texts = profileType === ProfileType.Hirer?hireTexts:employeeTexts

  return (<div className={styles.root} ref={triggerRef}> 
    <div className={styles.left}>
      <P styleType={['fs32', 'w600']} useThemeColor className={styles.title}>
        {t(texts.title1)} <br/>
        {t(texts.title2)} <br/>
        {t('landing_in')} <span className={styles.title_purple}>Arbi</span>Hunter?
      </P>
      <Image src={isLightTheme?bucketLight:bucket} className={styles.bucket}  width={200} height={200} alt={'bucket'}/>
    </div>
    <div className={styles.right}>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={profileType === ProfileType.Hirer?hirer1reason: employee1reason} alt={'wallet'} width={76} height={76}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          {t(texts.subtitle1)}
        </P>
        <P styleType={['large', ]} useThemeColor className={styles.desc}>
          {t(texts.desc1)}
        </P>
      </div>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={hirer2reason} alt={'wallet'}  width={76} height={76}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          {t(texts.subtitle2)}
        </P>
        <P styleType={['large', ]} useThemeColor className={styles.desc}>
          {t(texts.desc2)}
        </P>
      </div>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={hirer3reason} alt={'wallet'} width={76} height={76}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          {t(texts.subtitle3)}
        </P>
        <P styleType={['large',]} useThemeColor className={styles.desc}>
          {t(texts.desc3)}
        </P>
      </div>
    </div>

  </div>)
}