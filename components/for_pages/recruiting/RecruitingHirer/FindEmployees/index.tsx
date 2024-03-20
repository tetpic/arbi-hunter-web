import styles from './index.module.scss'

import Image from 'next/image'
import register from 'images/recruiting/register.png'
import registerLight from 'images/recruiting/registerLight.png'
import land_vacancy from 'images/recruiting/land_vacancy.png'
import land_vacancyLight from 'images/recruiting/land_vacancyLight.png'
import star from 'images/recruiting/star.png'
import chain from 'images/recruiting/chain.svg'
import chainGradient from 'images/recruiting/chainGradient.svg'
import { useRef } from 'react'
import { useAppContext } from 'context/state'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'
import P from '@/components/ui/P'
import { AppTheme } from 'types/enums'

interface Props {
}

export default function FindEmployees(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size
  const isLightTheme = appContext.theme === AppTheme.Light

  const triggerRef1 = useRef<HTMLImageElement>(null!)
  const triggerRef2 = useRef<HTMLImageElement>(null!)
  const triggerRef3 = useRef<HTMLImageElement>(null!)

  useTriggerOnVisible(triggerRef1, ()=> {
    triggerRef1.current?.classList.add(styles['image_active'], styles['image_1'])
  })
  useTriggerOnVisible(triggerRef2, ()=> {
    triggerRef2.current?.classList.add(styles['image_active'], styles['image_2'])
  })
  useTriggerOnVisible(triggerRef3, ()=> {
    triggerRef3.current?.classList.add(styles['image_active'], styles['image_3'])
  })
  

  return (<div className={styles.root} > 
    <div className={styles.item} >
      <Image src={isLightTheme?registerLight: register} ref={triggerRef1} className={styles.image} width={200} height={200} alt={'register'}/>
      <P styleType={['fs20', 'w600']} useThemeColor className={styles.step}>
        Шаг 1
      </P>
      <P styleType={['fs20', 'w600']} useThemeColor className={styles.title}>Зарегистрируйтесь</P>
      <P styleType={['large']} useThemeColor className={styles.desc}>И получите возможность просматривать базу соискателей</P>
    </div>
    {!isTabletWidth &&
      <Image src={isLightTheme?chainGradient:chain } alt={'chain'}/>
    }
    <div className={styles.item} >
      <Image src={ isLightTheme?land_vacancyLight:land_vacancy} ref={triggerRef2} className={styles.image} width={200} height={200} alt={'land vacancy'}/>
      <P styleType={['fs20', 'w600']} useThemeColor className={styles.step}>Шаг 2</P>
      <P styleType={['fs20', 'w600']} useThemeColor className={styles.title}>Создайте вакансию</P>
      <P styleType={['large']} useThemeColor className={styles.desc}>Чтобы получать входящие отклики от соискателей</P>
    </div>
    {!isTabletWidth &&
      <Image  src={isLightTheme?chainGradient:chain } alt={'chain'}/>
    }
    <div className={styles.item } >
      <Image src={star} ref={triggerRef3} className={styles.image} width={200} height={200}  alt={'star'}/>
      <P styleType={['fs20', 'w600']} useThemeColor  className={styles.step}>Шаг 3</P>
      <P styleType={['fs20', 'w600']} useThemeColor className={styles.title}>Выбирайте лучших</P>
      <P styleType={['large']} useThemeColor className={styles.desc}>Все отклики с базой данных будут доступны вам неограниченное время</P>
    </div>
  </div>)
}