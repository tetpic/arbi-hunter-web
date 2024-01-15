import styles from './index.module.scss'

import Image from 'next/image'
import register from 'images/recruiting/register.png'
import land_vacancy from 'images/recruiting/land_vacancy.png'
import star from 'images/recruiting/star.png'
import chain from 'images/recruiting/chain.svg'
import { useRef } from 'react'
import { useAppContext } from 'context/state'
import { useTriggerOnVisible } from 'components/hooks/useTriggerOnVisible'

interface Props {
}

export default function FindEmployees(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

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
      <Image src={register} ref={triggerRef1} className={styles.image} width={200} height={200} alt={'register'}/>
      <p className={styles.step}>Шаг 1</p>
      <p className={styles.title}>Зарегистрируйтесь</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
    {!isTabletWidth &&
      <Image src={chain} alt={'chain'}/>
    }
    <div className={styles.item} >
      <Image src={land_vacancy} ref={triggerRef2} className={styles.image} width={200} height={200} alt={'land vacancy'}/>
      <p className={styles.step}>Шаг 2</p>
      <p className={styles.title}>Разместите вакансию</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
    {!isTabletWidth &&
      <Image src={chain} alt={'chain'}/>
    }
    <div className={styles.item } >
      <Image src={star} ref={triggerRef3} className={styles.image} width={200} height={200}  alt={'star'}/>
      <p className={styles.step}>Шаг 3</p>
      <p className={styles.title}>Выбирайте лучших</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
  </div>)
}