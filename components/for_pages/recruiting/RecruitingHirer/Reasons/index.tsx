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


interface Props {
}

export default function Reasons(props: Props) {
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
        Почему стоит <br/>
        разместить вакансию <br/>
        в <span className={styles.title_purple}>Arbi</span>Hunter?
      </P>
      <Image src={isLightTheme?bucketLight:bucket} className={styles.bucket}  width={200} height={200} alt={'bucket'}/>
    </div>
    <div className={styles.right}>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          Единая база соискателей
        </P>
        <P styleType={['large', ]} useThemeColor className={styles.desc}>
          Больше не нужно искать по разным площадкам, все кандидаты из сферы ждут вашего предложения после регистрации
        </P>
      </div>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          Удобная система поиска
        </P>
        <P styleType={['large', ]} useThemeColor className={styles.desc}>
          Еще никогда поиск сотрудников не был так удобен, благодаря встроенным расширенным фильтрам с нужным набором навыков
        </P>
      </div>
      <div className={classNames(styles.item, isLightTheme&&styles.item_light)}>
        <div className={isLightTheme?styles.lightImage:styles.image}>
          <Image src={walletWhite} alt={'wallet'}/>
        </div>
        <P styleType={['huge', 'w600' ]} useThemeColor className={styles.title}>
          Поиск с любого устройства
        </P>
        <P styleType={['large',]} useThemeColor className={styles.desc}>
          Наш сайт и мобильное приложение позволят вам заниматься поиском сотрудников с любого устройства
        </P>
      </div>
    </div>

  </div>)
}