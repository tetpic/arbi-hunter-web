import styles from './index.module.scss'

import Image from 'next/image'
import register from 'images/recruiting/register.png'
import land_vacancy from 'images/recruiting/land_vacancy.png'
import star from 'images/recruiting/star.png'
import chain from 'images/recruiting/chain.svg'
import { useEffect, useRef } from 'react'
import { useAppContext } from 'context/state'

interface Props {
}

export default function FindEmployees(props: Props) {
  const appContext = useAppContext()
  const {isTabletWidth} = appContext.size

  const triggerRef = useRef<HTMLDivElement>(null!)

  useEffect(()=>{
    if(window !== undefined) {
      const load = async () => {
        if (typeof window !== undefined) {
          const scrollmagic = (await import('scrollmagic')).default
          const controller = new scrollmagic.Controller()
          new scrollmagic.Scene({
            triggerElement: triggerRef.current,
            duration: 900,
            offset: -300
          })
          .on('enter', ()=> {
            document.querySelectorAll(`.${styles.image}`).forEach((el, index)=> el.classList.add(styles.image_active, styles['image_'+(index+1).toString()]))
          })
            .addTo(controller)
        }
      }
      load()
    }
  }, [])

  return (<div className={styles.root} ref={triggerRef}> 
    <div className={styles.item}>
      <Image src={register} className={styles.image} width={200} height={200} alt={'register'}/>
      <p className={styles.step}>Шаг 1</p>
      <p className={styles.title}>Зарегистрируйтесь</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
    {!isTabletWidth &&
      <Image src={chain} alt={'chain'}/>
    }
    <div className={styles.item}>
      <Image src={land_vacancy} className={styles.image} width={200} height={200} alt={'land vacancy'}/>
      <p className={styles.step}>Шаг 2</p>
      <p className={styles.title}>Разместите вакансию</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
    {!isTabletWidth &&
      <Image src={chain} alt={'chain'}/>
    }
    <div className={styles.item}>
      <Image src={star} className={styles.image} width={200} height={200}  alt={'star'}/>
      <p className={styles.step}>Шаг 3</p>
      <p className={styles.title}>Выбирайте лучших</p>
      <p className={styles.desc}>И получите доступ ко всем услугам</p>
    </div>
  </div>)
}