import styles from './index.module.scss'

import Image from 'next/image'
import bucket from 'images/recruiting/bucket.png'
import bucketLight from 'images/recruiting/bucketLight.png'
import walletWhite from 'images/recruiting/walletWhite.png'
import { useRef } from 'react'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'
import P from '@/components/ui/P'
import { useAppContext } from 'context/state'
import { AppTheme } from 'types/enums'
import classNames from 'classnames'
import useTranslation from 'next-translate/useTranslation'


interface Props {
}

export default function Reasons(props: Props) {
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



  return (<div className={styles.root} ref={triggerRef}> 
    <div className={styles.left}>
      <P styleType={['fs32', 'w600']} useThemeColor className={styles.title}>
        {t('landing_hir_reason_title1')} <br/>
        {t('landing_hir_reason_title2')} <br/>
        {t('landing_in')} <span className={styles.title_purple}>Arbi</span>Hunter?
      </P>
      <Image src={isLightTheme?bucketLight:bucket} className={styles.bucket}  width={200} height={200} alt={'bucket'}/>
    </div>
    <div className={styles.right}>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          {t('landing_hir_reason_subTitile1')}
        </P>
        <P styleType={['large', ]} useThemeColor className={styles.desc}>
          {t('landing_hir_reason_desc1')}
        </P>
      </div>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          {t('landing_hir_reason_subTitile2')}
        </P>
        <P styleType={['large', ]} useThemeColor className={styles.desc}>
          {t('landing_hir_reason_desc2')}
        </P>
      </div>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          {t('landing_hir_reason_subTitile3')}
        </P>
        <P styleType={['large',]} useThemeColor className={styles.desc}>
          {t('landing_hir_reason_desc3')}
        </P>
      </div>
    </div>

  </div>)
}